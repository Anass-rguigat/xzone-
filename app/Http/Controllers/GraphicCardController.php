<?php

namespace App\Http\Controllers;

use App\Models\GraphicCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GraphicCardController extends Controller
{
    public function index()
    {
        $graphicCards = GraphicCard::with(['brand', 'image', 'servers'])->get(); // Load related servers
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

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $graphicCard->servers()->attach($validated['server_ids']);
        }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('graphic_cards', 'public');
            $graphicCard->image()->create(['url' => $path]);
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

        if (isset($validated['server_ids'])) {
            $graphicCard->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($graphicCard->image) {
                Storage::disk('public')->delete($graphicCard->image->url);
                $graphicCard->image()->delete();
            }

            $path = $request->file('image')->store('graphic_cards', 'public');

            $graphicCard->image()->create(['url' => $path]);
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
        if ($graphicCard->image) {
            Storage::disk('public')->delete($graphicCard->image->url);
            $graphicCard->image()->delete();
        }

        $graphicCard->servers()->detach();

        $graphicCard->delete();

        return redirect()->route('graphic-cards.index');
    }
}
