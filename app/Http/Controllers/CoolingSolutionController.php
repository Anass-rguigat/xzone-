<?php

namespace App\Http\Controllers;

use App\Models\CoolingSolution;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CoolingSolutionController extends Controller
{
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

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $coolingSolution->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cooling_solutions', 'public');
            $coolingSolution->image()->create(['url' => $path]);
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

        if (isset($validated['server_ids'])) {
            $coolingSolution->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($coolingSolution->image) {
                Storage::disk('public')->delete($coolingSolution->image->url);
                $coolingSolution->image()->delete();
            }

            $path = $request->file('image')->store('cooling_solutions', 'public');

            $coolingSolution->image()->create(['url' => $path]);
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
        if ($coolingSolution->image) {
            Storage::disk('public')->delete($coolingSolution->image->url);
            $coolingSolution->image()->delete();
        }

        $coolingSolution->servers()->detach();

        $coolingSolution->delete();

        return redirect()->route('cooling-solutions.index');
    }
}
