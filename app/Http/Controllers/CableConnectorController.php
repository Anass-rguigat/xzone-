<?php

namespace App\Http\Controllers;

use App\Models\CableConnector;
use App\Models\Brand;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CableConnectorController extends Controller
{
    public function index()
    {
        $cables = CableConnector::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('CableConnectors/Index', ['cables' => $cables]);
    }

    public function create()
    {
        $brands = Brand::all();
        $servers = Server::all();

        return Inertia::render('CableConnectors/Create', [
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
            'length' => 'required|numeric|min:1',
            'specifications' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cable = CableConnector::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'brand_id' => $validated['brand_id'],
            'length' => $validated['length'],
            'specifications' => $validated['specifications'],
            'price' => $validated['price'],
        ]);

        if (!empty($validated['server_ids'])) {
            $cable->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cable_connectors', 'public');
            $cable->image()->create(['url' => $path]);
        }

        return redirect()->route('cable-connectors.index');
    }

    public function edit(CableConnector $cableConnector)
    {
        $brands = Brand::all();
        $servers = Server::all();
        $cableConnector->load('brand', 'image', 'servers');
        return Inertia::render('CableConnectors/Edit', [
            'cable' => $cableConnector,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, CableConnector $cableConnector)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'length' => 'required|numeric|min:1',
            'specifications' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cableConnector->update([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? $cableConnector->type,
            'brand_id' => $validated['brand_id'],
            'length' => $validated['length'] ?? $cableConnector->length,
            'specifications' => $validated['specifications'] ?? $cableConnector->specifications,
            'price' => $validated['price'] ?? $cableConnector->price,
        ]);

        if (isset($validated['server_ids'])) {
            $cableConnector->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($cableConnector->image) {
                Storage::disk('public')->delete($cableConnector->image->url);
                $cableConnector->image()->delete();
            }

            $path = $request->file('image')->store('cable_connectors', 'public');
            $cableConnector->image()->create(['url' => $path]);
        }

        return redirect()->route('cable-connectors.index');
    }

    public function show(CableConnector $cableConnector)
    {
        $cableConnector->load('brand', 'image', 'servers');
        return Inertia::render('CableConnectors/Show', ['cable' => $cableConnector]);
    }

    public function destroy(CableConnector $cableConnector)
    {
        if ($cableConnector->image) {
            Storage::disk('public')->delete($cableConnector->image->url);
            $cableConnector->image()->delete();
        }

        $cableConnector->servers()->detach();
        $cableConnector->delete();

        return redirect()->route('cable-connectors.index');
    }
}
