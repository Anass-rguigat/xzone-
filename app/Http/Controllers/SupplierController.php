<?php
namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::all();
        return Inertia::render('Suppliers/Index', ['suppliers' => $suppliers]);
    }

    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    public function show(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
        ]);

        Supplier::create($request->all());

        return redirect()->route('suppliers.index')->with('success', 'Fournisseur ajouté avec succès.');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', ['supplier' => $supplier]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email,' . $supplier->id,
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
        ]);

        $supplier->update($request->all());

        return redirect()->route('suppliers.index')->with('success', 'Fournisseur mis à jour avec succès.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('suppliers.index')->with('success', 'Fournisseur supprimé avec succès.');
    }
}
