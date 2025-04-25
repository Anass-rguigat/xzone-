<?php
namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupplierController extends Controller
{
    private function logAudit($event, $supplier, $changes = null)
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
            'auditable_type' => Supplier::class,
            'auditable_id' => $supplier->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
        ]);

        $supplier = Supplier::create($validated);
        $this->logAudit('created', $supplier, ['new' => $supplier->getAttributes()]);

        return redirect()->route('suppliers.index')->with('success', 'Fournisseur ajouté avec succès.');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', ['supplier' => $supplier]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $oldAttributes = $supplier->getAttributes();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email,' . $supplier->id,
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
        ]);

        $supplier->update($validated);
        $this->logAudit('updated', $supplier, [
            'old' => $oldAttributes,
            'new' => $supplier->getChanges()
        ]);

        return redirect()->route('suppliers.index')->with('success', 'Fournisseur mis à jour avec succès.');
    }

    public function destroy(Supplier $supplier)
    {
        $oldAttributes = $supplier->getAttributes();
        
        $supplier->delete();
        $this->logAudit('deleted', $supplier, ['old' => $oldAttributes]);

        return redirect()->route('suppliers.index')->with('success', 'Fournisseur supprimé avec succès.');
    }
}