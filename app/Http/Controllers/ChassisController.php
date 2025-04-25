<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Chassis;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChassisController extends Controller
{
    private function logAudit($event, $chassis, $changes = null)
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
            'auditable_type' => Chassis::class,
            'auditable_id' => $chassis->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $chassis = Chassis::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Chassis/Index', ['chassis' => $chassis]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('Chassis/Create', [
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
            'form_factor' => 'required|string|max:255',
            'material' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $chassis = Chassis::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'form_factor' => $validated['form_factor'],
            'material' => $validated['material'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('created', $chassis, ['new' => $chassis->getAttributes()]);

        if (!empty($validated['server_ids'])) {
            $chassis->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $chassis, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chassis', 'public');
            $chassis->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $chassis, ['new' => ['image' => $path]]);
        }

        return redirect()->route('chassis.index');
    }

    public function edit(Chassis $chassis)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $chassis->load('brand', 'image', 'servers');
        return Inertia::render('Chassis/Edit', [
            'chassis' => $chassis,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Chassis $chassis)
    {
        $oldAttributes = $chassis->getAttributes();
        $oldServers = $chassis->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'form_factor' => 'required|string|max:255',
            'material' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $chassis->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'form_factor' => $validated['form_factor'],
            'material' => $validated['material'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('updated', $chassis, [
            'old' => $oldAttributes,
            'new' => $chassis->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $chassis->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $chassis, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $chassis, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $chassis->image?->url;

            if ($chassis->image) {
                Storage::disk('public')->delete($chassis->image->url);
                $chassis->image()->delete();
            }

            $path = $request->file('image')->store('chassis', 'public');
            $chassis->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $chassis, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('chassis.index');
    }

    public function show(Chassis $chassis)
    {
        $chassis->load('brand', 'image', 'servers');
        return Inertia::render('Chassis/Show', [
            'chassis' => $chassis,
        ]);
    }

    public function destroy(Chassis $chassis)
    {
        $oldAttributes = $chassis->getAttributes();
        $oldImage = $chassis->image?->url;

        if ($chassis->image) {
            Storage::disk('public')->delete($chassis->image->url);
            $chassis->image()->delete();
            $this->logAudit('image_deleted', $chassis, ['old' => ['image' => $oldImage]]);
        }

        $chassis->servers()->detach();
        $chassis->delete();

        $this->logAudit('deleted', $chassis, ['old' => $oldAttributes]);

        return redirect()->route('chassis.index');
    }
}