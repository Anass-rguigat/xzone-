<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\CoolingSolution;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CoolingSolutionController extends Controller
{
    private function logAudit($event, $coolingSolution, $changes = null)
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
            'auditable_type' => CoolingSolution::class,
            'auditable_id' => $coolingSolution->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $coolingSolutions = CoolingSolution::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('CoolingSolutions/Index', ['coolingSolutions' => $coolingSolutions]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('CoolingSolutions/Create', [
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
            'manufacturer' => 'required|string|max:255',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $coolingSolution = CoolingSolution::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'manufacturer' => $validated['manufacturer'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('created', $coolingSolution, ['new' => $coolingSolution->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $coolingSolution->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $coolingSolution, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cooling_solutions', 'public');
            $coolingSolution->image()->create(['url' => $path]);
            $this->logAudit('image_uploaded', $coolingSolution, ['new' => ['image' => $path]]);
        }

        return redirect()->route('cooling-solutions.index');
    }

    public function edit(CoolingSolution $coolingSolution)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $coolingSolution->load('brand', 'image', 'servers');
        return Inertia::render('CoolingSolutions/Edit', [
            'coolingSolution' => $coolingSolution,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, CoolingSolution $coolingSolution)
    {
        $oldAttributes = $coolingSolution->getAttributes();
        $oldServers = $coolingSolution->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'manufacturer' => 'required|string|max:255',
            'power_rating' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $coolingSolution->update([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? $coolingSolution->type,
            'brand_id' => $validated['brand_id'],
            'manufacturer' => $validated['manufacturer'] ?? $coolingSolution->manufacturer,
            'power_rating' => $validated['power_rating'] ?? $coolingSolution->power_rating,
            'price' => $validated['price'] ?? $coolingSolution->price,
        ]);

        $this->logAudit('updated', $coolingSolution, [
            'old' => $oldAttributes,
            'new' => $coolingSolution->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $coolingSolution->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('servers_attached', $coolingSolution, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('servers_detached', $coolingSolution, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $coolingSolution->image?->url;

            if ($coolingSolution->image) {
                Storage::disk('public')->delete($coolingSolution->image->url);
                $coolingSolution->image()->delete();
            }

            $path = $request->file('image')->store('cooling_solutions', 'public');
            $coolingSolution->image()->create(['url' => $path]);
            
            $this->logAudit('image_updated', $coolingSolution, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('cooling-solutions.index');
    }

    public function show(CoolingSolution $coolingSolution)
    {
        $coolingSolution->load('brand', 'image', 'servers');
        return Inertia::render('CoolingSolutions/Show', [
            'coolingSolution' => $coolingSolution,
        ]);
    }

    public function destroy(CoolingSolution $coolingSolution)
    {
        $oldAttributes = $coolingSolution->getAttributes();
        $oldImage = $coolingSolution->image?->url;

        if ($coolingSolution->image) {
            Storage::disk('public')->delete($coolingSolution->image->url);
            $coolingSolution->image()->delete();
            $this->logAudit('image_deleted', $coolingSolution, ['old' => ['image' => $oldImage]]);
        }

        $coolingSolution->servers()->detach();
        $coolingSolution->delete();

        $this->logAudit('deleted', $coolingSolution, ['old' => $oldAttributes]);

        return redirect()->route('cooling-solutions.index');
    }
}