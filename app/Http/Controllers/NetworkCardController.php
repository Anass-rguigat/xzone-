<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\NetworkCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NetworkCardController extends Controller
{
    private function logAudit($event, $networkCard, $changes = null)
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
            'auditable_type' => NetworkCard::class,
            'auditable_id' => $networkCard->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $networkCards = NetworkCard::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('NetworkCards/Index', ['networkCards' => $networkCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('NetworkCards/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'model' => 'required|string|max:255',
            'interface' => 'required|string|max:255',
            'speed' => 'required|integer|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $networkCard = NetworkCard::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'interface' => $validated['interface'],
            'speed' => $validated['speed'],
        ]);

        $this->logAudit('created', $networkCard, ['new' => $networkCard->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $networkCard->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $networkCard, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('network_cards', 'public');
            $networkCard->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $networkCard, ['new' => ['image' => $path]]);
        }

        return redirect()->route('network-cards.index');
    }

    public function edit(NetworkCard $networkCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $networkCard->load('brand', 'image', 'servers');
        return Inertia::render('NetworkCards/Edit', [
            'networkCard' => $networkCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, NetworkCard $networkCard)
    {
        $oldAttributes = $networkCard->getAttributes();
        $oldServers = $networkCard->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'interface' => 'required|string|max:255',
            'speed' => 'required|integer|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $networkCard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $networkCard->price,
            'model' => $validated['model'] ?? $networkCard->model,
            'interface' => $validated['interface'] ?? $networkCard->interface,
            'speed' => $validated['speed'] ?? $networkCard->speed,
        ]);

        $this->logAudit('updated', $networkCard, [
            'old' => $oldAttributes,
            'new' => $networkCard->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $networkCard->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $networkCard, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $networkCard, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $networkCard->image?->url;

            if ($networkCard->image) {
                Storage::disk('public')->delete($networkCard->image->url);
                $networkCard->image()->delete();
            }

            $path = $request->file('image')->store('network_cards', 'public');
            $networkCard->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $networkCard, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('network-cards.index');
    }

    public function show(NetworkCard $networkCard)
    {
        $networkCard->load('brand', 'image', 'servers');
        return Inertia::render('NetworkCards/Show', [
            'networkCard' => $networkCard,
        ]);
    }

    public function destroy(NetworkCard $networkCard)
    {
        $oldAttributes = $networkCard->getAttributes();
        $oldImage = $networkCard->image?->url;

        if ($networkCard->image) {
            Storage::disk('public')->delete($networkCard->image->url);
            $networkCard->image()->delete();
            $this->logAudit('image_deleted', $networkCard, ['old' => ['image' => $oldImage]]);
        }

        $networkCard->servers()->detach();
        $networkCard->delete();

        $this->logAudit('deleted', $networkCard, ['old' => $oldAttributes]);

        return redirect()->route('network-cards.index');
    }
}