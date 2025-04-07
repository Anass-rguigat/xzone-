<?php

namespace App\Http\Controllers;

use App\Models\PowerSupply;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PowerSupplyController extends Controller
{
    public function index()
    {
        $powerSupplies = PowerSupply::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('PowerSupplies/Index', ['powerSupplies' => $powerSupplies]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('PowerSupplies/Create', [
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
            'capacity' => 'required|integer|min:1',
            'efficiency' => 'required|string|max:255',
            'form_factor' => 'required|string|max:255',
            'modular' => 'required|boolean',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $powerSupply = PowerSupply::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'capacity' => $validated['capacity'],
            'efficiency' => $validated['efficiency'],
            'form_factor' => $validated['form_factor'],
            'modular' => $validated['modular'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $powerSupply->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('power_supplies', 'public');
            $powerSupply->image()->create(['url' => $path]);
        }

        return redirect()->route('power-supplies.index');
    }

    public function edit(PowerSupply $powerSupply)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $powerSupply->load('brand', 'image', 'servers');
        return Inertia::render('PowerSupplies/Edit', [
            'powerSupply' => $powerSupply,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, PowerSupply $powerSupply)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'efficiency' => 'required|string|max:255',
            'form_factor' => 'required|string|max:255',
            'modular' => 'required|boolean',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        $powerSupply->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $powerSupply->price,
            'capacity' => $validated['capacity'] ?? $powerSupply->capacity,
            'efficiency' => $validated['efficiency'] ?? $powerSupply->efficiency,
            'form_factor' => $validated['form_factor'] ?? $powerSupply->form_factor,
            'modular' => $validated['modular'] ?? $powerSupply->modular,
        ]);

        if (isset($validated['server_ids'])) {
            $powerSupply->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($powerSupply->image) {
                Storage::disk('public')->delete($powerSupply->image->url);
                $powerSupply->image()->delete();
            }

            $path = $request->file('image')->store('power_supplies', 'public');

            $powerSupply->image()->create(['url' => $path]);
        }

        return redirect()->route('power-supplies.index');
    }

    public function show(PowerSupply $powerSupply)
    {
        $powerSupply->load('brand', 'image', 'servers');

        return Inertia::render('PowerSupplies/Show', [
            'powerSupply' => $powerSupply,
        ]);
    }

    public function destroy(PowerSupply $powerSupply)
    {
        if ($powerSupply->image) {
            Storage::disk('public')->delete($powerSupply->image->url);
            $powerSupply->image()->delete();
        }

        $powerSupply->servers()->detach();

        $powerSupply->delete();

        return redirect()->route('power-supplies.index');
    }
}
