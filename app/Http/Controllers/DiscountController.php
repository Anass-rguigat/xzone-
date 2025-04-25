<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Discount;
use App\Models\Server;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DiscountController extends Controller
{
    private function logAudit($event, $discount, $changes = null)
    {
        $oldValues = [];
        $newValues = [];

        if ($changes) {
            $oldValues = $changes['old'] ?? [];
            $newValues = $changes['new'] ?? [];
        }

        AuditLog::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'event' => $event,
            'auditable_type' => Discount::class,
            'auditable_id' => $discount->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    private function getServerIds(Discount $discount)
    {
        return $discount->servers->pluck('id')->toArray();
    }


    public function index()
    {
        $discounts = Discount::has('servers')->get();

        return Inertia::render('Discounts/Index', [
            'discounts' => $discounts
        ]);
    }

    public function create()
    {
        $servers = Server::all();

        return Inertia::render('Discounts/Create', [
            'servers' => $servers
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'discount_type' => 'required|in:percentage,fixed',
                'value' => [
                    'required',
                    'numeric',
                    'min:0.01',
                    function ($attribute, $value, $fail) use ($request) {
                        if ($request->discount_type === 'percentage' && $value >= 100) {
                            $fail('Le pourcentage doit être inférieur à 100%');
                        }

                        if ($request->discount_type === 'fixed') {
                            $servers = Server::findMany($request->server_ids);

                            $invalidServers = $servers->filter(function ($server) use ($value) {
                                return ($server->price - $value) < 0;
                            });

                            if ($invalidServers->isNotEmpty()) {
                                $serverList = $invalidServers->pluck('name')->join(', ');
                                $fail("Le montant fixe ne peut pas dépasser le prix des serveurs suivants : $serverList");
                            }
                        }
                    },
                ],
                'start_date' => 'nullable|date',
                'end_date' => 'required|date|after:start_date',
                'server_id' => 'nullable|exists:servers,id',
            ]);

            if ($request->server_id) {
                $server = Server::findOrFail($request->server_id);

                $existingDiscount = $server->discounts()->where('end_date', '>', Carbon::now())->first();
                if ($existingDiscount) {
                    throw ValidationException::withMessages([
                        'server_id' => 'Ce serveur a déjà une réduction active'
                    ]);
                }
            }

            $discount = Discount::create([
                'name' => $request->name,
                'discount_type' => $request->discount_type,
                'value' => $request->value,
                'start_date' => $request->start_date ?? Carbon::now(),
                'end_date' => $request->end_date,
            ]);

            if ($request->server_id) {
                $server = Server::findOrFail($request->server_id);
                $server->discounts()->attach($discount);
                $this->updateServerPrice($server, $discount);
            }

            $this->logAudit('created', $discount, [
                'new' => array_merge($discount->getAttributes(), ['servers' => $this->getServerIds($discount)])
            ]);

            return redirect()->route('discounts.index')->with('success', 'Discount created successfully');
        } catch (ValidationException $e) {
            return redirect()
                ->route('discounts.create')
                ->withErrors($e->errors())
                ->withInput();
        }
    }

    public function show(Discount $discount)
    {
        return view('discounts.show', compact('discount'));
    }

    public function edit(Discount $discount)
    {
        $servers = Server::whereDoesntHave('discounts', function ($query) use ($discount) {
            $query->where('end_date', '>', now())
                ->where('discounts.id', '!=', $discount->id);
        })->orWhereHas('discounts', function ($query) use ($discount) {
            $query->where('discounts.id', $discount->id);
        })->get();
        $associatedServers = $discount->servers;

        return Inertia::render('Discounts/Edit', [
            'discount' => $discount,
            'servers' => $servers,
            'associatedServers' => $associatedServers
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        try {

            $oldAttributes = $discount->getAttributes();
            $oldServers = $this->getServerIds($discount);


            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'discount_type' => 'required|in:percentage,fixed',
                'value' => [
                    'required',
                    'numeric',
                    'min:0.01',
                    function ($attribute, $value, $fail) use ($request, $discount) {
                        if ($request->discount_type === 'percentage' && $value >= 100) {
                            $fail('Le pourcentage doit être inférieur à 100%');
                        }

                        if ($request->discount_type === 'fixed') {
                            $servers = Server::findMany($request->server_ids);

                            $invalidServers = $servers->filter(function ($server) use ($discount, $value) {
                                $originalPrice = $this->calculateOriginalPrice($server, $discount);
                                return ($originalPrice - $value) <= 0;
                            });

                            if ($invalidServers->isNotEmpty()) {
                                $serverList = $invalidServers->pluck('name')->join(', ');
                                $fail("Le montant fixe dépasse le prix original de : $serverList");
                            }
                        }
                    },
                ],
                'start_date' => 'nullable|date',
                'end_date' => 'required|date|after:start_date',
                'server_ids' => 'nullable|array',
                'server_ids.*' => 'exists:servers,id',
            ]);

            DB::beginTransaction();

            foreach ($discount->servers as $server) {
                $this->revertServerPrice($server, $discount);
            }

            $discount->update([
                'name' => $request->name,
                'discount_type' => $request->discount_type,
                'value' => $request->value,
                'start_date' => $request->start_date ?? $discount->start_date,
                'end_date' => $request->end_date,
            ]);

            $discount->servers()->sync($request->input('server_ids', []));

            $discount->load('servers');
            foreach ($discount->servers as $server) {
                $this->updateServerPrice($server, $discount);
            }

            DB::commit();

            $this->logAudit('updated', $discount, [
                'old' => array_merge($oldAttributes, ['servers' => $oldServers]),
                'new' => array_merge($discount->getChanges(), ['servers' => $this->getServerIds($discount)])
            ]);

            return redirect()->route('discounts.index')->with('success', 'Réduction mise à jour avec succès');
        } catch (ValidationException $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur technique : ' . $e->getMessage())
                ->withInput();
        }
    }

    protected function calculateOriginalPrice(Server $server, Discount $discount)
    {
        if (!$server->discounts->contains($discount->id)) {
            return $server->price;
        }

        if ($discount->discount_type === 'percentage') {
            return $server->price / (1 - ($discount->value / 100));
        }

        if ($discount->discount_type === 'fixed') {
            return $server->price + $discount->value;
        }

        return $server->price;
    }

    public function destroy(Discount $discount)
    {
        $oldAttributes = $discount->getAttributes();
        $oldServers = $this->getServerIds($discount);

        foreach ($discount->servers as $server) {
            $this->revertServerPrice($server, $discount);
        }

        $discount->servers()->detach();

        $discount->delete();

        $this->logAudit('deleted', $discount, [
            'old' => array_merge($oldAttributes, ['servers' => $oldServers])
        ]);

        return redirect()->route('discounts.index')->with('success', 'Discount deleted and prices reverted successfully');
    }

    protected function updateServerPrice(Server $server, Discount $discount)
    {
        $originalPrice = $server->price;
        $newPrice = $originalPrice;

        if ($discount->discount_type === 'percentage') {
            $newPrice -= ($originalPrice * ($discount->value / 100));
        } elseif ($discount->discount_type === 'fixed') {
            $newPrice -= $discount->value;
        }

        $server->price = max($newPrice, 0);
        $server->save();
    }

    protected function revertServerPrice(Server $server, Discount $discount)
    {
        $currentPrice = $server->price;
        $originalPrice = $currentPrice;

        if ($discount->discount_type === 'percentage') {
            $originalPrice = $currentPrice / (1 - $discount->value / 100);
        } elseif ($discount->discount_type === 'fixed') {
            $originalPrice = $currentPrice + $discount->value;
        }

        $server->price = max($originalPrice, 0);
        $server->save();
    }

    public function deleteExpiredDiscounts()
    {
        $expiredDiscounts = Discount::where('end_date', '<', Carbon::now())->get();

        foreach ($expiredDiscounts as $discount) {
            $oldAttributes = $discount->getAttributes();
            $oldServers = $this->getServerIds($discount);

            $discount->servers()->each(function ($server) use ($discount) {
                $this->revertServerPrice($server, $discount);

                $server->discounts()->detach($discount->id);
            });

            $discount->delete();

            $this->logAudit('expired_deleted', $discount, [
                'old' => array_merge($oldAttributes, ['servers' => $oldServers])
            ]);
        }

        return response()->json(['message' => 'Expired discounts have been deleted and server prices restored.'], 200);
    }
}
