<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BrandController extends Controller
{
    private function logAudit($event, $brand, $changes = null)
    {
        $oldValues = [];
        $newValues = [];

        if ($changes) {
            $oldValues = $changes['old'] ?? [];
            $newValues = $changes['new'] ?? [];
        }

        AuditLog::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'event' => $event,
            'auditable_type' => Brand::class,
            'auditable_id' => $brand->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

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

            $brand = Brand::create($validated);
            
            $this->logAudit('ajouter', $brand, [
                'new' => $brand->getAttributes()
            ]);

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
            $oldAttributes = $brand->getAttributes();

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
            ]);

            $brand->update($validated);

            $this->logAudit('modifier', $brand, [
                'old' => $oldAttributes,
                'new' => $brand->getChanges()
            ]);

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
            $oldAttributes = $brand->getAttributes();
            
            $brand->delete();

            $this->logAudit('supprimer', $brand, [
                'old' => $oldAttributes
            ]);

            return redirect()->route('brands.index')
                ->with('success', 'Marque supprimée avec succès!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression : ' . $e->getMessage());
        }
    }
}