<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Processor;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProcessorController extends Controller
{
    private function logAudit($event, $processor, $changes = null)
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
            'auditable_type' => Processor::class,
            'auditable_id' => $processor->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $processors = Processor::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Processors/Index', ['processors' => $processors]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('Processors/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'core_count' => 'required|integer|min:1',
            'thread_count' => 'required|integer|min:1',
            'base_clock' => 'required|numeric|min:0',
            'boost_clock' => 'required|numeric|min:0',
            'socket' => 'required|string|max:255',
            'thermal_design_power' => 'required|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $processor = Processor::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'core_count' => $validated['core_count'],
            'thread_count' => $validated['thread_count'],
            'base_clock' => $validated['base_clock'],
            'boost_clock' => $validated['boost_clock'],
            'socket' => $validated['socket'],
            'thermal_design_power' => $validated['thermal_design_power'],
        ]);

        $this->logAudit('ajouter', $processor, ['new' => $processor->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $processor->servers()->attach($validated['server_ids']);
            $this->logAudit('attacher_serveurs', $processor, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('processors', 'public');
            $processor->image()->create(['url' => $path]);
            $this->logAudit('image_supprimer', $processor, ['new' => ['image' => $path]]);
        }

        return redirect()->route('processors.index');
    }

    public function edit(Processor $processor)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $processor->load('brand', 'image', 'servers');
        return Inertia::render('Processors/Edit', [
            'processor' => $processor,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Processor $processor)
    {
        $oldAttributes = $processor->getAttributes();
        $oldServers = $processor->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'core_count' => 'required|integer|min:1',
            'thread_count' => 'required|integer|min:1',
            'base_clock' => 'required|numeric|min:0',
            'boost_clock' => 'required|numeric|min:0',
            'socket' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'thermal_design_power' => 'required|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $processor->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'] ?? $processor->model,
            'price' => $validated['price'] ?? $processor->price,
            'core_count' => $validated['core_count'] ?? $processor->core_count,
            'thread_count' => $validated['thread_count'] ?? $processor->thread_count,
            'base_clock' => $validated['base_clock'] ?? $processor->base_clock,
            'boost_clock' => $validated['boost_clock'] ?? $processor->boost_clock,
            'socket' => $validated['socket'] ?? $processor->socket,
            'thermal_design_power' => $validated['thermal_design_power'] ?? $processor->thermal_design_power,
        ]);

        $this->logAudit('modifier', $processor, [
            'old' => $oldAttributes,
            'new' => $processor->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $processor->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('attacher_serveurs', $processor, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('détacher_serveurs', $processor, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $processor->image?->url;

            if ($processor->image) {
                Storage::disk('public')->delete($processor->image->url);
                $processor->image()->delete();
            }

            $path = $request->file('image')->store('processors', 'public');
            $processor->image()->create(['url' => $path]);
            
            $this->logAudit('image_modifier', $processor, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('processors.index');
    }

    public function show(Processor $processor)
    {
        $processor->load('brand', 'image', 'servers');
        return Inertia::render('Processors/Show', [
            'processor' => $processor,
        ]);
    }

    public function destroy(Processor $processor)
    {
        $oldAttributes = $processor->getAttributes();
        $oldImage = $processor->image?->url;

        if ($processor->image) {
            Storage::disk('public')->delete($processor->image->url);
            $processor->image()->delete();
            $this->logAudit('image_supprimer', $processor, ['old' => ['image' => $oldImage]]);
        }

        $processor->servers()->detach();
        $processor->delete();

        $this->logAudit('supprimer', $processor, ['old' => $oldAttributes]);

        return redirect()->route('processors.index');
    }
}