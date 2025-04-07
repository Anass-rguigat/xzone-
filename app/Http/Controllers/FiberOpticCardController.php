<?php

namespace App\Http\Controllers;

use App\Models\FiberOpticCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FiberOpticCardController extends Controller
{
    public function index()
    {
        $fiberOpticCards = FiberOpticCard::with(['brand', 'image', 'servers'])->get(); // Load related servers
        return Inertia::render('FiberOpticCards/Index', ['fiberOpticCards' => $fiberOpticCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('FiberOpticCards/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fiber_type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'speed' => 'required|numeric|min:0',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fiberOpticCard = FiberOpticCard::create([
            'name' => $validated['name'],
            'fiber_type' => $validated['fiber_type'],
            'brand_id' => $validated['brand_id'],
            'speed' => $validated['speed'],
            'power_rating' => $validated['power_rating'],
            'price' => $validated['price'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $fiberOpticCard->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('fiber_optic_cards', 'public');
            $fiberOpticCard->image()->create(['url' => $path]);
        }

        return redirect()->route('fiber-optic-cards.index');
    }

    public function edit(FiberOpticCard $fiberOpticCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $fiberOpticCard->load('brand', 'image', 'servers');
        return Inertia::render('FiberOpticCards/Edit', [
            'fiberOpticCard' => $fiberOpticCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }
    public function update(Request $request, FiberOpticCard $fiberOpticCard)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fiber_type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'speed' => 'required|numeric|min:0',
            'power_rating' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fiberOpticCard->update([
            'name' => $validated['name'],
            'fiber_type' => $validated['fiber_type'] ?? $fiberOpticCard->fiber_type,
            'speed' => $validated['speed'] ?? $fiberOpticCard->speed,
            'power_rating' => $validated['power_rating'] ?? $fiberOpticCard->power_rating,
            'price' => $validated['price'] ?? $fiberOpticCard->price,
            'brand_id' => $validated['brand_id'],
        ]);


        if (isset($validated['server_ids'])) {
            $fiberOpticCard->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($fiberOpticCard->image) {
                Storage::disk('public')->delete($fiberOpticCard->image->url);

                $fiberOpticCard->image()->delete();
            }

            $path = $request->file('image')->store('fiber_optic_cards', 'public');

            $fiberOpticCard->image()->create(['url' => $path]);
        }

        return redirect()->route('fiber-optic-cards.index');
    }

    public function show(FiberOpticCard $fiberOpticCard)
    {
        $fiberOpticCard->load('brand', 'image', 'servers');

        return Inertia::render('FiberOpticCards/Show', [
            'fiberOpticCard' => $fiberOpticCard,
        ]);
    }

    public function destroy(FiberOpticCard $fiberOpticCard)
    {
        if ($fiberOpticCard->image) {
            Storage::disk('public')->delete($fiberOpticCard->image->url);
            $fiberOpticCard->image()->delete();
        }

        $fiberOpticCard->servers()->detach();

        $fiberOpticCard->delete();

        return redirect()->route('fiber-optic-cards.index');
    }
}
