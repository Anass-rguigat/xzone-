<?php

namespace App\Http\Controllers;

use App\Models\FiberOpticCard;
use App\Models\AuditLog;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FiberOpticCardController extends Controller
{
    private function logAudit($event, $fiberOpticCard, $changes = null)
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
            'auditable_type' => FiberOpticCard::class,
            'auditable_id' => $fiberOpticCard->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $fiberOpticCards = FiberOpticCard::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('FiberOpticCards/Index', ['fiberOpticCards' => $fiberOpticCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('FiberOpticCards/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fiber_type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'speed' => 'required|numeric|min:0',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fiberOpticCard = FiberOpticCard::create([
            'name' => $validated['name'],
            'fiber_type' => $validated['fiber_type'],
            'brand_id' => $validated['brand_id'],
            'speed' => $validated['speed'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('created', $fiberOpticCard, ['new' => $fiberOpticCard->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $fiberOpticCard->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $fiberOpticCard, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('fiber_optic_cards', 'public');
            $fiberOpticCard->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $fiberOpticCard, ['new' => ['image' => $path]]);
        }

        return redirect()->route('fiber-optic-cards.index');
    }

    public function edit(FiberOpticCard $fiberOpticCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $fiberOpticCard->load('brand', 'image', 'servers');
        return Inertia::render('FiberOpticCards/Edit', [
            'fiberOpticCard' => $fiberOpticCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, FiberOpticCard $fiberOpticCard)
    {
        $oldAttributes = $fiberOpticCard->getAttributes();
        $oldServers = $fiberOpticCard->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fiber_type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'speed' => 'required|numeric|min:0',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fiberOpticCard->update([
            'name' => $validated['name'],
            'fiber_type' => $validated['fiber_type'] ?? $fiberOpticCard->fiber_type,
            'speed' => $validated['speed'] ?? $fiberOpticCard->speed,
            'power_rating' => $validated['power_rating'] ?? $fiberOpticCard->power_rating,
            'price' => $validated['price'] ?? $fiberOpticCard->price,
            'brand_id' => $validated['brand_id'],
        ]);

        $this->logAudit('updated', $fiberOpticCard, [
            'old' => $oldAttributes,
            'new' => $fiberOpticCard->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $fiberOpticCard->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $fiberOpticCard, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $fiberOpticCard, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $fiberOpticCard->image?->url;

            if ($fiberOpticCard->image) {
                Storage::disk('public')->delete($fiberOpticCard->image->url);
                $fiberOpticCard->image()->delete();
            }

            $path = $request->file('image')->store('fiber_optic_cards', 'public');
            $fiberOpticCard->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $fiberOpticCard, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('fiber-optic-cards.index');
    }

    public function show(FiberOpticCard $fiberOpticCard)
    {
        $fiberOpticCard->load('brand', 'image', 'servers');
        return Inertia::render('FiberOpticCards/Show', [
            'fiberOpticCard' => $fiberOpticCard,
        ]);
    }

    public function destroy(FiberOpticCard $fiberOpticCard)
    {
        $oldAttributes = $fiberOpticCard->getAttributes();
        $oldImage = $fiberOpticCard->image?->url;

        if ($fiberOpticCard->image) {
            Storage::disk('public')->delete($fiberOpticCard->image->url);
            $fiberOpticCard->image()->delete();
            $this->logAudit('image_deleted', $fiberOpticCard, ['old' => ['image' => $oldImage]]);
        }

        $fiberOpticCard->servers()->detach();
        $fiberOpticCard->delete();

        $this->logAudit('deleted', $fiberOpticCard, ['old' => $oldAttributes]);

        return redirect()->route('fiber-optic-cards.index');
    }
}