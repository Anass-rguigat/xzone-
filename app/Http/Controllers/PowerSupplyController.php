<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\PowerSupply;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PowerSupplyController extends Controller
{
    private function logAudit($event, $powerSupply, $changes = null)
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
            'auditable_type' => PowerSupply::class,
            'auditable_id' => $powerSupply->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $powerSupplies = PowerSupply::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('PowerSupplies/Index', ['powerSupplies' => $powerSupplies]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('PowerSupplies/Create', [
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
            'capacity' => 'required|integer|min:1',
            'efficiency' => 'required|string|max:255',
            'form_factor' => 'required|string|max:255',
            'modular' => 'required|boolean',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $powerSupply = PowerSupply::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'capacity' => $validated['capacity'],
            'efficiency' => $validated['efficiency'],
            'form_factor' => $validated['form_factor'],
            'modular' => $validated['modular'],
        ]);

        $this->logAudit('created', $powerSupply, ['new' => $powerSupply->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $powerSupply->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $powerSupply, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('power_supplies', 'public');
            $powerSupply->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $powerSupply, ['new' => ['image' => $path]]);
        }

        return redirect()->route('power-supplies.index');
    }

    public function edit(PowerSupply $powerSupply)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $powerSupply->load('brand', 'image', 'servers');
        return Inertia::render('PowerSupplies/Edit', [
            'powerSupply' => $powerSupply,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, PowerSupply $powerSupply)
    {
        $oldAttributes = $powerSupply->getAttributes();
        $oldServers = $powerSupply->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'efficiency' => 'required|string|max:255',
            'form_factor' => 'required|string|max:255',
            'modular' => 'required|boolean',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $powerSupply->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $powerSupply->price,
            'capacity' => $validated['capacity'] ?? $powerSupply->capacity,
            'efficiency' => $validated['efficiency'] ?? $powerSupply->efficiency,
            'form_factor' => $validated['form_factor'] ?? $powerSupply->form_factor,
            'modular' => $validated['modular'] ?? $powerSupply->modular,
        ]);

        $this->logAudit('updated', $powerSupply, [
            'old' => $oldAttributes,
            'new' => $powerSupply->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $powerSupply->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $powerSupply, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $powerSupply, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $powerSupply->image?->url;

            if ($powerSupply->image) {
                Storage::disk('public')->delete($powerSupply->image->url);
                $powerSupply->image()->delete();
            }

            $path = $request->file('image')->store('power_supplies', 'public');
            $powerSupply->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $powerSupply, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('power-supplies.index');
    }

    public function show(PowerSupply $powerSupply)
    {
        $powerSupply->load('brand', 'image', 'servers');
        return Inertia::render('PowerSupplies/Show', [
            'powerSupply' => $powerSupply,
        ]);
    }

    public function destroy(PowerSupply $powerSupply)
    {
        $oldAttributes = $powerSupply->getAttributes();
        $oldImage = $powerSupply->image?->url;

        if ($powerSupply->image) {
            Storage::disk('public')->delete($powerSupply->image->url);
            $powerSupply->image()->delete();
            $this->logAudit('image_deleted', $powerSupply, ['old' => ['image' => $oldImage]]);
        }

        $powerSupply->servers()->detach();
        $powerSupply->delete();

        $this->logAudit('deleted', $powerSupply, ['old' => $oldAttributes]);

        return redirect()->route('power-supplies.index');
    }
}