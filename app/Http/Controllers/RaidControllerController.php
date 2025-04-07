<?php

namespace App\Http\Controllers;

use App\Models\RaidController;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RaidControllerController extends Controller
{
    public function index()
    {
        $raidControllers = RaidController::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('RaidControllers/Index', ['raidControllers' => $raidControllers]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('RaidControllers/Create', [
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
            'supported_levels' => 'required|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $raidController = RaidController::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'model' => $validated['model'],
            'supported_levels' => $validated['supported_levels'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $raidController->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('raid_controllers', 'public');
            $raidController->image()->create(['url' => $path]);
        }

        return redirect()->route('raid-controllers.index');
    }

    public function edit(RaidController $raidController)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $raidController->load('brand', 'image', 'servers');
        return Inertia::render('RaidControllers/Edit', [
            'raidController' => $raidController,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, RaidController $raidController)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'price' => 'required|numeric|min:0',
            'model' => 'required|string|max:255',
            'supported_levels' => 'required|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $raidController->update([
            'name' => $validated['name'],
            'price' => $validated['price'] ?? $raidController->price,
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'] ?? $raidController->model,
            'supported_levels' => $validated['supported_levels'] ?? $raidController->supported_levels,
        ]);

        if (isset($validated['server_ids'])) {
            $raidController->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($raidController->image) {
                Storage::disk('public')->delete($raidController->image->url);
                $raidController->image()->delete();
            }

            $path = $request->file('image')->store('raid_controllers', 'public');
            $raidController->image()->create(['url' => $path]);
        }

        return redirect()->route('raid-controllers.index');
    }

    public function show(RaidController $raidController)
    {
        $raidController->load('brand', 'image', 'servers');

        return Inertia::render('RaidControllers/Show', [
            'raidController' => $raidController,
        ]);
    }

    public function destroy(RaidController $raidController)
    {
        if ($raidController->image) {
            Storage::disk('public')->delete($raidController->image->url);
            $raidController->image()->delete();
        }

        $raidController->servers()->detach();

        $raidController->delete();

        return redirect()->route('raid-controllers.index');
    }
}
