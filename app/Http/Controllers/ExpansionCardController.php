<?php

namespace App\Http\Controllers;

use App\Models\ExpansionCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExpansionCardController extends Controller
{
    public function index()
    {
        $expansionCards = ExpansionCard::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('ExpansionCards/Index', ['expansionCards' => $expansionCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('ExpansionCards/Create', [
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
            'interface_type' => 'required|string|max:255',
            'speed' => 'required|numeric|min:1',
            'power_rating' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id', 
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $expansionCard = ExpansionCard::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'interface_type' => $validated['interface_type'],
            'speed' => $validated['speed'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $expansionCard->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('expansion_cards', 'public');
            $expansionCard->image()->create(['url' => $path]);
        }

        return redirect()->route('expansion-cards.index');
    }

    public function edit(ExpansionCard $expansionCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $expansionCard->load('brand', 'image', 'servers'); 
        return Inertia::render('ExpansionCards/Edit', [
            'expansionCard' => $expansionCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, ExpansionCard $expansionCard)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|string|max:255',
            'interface_type' => 'required|string|max:255',
            'speed' => 'required|numeric|min:1',
            'power_rating' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        $expansionCard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'] ?? $expansionCard->type,
            'interface_type' => $validated['interface_type'] ?? $expansionCard->interface_type,
            'speed' => $validated['speed'] ?? $expansionCard->speed,
            'power_rating' => $validated['power_rating'] ?? $expansionCard->power_rating,
            'price' => $validated['price'] ?? $expansionCard->price,
        ]);

        if (isset($validated['server_ids'])) {
            $expansionCard->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($expansionCard->image) {
                Storage::disk('public')->delete($expansionCard->image->url);
                $expansionCard->image()->delete();
            }
            $path = $request->file('image')->store('expansion_cards', 'public');

            $expansionCard->image()->create(['url' => $path]);
        }
        return redirect()->route('expansion-cards.index');
    }

    public function show(ExpansionCard $expansionCard)
    {
        $expansionCard->load('brand', 'image', 'servers');

        return Inertia::render('ExpansionCards/Show', [
            'expansionCard' => $expansionCard,
        ]);
    }

    public function destroy(ExpansionCard $expansionCard)
    {
        if ($expansionCard->image) {
            Storage::disk('public')->delete($expansionCard->image->url);
            $expansionCard->image()->delete();
        }

        $expansionCard->servers()->detach();

        $expansionCard->delete();

        return redirect()->route('expansion-cards.index');
    }
}
