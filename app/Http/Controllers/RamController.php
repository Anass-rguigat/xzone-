<?php

namespace App\Http\Controllers;

use App\Models\Ram;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class RamController extends Controller
{
    public function index()
    {
        $rams = Ram::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Rams/Index', ['rams' => $rams]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('Rams/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'brand_id' => 'required|exists:brands,id',
                'capacity' => 'required|integer|min:1',
                'type' => 'required|in:ddr3,ddr4,ddr5',
                'speed' => 'required|integer|min:1',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'price' => 'required|numeric|min:0',
                'server_ids' => 'nullable|array',
                'server_ids.*' => 'exists:servers,id',
            ]);

            $ram = Ram::create($validated);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('rams', 'public');
                $ram->image()->create(['url' => $path]);
            }

            if (!empty($validated['server_ids'])) {
                $ram->servers()->attach($validated['server_ids']);
            }

            return redirect()->route('rams.index')
                ->with('success', 'RAM créée avec succès!');

        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->with('error', 'Erreur de validation');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la création : ' . $e->getMessage());
        }
    }

    public function edit(Ram $ram)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $ram->load('brand', 'image', 'servers');
        return Inertia::render('Rams/Edit', [
            'ram' => $ram,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Ram $ram)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'brand_id' => 'required|exists:brands,id',
                'capacity' => 'integer|min:1',
                'type' => 'in:ddr3,ddr4,ddr5',
                'speed' => 'integer|min:1',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'price' => 'numeric|min:0',
                'server_ids' => 'nullable|array',
                'server_ids.*' => 'exists:servers,id',
            ]);

            $ram->update($validated);

            if ($request->hasFile('image')) {
                if ($ram->image) {
                    Storage::disk('public')->delete($ram->image->url);
                    $ram->image()->delete();
                }
                $path = $request->file('image')->store('rams', 'public');
                $ram->image()->create(['url' => $path]);
            }

            if (isset($validated['server_ids'])) {
                $ram->servers()->sync($validated['server_ids']);
            }

            return redirect()->route('rams.index')
                ->with('success', 'RAM mise à jour avec succès!');

        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->with('error', 'Erreur de validation');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la mise à jour : ' . $e->getMessage());
        }
    }

    public function destroy(Ram $ram)
    {
        try {
            if ($ram->image) {
                Storage::disk('public')->delete($ram->image->url);
                $ram->image()->delete();
            }

            $ram->servers()->detach();
            $ram->delete();

            return redirect()->route('rams.index')
                ->with('success', 'RAM supprimée avec succès!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression : ' . $e->getMessage());
        }
    }

    public function show(Ram $ram)
    {
        $ram->load('brand', 'image', 'servers');
        return Inertia::render('Rams/Show', ['ram' => $ram]);
    }
}