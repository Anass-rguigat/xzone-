<?php

namespace App\Http\Controllers;

use App\Models\HardDrive;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HardDriveController extends Controller
{
    public function index()
    {
        $hardDrives = HardDrive::with(['brand', 'image', 'servers'])->get(); // Load servers as well
        return Inertia::render('HardDrives/Index', ['hardDrives' => $hardDrives]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('HardDrives/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|in:hdd,ssd,nvme',
            'capacity' => 'required|integer|min:1',
            'interface' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $hardDrive = HardDrive::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'interface' => $validated['interface'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
        ]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $hardDrive->servers()->attach($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hard_drives', 'public');
            $hardDrive->image()->create(['url' => $path]);
        }

        return redirect()->route('hard-drives.index');
    }

    public function edit(HardDrive $hardDrive)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $hardDrive->load('brand', 'image', 'servers');
        return Inertia::render('HardDrives/Edit', [
            'hardDrive' => $hardDrive,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, HardDrive $hardDrive)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'type' => 'required|in:hdd,ssd,nvme',
            'capacity' => 'required|integer|min:1',
            'interface' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $hardDrive->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'] ?? $hardDrive->price,
            'capacity' => $validated['capacity'] ?? $hardDrive->capacity,
            'type' => $validated['type'] ?? $hardDrive->type,
            'interface' => $validated['interface'] ?? $hardDrive->interface,
            'stock' => $validated['stock'] ?? $hardDrive->stock,
        ]);

        if (isset($validated['server_ids'])) {
            $hardDrive->servers()->sync($validated['server_ids']);
        }

        if ($request->hasFile('image')) {
            if ($hardDrive->image) {
                Storage::disk('public')->delete($hardDrive->image->url);
                $hardDrive->image()->delete();
            }

            $path = $request->file('image')->store('hard_drives', 'public');

            $hardDrive->image()->create(['url' => $path]);
        }

        return redirect()->route('hard-drives.index');
    }

    public function show(HardDrive $hardDrive)
    {
        $hardDrive->load('brand', 'image', 'servers');

        return Inertia::render('HardDrives/Show', [
            'hardDrive' => $hardDrive,
        ]);
    }

    public function destroy(HardDrive $hardDrive)
    {
        if ($hardDrive->image) {
            Storage::disk('public')->delete($hardDrive->image->url);
            $hardDrive->image()->delete();
        }

        $hardDrive->servers()->detach();

        $hardDrive->delete();

        return redirect()->route('hard-drives.index');
    }
}
