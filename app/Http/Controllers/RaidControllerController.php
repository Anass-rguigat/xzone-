<?php

namespace App\Http\Controllers;

use App\Models\RaidController;
use App\Models\AuditLog;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RaidControllerController extends Controller
{
    private function logAudit($event, $raidController, $changes = null)
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
            'auditable_type' => RaidController::class,
            'auditable_id' => $raidController->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $raidControllers = RaidController::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('RaidControllers/Index', ['raidControllers' => $raidControllers]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('RaidControllers/Create', [
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
            'supported_levels' => 'required|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $raidController = RaidController::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'model' => $validated['model'],
            'supported_levels' => $validated['supported_levels'],
        ]);

        $this->logAudit('created', $raidController, ['new' => $raidController->getAttributes()]);

        if (!empty($validated['server_ids'])) {
            $raidController->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $raidController, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('raid_controllers', 'public');
            $raidController->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $raidController, ['new' => ['image' => $path]]);
        }

        return redirect()->route('raid-controllers.index');
    }

    public function edit(RaidController $raidController)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $raidController->load('brand', 'image', 'servers');
        return Inertia::render('RaidControllers/Edit', [
            'raidController' => $raidController,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, RaidController $raidController)
    {
        $oldAttributes = $raidController->getAttributes();
        $oldServers = $raidController->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'model' => 'required|string|max:255',
            'supported_levels' => 'required|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $raidController->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'supported_levels' => $validated['supported_levels'],
        ]);

        $this->logAudit('updated', $raidController, [
            'old' => $oldAttributes,
            'new' => $raidController->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $raidController->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $raidController, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $raidController, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $raidController->image?->url;

            if ($raidController->image) {
                Storage::disk('public')->delete($raidController->image->url);
                $raidController->image()->delete();
            }

            $path = $request->file('image')->store('raid_controllers', 'public');
            $raidController->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $raidController, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('raid-controllers.index');
    }

    public function show(RaidController $raidController)
    {
        $raidController->load('brand', 'image', 'servers');
        return Inertia::render('RaidControllers/Show', [
            'raidController' => $raidController,
        ]);
    }

    public function destroy(RaidController $raidController)
    {
        $oldAttributes = $raidController->getAttributes();
        $oldImage = $raidController->image?->url;

        if ($raidController->image) {
            Storage::disk('public')->delete($raidController->image->url);
            $raidController->image()->delete();
            $this->logAudit('image_deleted', $raidController, ['old' => ['image' => $oldImage]]);
        }

        $raidController->servers()->detach();
        $raidController->delete();

        $this->logAudit('deleted', $raidController, ['old' => $oldAttributes]);

        return redirect()->route('raid-controllers.index');
    }
}