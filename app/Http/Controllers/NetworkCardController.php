<?php

namespace App\Http\Controllers;

use App\Models\NetworkCard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NetworkCardController extends Controller
{
    public function index()
    {
        $networkCards = NetworkCard::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('NetworkCards/Index', ['networkCards' => $networkCards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('NetworkCards/Create', [
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
            'interface' => 'required|string|max:255',
            'speed' => 'required|integer|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $networkCard = NetworkCard::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'interface' => $validated['interface'],
            'speed' => $validated['speed'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $networkCard->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('network_cards', 'public');
            $networkCard->image()->create(['url' => $path]);
        }

        return redirect()->route('network-cards.index');
    }

    public function edit(NetworkCard $networkCard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $networkCard->load('brand', 'image', 'servers');
        return Inertia::render('NetworkCards/Edit', [
            'networkCard' => $networkCard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, NetworkCard $networkCard)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'interface' => 'required|string|max:255',
            'speed' => 'required|integer|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $networkCard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $networkCard->price,
            'model' => $validated['model'] ?? $networkCard->model,
            'interface' => $validated['interface'] ?? $networkCard->interface,
            'speed' => $validated['speed'] ?? $networkCard->speed,
        ]);

        if (isset($validated['server_ids'])) {
            $networkCard->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($networkCard->image) {
                Storage::disk('public')->delete($networkCard->image->url);
                $networkCard->image()->delete();
            }

            $path = $request->file('image')->store('network_cards', 'public');

            $networkCard->image()->create(['url' => $path]);
        }

        return redirect()->route('network-cards.index');
    }

    public function show(NetworkCard $networkCard)
    {
        $networkCard->load('brand', 'image', 'servers');

        return Inertia::render('NetworkCards/Show', [
            'networkCard' => $networkCard,
        ]);
    }

    public function destroy(NetworkCard $networkCard)
    {
        if ($networkCard->image) {
            Storage::disk('public')->delete($networkCard->image->url);
            $networkCard->image()->delete();
        }

        $networkCard->servers()->detach();

        $networkCard->delete();

        return redirect()->route('network-cards.index');
    }
}
