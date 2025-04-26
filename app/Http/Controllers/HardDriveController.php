<?php

namespace App\Http\Controllers;

use App\Models\HardDrive;
use App\Models\AuditLog;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HardDriveController extends Controller
{
    private function logAudit($event, $hardDrive, $changes = null)
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
            'auditable_type' => HardDrive::class,
            'auditable_id' => $hardDrive->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $hardDrives = HardDrive::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('HardDrives/Index', ['hardDrives' => $hardDrives]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('HardDrives/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|in:hdd,ssd,nvme',
            'capacity' => 'required|integer|min:1',
            'interface' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $hardDrive = HardDrive::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'interface' => $validated['interface'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        $this->logAudit('ajouter', $hardDrive, ['new' => $hardDrive->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $hardDrive->servers()->attach($validated['server_ids']);
            $this->logAudit('attacher_serveurs', $hardDrive, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hard_drives', 'public');
            $hardDrive->image()->create(['url' => $path]);
            $this->logAudit('image_ajouter', $hardDrive, ['new' => ['image' => $path]]);
        }

        return redirect()->route('hard-drives.index');
    }

    public function edit(HardDrive $hardDrive)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $hardDrive->load('brand', 'image', 'servers');
        return Inertia::render('HardDrives/Edit', [
            'hardDrive' => $hardDrive,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, HardDrive $hardDrive)
    {
        $oldAttributes = $hardDrive->getAttributes();
        $oldServers = $hardDrive->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|in:hdd,ssd,nvme',
            'capacity' => 'required|integer|min:1',
            'interface' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $hardDrive->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $hardDrive->price,
            'capacity' => $validated['capacity'] ?? $hardDrive->capacity,
            'type' => $validated['type'] ?? $hardDrive->type,
            'interface' => $validated['interface'] ?? $hardDrive->interface,
            'stock' => $validated['stock'] ?? $hardDrive->stock,
        ]);

        $this->logAudit('modifier', $hardDrive, [
            'old' => $oldAttributes,
            'new' => $hardDrive->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $hardDrive->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('attacher_serveurs', $hardDrive, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('détacher_serveurs', $hardDrive, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $hardDrive->image?->url;

            if ($hardDrive->image) {
                Storage::disk('public')->delete($hardDrive->image->url);
                $hardDrive->image()->delete();
            }

            $path = $request->file('image')->store('hard_drives', 'public');
            $hardDrive->image()->create(['url' => $path]);
            
            $this->logAudit('image_modifier', $hardDrive, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('hard-drives.index');
    }

    public function show(HardDrive $hardDrive)
    {
        $hardDrive->load('brand', 'image', 'servers');
        return Inertia::render('HardDrives/Show', [
            'hardDrive' => $hardDrive,
        ]);
    }

    public function destroy(HardDrive $hardDrive)
    {
        $oldAttributes = $hardDrive->getAttributes();
        $oldImage = $hardDrive->image?->url;

        if ($hardDrive->image) {
            Storage::disk('public')->delete($hardDrive->image->url);
            $hardDrive->image()->delete();
            $this->logAudit('image_deleted', $hardDrive, ['old' => ['image' => $oldImage]]);
        }

        $hardDrive->servers()->detach();
        $hardDrive->delete();

        $this->logAudit('supprimer', $hardDrive, ['old' => $oldAttributes]);

        return redirect()->route('hard-drives.index');
    }
}