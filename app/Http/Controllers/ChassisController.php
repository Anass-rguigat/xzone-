<?php

namespace App\Http\Controllers;

use App\Models\Chassis;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChassisController extends Controller
{
    public function index()
    {
        $chassis = Chassis::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Chassis/Index', ['chassis' => $chassis]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('Chassis/Create', [
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
            'form_factor' => 'required|string|max:255',
            'material' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $chassis = Chassis::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'form_factor' => $validated['form_factor'],
            'material' => $validated['material'],
            'price' => $validated['price'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $chassis->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chassis', 'public');
            $chassis->image()->create(['url' => $path]);
        }

        return redirect()->route('chassis.index');
    }

    public function edit(Chassis $chassis)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $chassis->load('brand', 'image', 'servers');
        return Inertia::render('Chassis/Edit', [
            'chassis' => $chassis,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Chassis $chassis)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'form_factor' => 'required|string|max:255',
            'material' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $chassis->update([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? $chassis->type,
            'brand_id' => $validated['brand_id'],
            'form_factor' => $validated['form_factor'] ?? $chassis->form_factor,
            'material' => $validated['material'] ?? $chassis->material,
            'price' => $validated['price'] ?? $chassis->price,
        ]);

        if (isset($validated['server_ids'])) {
            $chassis->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($chassis->image) {
                Storage::disk('public')->delete($chassis->image->url);
                $chassis->image()->delete();
            }

            $path = $request->file('image')->store('chassis', 'public');

            $chassis->image()->create(['url' => $path]);
        }

        return redirect()->route('chassis.index');
    }

    public function show(Chassis $chassis)
    {
        $chassis->load('brand', 'image', 'servers');
        return Inertia::render('Chassis/Show', [
            'chassis' => $chassis,
        ]);
    }

    public function destroy(Chassis $chassis)
    {
        if ($chassis->image) {
            Storage::disk('public')->delete($chassis->image->url);
            $chassis->image()->delete();
        }
        $chassis->servers()->detach();

        $chassis->delete();

        return redirect()->route('chassis.index');
    }
}
