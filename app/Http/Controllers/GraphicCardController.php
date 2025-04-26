<?php

namespace App\Http\Controllers;

use App\Models\GraphicCard;
use App\Models\AuditLog;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GraphicCardController extends Controller
{
    private function logAudit($event, $graphicCard, $changes = null)
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
            'auditable_type' => GraphicCard::class,
            'auditable_id' => $graphicCard->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $graphicCards = GraphicCard::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('GraphicCards/Index', ['graphicCards' => $graphicCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('GraphicCards/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'gpu_architecture' => 'required|string|max:255',
            'memory_type' => 'required|string|max:255',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $graphicCard = GraphicCard::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'gpu_architecture' => $validated['gpu_architecture'],
            'memory_type' => $validated['memory_type'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        $this->logAudit('ajouter', $graphicCard, ['new' => $graphicCard->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $graphicCard->servers()->attach($validated['server_ids']);
            $this->logAudit('attacher_serveurs', $graphicCard, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('graphic_cards', 'public');
            $graphicCard->image()->create(['url' => $path]);
            $this->logAudit('image_ajouter', $graphicCard, ['new' => ['image' => $path]]);
        }

        return redirect()->route('graphic-cards.index');
    }

    public function edit(GraphicCard $graphicCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $graphicCard->load('brand', 'image', 'servers');
        return Inertia::render('GraphicCards/Edit', [
            'graphicCard' => $graphicCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, GraphicCard $graphicCard)
    {
        $oldAttributes = $graphicCard->getAttributes();
        $oldServers = $graphicCard->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'gpu_architecture' => 'required|string|max:255',
            'memory_type' => 'required|string|max:255',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $graphicCard->update([
            'name' => $validated['name'],
            'gpu_architecture' => $validated['gpu_architecture'] ?? $graphicCard->gpu_architecture,
            'memory_type' => $validated['memory_type'] ?? $graphicCard->memory_type,
            'power_rating' => $validated['power_rating'] ?? $graphicCard->power_rating,
            'price' => $validated['price'] ?? $graphicCard->price,
            'brand_id' => $validated['brand_id'],
        ]);

        $this->logAudit('modifier', $graphicCard, [
            'old' => $oldAttributes,
            'new' => $graphicCard->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $graphicCard->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('attacher_serveurs', $graphicCard, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('détacher_serveurs', $graphicCard, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $graphicCard->image?->url;

            if ($graphicCard->image) {
                Storage::disk('public')->delete($graphicCard->image->url);
                $graphicCard->image()->delete();
            }

            $path = $request->file('image')->store('graphic_cards', 'public');
            $graphicCard->image()->create(['url' => $path]);
            
            $this->logAudit('image_modifier', $graphicCard, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('graphic-cards.index');
    }

    public function show(GraphicCard $graphicCard)
    {
        $graphicCard->load('brand', 'image', 'servers');
        return Inertia::render('GraphicCards/Show', [
            'graphicCard' => $graphicCard,
        ]);
    }

    public function destroy(GraphicCard $graphicCard)
    {
        $oldAttributes = $graphicCard->getAttributes();
        $oldImage = $graphicCard->image?->url;

        if ($graphicCard->image) {
            Storage::disk('public')->delete($graphicCard->image->url);
            $graphicCard->image()->delete();
            $this->logAudit('image_supprimer', $graphicCard, ['old' => ['image' => $oldImage]]);
        }

        $graphicCard->servers()->detach();
        $graphicCard->delete();

        $this->logAudit('supprimer', $graphicCard, ['old' => $oldAttributes]);

        return redirect()->route('graphic-cards.index');
    }
}