<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Battery;
use App\Models\Brand;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BatteryController extends Controller
{
    private function logAudit($event, $battery, $changes = null)
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
            'auditable_type' => Battery::class,
            'auditable_id' => $battery->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $batteries = Battery::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Batteries/Index', ['batteries' => $batteries]);
    }

    public function create()
    {
        $brands = Brand::all();
        $servers = Server::all();

        return Inertia::render('Batteries/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|numeric|min:1',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $battery = Battery::create([
            'name' => $validated['name'],
            'capacity' => $validated['capacity'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('created', $battery, ['new' => $battery->getAttributes()]);

        if (!empty($validated['server_ids'])) {
            $battery->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $battery, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('batteries', 'public');
            $battery->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $battery, ['new' => ['image' => $path]]);
        }

        return redirect()->route('batteries.index');
    }

    public function edit(Battery $battery)
    {
        $brands = Brand::all();
        $servers = Server::all();
        $battery->load('brand', 'image', 'servers');
        return Inertia::render('Batteries/Edit', [
            'battery' => $battery,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Battery $battery)
    {
        $oldAttributes = $battery->getAttributes();
        $oldServers = $battery->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|numeric|min:1',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $battery->update([
            'name' => $validated['name'],
            'capacity' => $validated['capacity'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('updated', $battery, [
            'old' => $oldAttributes,
            'new' => $battery->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $battery->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $battery, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $battery, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $battery->image?->url;

            if ($battery->image) {
                Storage::disk('public')->delete($battery->image->url);
                $battery->image()->delete();
            }

            $path = $request->file('image')->store('batteries', 'public');
            $battery->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $battery, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('batteries.index');
    }

    public function show(Battery $battery)
    {
        $battery->load('brand', 'image', 'servers');
        return Inertia::render('Batteries/Show', ['battery' => $battery]);
    }

    public function destroy(Battery $battery)
    {
        $oldAttributes = $battery->getAttributes();
        $oldImage = $battery->image?->url;

        if ($battery->image) {
            Storage::disk('public')->delete($battery->image->url);
            $battery->image()->delete();
            $this->logAudit('image_deleted', $battery, ['old' => ['image' => $oldImage]]);
        }

        $battery->servers()->detach();
        $battery->delete();

        $this->logAudit('deleted', $battery, ['old' => $oldAttributes]);

        return redirect()->route('batteries.index');
    }
}