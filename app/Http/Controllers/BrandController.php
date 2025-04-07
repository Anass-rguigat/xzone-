<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::all();
        return Inertia::render('Brands/Index', ['brands' => $brands]);
    }

    public function create()
    {
        return Inertia::render('Brands/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:brands,name',
            ]);

            Brand::create($validated);

            return redirect()->route('brands.index')
                ->with('success', 'Marque créée avec succès!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->with('error', 'Erreur de validation');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la création : ' . $e->getMessage());
        }
    }

    public function edit(Brand $brand)
    {
        return Inertia::render('Brands/Edit', ['brand' => $brand]);
    }

    public function update(Request $request, Brand $brand)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
            ]);

            $brand->update($validated);

            return redirect()->route('brands.index')
                ->with('success', 'Marque mise à jour avec succès!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->with('error', 'Erreur de validation');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la mise à jour : ' . $e->getMessage());
        }
    }

    public function destroy(Brand $brand)
    {
        try {
            $brand->delete();
            return redirect()->route('brands.index')
                ->with('success', 'Marque supprimée avec succès!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression : ' . $e->getMessage());
        }
    }
}