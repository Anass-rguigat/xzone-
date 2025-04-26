<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\CableConnector;
use App\Models\Brand;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CableConnectorController extends Controller
{
    private function logAudit($event, $cable, $changes = null)
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
            'auditable_type' => CableConnector::class,
            'auditable_id' => $cable->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $cables = CableConnector::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('CableConnectors/Index', ['cables' => $cables]);
    }

    public function create()
    {
        $brands = Brand::all();
        $servers = Server::all();

        return Inertia::render('CableConnectors/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'length' => 'required|numeric|min:1',
            'specifications' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cable = CableConnector::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'length' => $validated['length'],
            'specifications' => $validated['specifications'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('ajouter', $cable, ['new' => $cable->getAttributes()]);

        if (!empty($validated['server_ids'])) {
            $cable->servers()->attach($validated['server_ids']);
            $this->logAudit('attacher_serveurs ', $cable, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cable_connectors', 'public');
            $cable->image()->create(['url' => $path]);
            $this->logAudit('image_ajouter ', $cable, ['new' => ['image' => $path]]);
        }

        return redirect()->route('cable-connectors.index');
    }

    public function edit(CableConnector $cableConnector)
    {
        $brands = Brand::all();
        $servers = Server::all();
        $cableConnector->load('brand', 'image', 'servers');
        return Inertia::render('CableConnectors/Edit', [
            'cable' => $cableConnector,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, CableConnector $cableConnector)
    {
        $oldAttributes = $cableConnector->getAttributes();
        $oldServers = $cableConnector->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'length' => 'required|numeric|min:1',
            'specifications' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cableConnector->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'length' => $validated['length'],
            'specifications' => $validated['specifications'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('modifier ', $cableConnector, [
            'old' => $oldAttributes,
            'new' => $cableConnector->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $cableConnector->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('attacher_serveurs ', $cableConnector, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('détacher_serveurs', $cableConnector, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $cableConnector->image?->url;

            if ($cableConnector->image) {
                Storage::disk('public')->delete($cableConnector->image->url);
                $cableConnector->image()->delete();
            }

            $path = $request->file('image')->store('cable_connectors', 'public');
            $cableConnector->image()->create(['url' => $path]);
            
            $this->logAudit('image_modifier', $cableConnector, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('cable-connectors.index');
    }

    public function show(CableConnector $cableConnector)
    {
        $cableConnector->load('brand', 'image', 'servers');
        return Inertia::render('CableConnectors/Show', ['cable' => $cableConnector]);
    }

    public function destroy(CableConnector $cableConnector)
    {
        $oldAttributes = $cableConnector->getAttributes();
        $oldImage = $cableConnector->image?->url;

        if ($cableConnector->image) {
            Storage::disk('public')->delete($cableConnector->image->url);
            $cableConnector->image()->delete();
            $this->logAudit('image_supprimer', $cableConnector, ['old' => ['image' => $oldImage]]);
        }

        $cableConnector->servers()->detach();
        $cableConnector->delete();

        $this->logAudit('supprimer ', $cableConnector, ['old' => $oldAttributes]);

        return redirect()->route('cable-connectors.index');
    }
}