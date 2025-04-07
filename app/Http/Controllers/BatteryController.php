<?php

namespace App\Http\Controllers;

use App\Models\Battery;
use App\Models\Brand;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BatteryController extends Controller
{
    public function index()
    {
        $batteries = Battery::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Batteries/Index', ['batteries' => $batteries]);
    }

    public function create()
    {
        $brands = Brand::all();
        $servers = Server::all();

        return Inertia::render('Batteries/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|numeric|min:1',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $battery = Battery::create([
            'name' => $validated['name'],
            'capacity' => $validated['capacity'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'],
            'price' => $validated['price'],
        ]);

        if (!empty($validated['server_ids'])) {
            $battery->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('batteries', 'public');
            $battery->image()->create(['url' => $path]);
        }

        return redirect()->route('batteries.index');
    }

    public function edit(Battery $battery)
    {
        $brands = Brand::all();
        $servers = Server::all();
        $battery->load('brand', 'image', 'servers');
        return Inertia::render('Batteries/Edit', [
            'battery' => $battery,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Battery $battery)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|numeric|min:1',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $battery->update([
            'name' => $validated['name'],
            'capacity' => $validated['capacity'] ?? $battery->capacity,
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'] ?? $battery->type,
            'price' => $validated['price'] ?? $battery->price,
        ]);

        if (isset($validated['server_ids'])) {
            $battery->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($battery->image) {
                Storage::disk('public')->delete($battery->image->url);
                $battery->image()->delete();
            }

            $path = $request->file('image')->store('batteries', 'public');
            $battery->image()->create(['url' => $path]);
        }

        return redirect()->route('batteries.index');
    }

    public function show(Battery $battery)
    {
        $battery->load('brand', 'image', 'servers');
        return Inertia::render('Batteries/Show', ['battery' => $battery]);
    }

    public function destroy(Battery $battery)
    {
        if ($battery->image) {
            Storage::disk('public')->delete($battery->image->url);
            $battery->image()->delete();
        }

        $battery->servers()->detach();
        $battery->delete();

        return redirect()->route('batteries.index');
    }
}
