<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Motherboard;
use App\Models\Image;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MotherboardController extends Controller
{
    private function logAudit($event, $motherboard, $changes = null)
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
            'auditable_type' => Motherboard::class,
            'auditable_id' => $motherboard->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $motherboards = Motherboard::with(['brand', 'image', 'servers'])->get();
        return Inertia::render('Motherboards/Index', ['motherboards' => $motherboards]);
    }

    public function create()
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        return Inertia::render('Motherboards/Create', [
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'cpu_socket' => 'required|string|max:255',
            'chipset' => 'required|string|max:255',
            'ram_slots' => 'required|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'pci_slots' => 'required|integer|min:1',
            'form_factor' => 'required|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $motherboard = Motherboard::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'],
            'price' => $validated['price'],
            'cpu_socket' => $validated['cpu_socket'],
            'chipset' => $validated['chipset'],
            'ram_slots' => $validated['ram_slots'],
            'pci_slots' => $validated['pci_slots'],
            'form_factor' => $validated['form_factor'],
        ]);

        $this->logAudit('ajouter', $motherboard, ['new' => $motherboard->getAttributes()]);

        if (isset($validated['server_ids']) && count($validated['server_ids']) > 0) {
            $motherboard->servers()->attach($validated['server_ids']);
            $this->logAudit('servers_attached', $motherboard, ['new' => $validated['server_ids']]);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('motherboards', 'public');
            $motherboard->image()->create(['url' => $path]);
            $this->logAudit('image_ajouter', $motherboard, ['new' => ['image' => $path]]);
        }

        return redirect()->route('motherboards.index');
    }

    public function edit(Motherboard $motherboard)
    {
        $brands = \App\Models\Brand::all();
        $servers = \App\Models\Server::all();
        $motherboard->load('brand', 'image', 'servers');
        return Inertia::render('Motherboards/Edit', [
            'motherboard' => $motherboard,
            'brands' => $brands,
            'servers' => $servers,
        ]);
    }

    public function update(Request $request, Motherboard $motherboard)
    {
        $oldAttributes = $motherboard->getAttributes();
        $oldServers = $motherboard->servers->pluck('id')->toArray();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'model' => 'required|string|max:255',
            'cpu_socket' => 'required|string|max:255',
            'chipset' => 'required|string|max:255',
            'ram_slots' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'pci_slots' => 'required|integer|min:1',
            'form_factor' => 'required|string|max:255',
            'server_ids' => 'nullable|array',
            'server_ids.*' => 'exists:servers,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $motherboard->update([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'model' => $validated['model'] ?? $motherboard->model,
            'price' => $validated['price'] ?? $motherboard->price,
            'cpu_socket' => $validated['cpu_socket'] ?? $motherboard->cpu_socket,
            'chipset' => $validated['chipset'] ?? $motherboard->chipset,
            'ram_slots' => $validated['ram_slots'] ?? $motherboard->ram_slots,
            'pci_slots' => $validated['pci_slots'] ?? $motherboard->pci_slots,
            'form_factor' => $validated['form_factor'] ?? $motherboard->form_factor,
        ]);

        $this->logAudit('modifier', $motherboard, [
            'old' => $oldAttributes,
            'new' => $motherboard->getChanges()
        ]);

        if (isset($validated['server_ids'])) {
            $motherboard->servers()->sync($validated['server_ids']);
            
            $added = array_diff($validated['server_ids'], $oldServers);
            $removed = array_diff($oldServers, $validated['server_ids']);

            if (!empty($added)) {
                $this->logAudit('attacher_serveurs', $motherboard, ['new' => $added]);
            }

            if (!empty($removed)) {
                $this->logAudit('détacher_serveurs', $motherboard, ['old' => $removed]);
            }
        }

        if ($request->hasFile('image')) {
            $oldImage = $motherboard->image?->url;

            if ($motherboard->image) {
                Storage::disk('public')->delete($motherboard->image->url);
                $motherboard->image()->delete();
            }

            $path = $request->file('image')->store('motherboards', 'public');
            $motherboard->image()->create(['url' => $path]);
            
            $this->logAudit('image_modifier', $motherboard, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('motherboards.index');
    }

    public function show(Motherboard $motherboard)
    {
        $motherboard->load('brand', 'image', 'servers');
        return Inertia::render('Motherboards/Show', [
            'motherboard' => $motherboard,
        ]);
    }

    public function destroy(Motherboard $motherboard)
    {
        $oldAttributes = $motherboard->getAttributes();
        $oldImage = $motherboard->image?->url;

        if ($motherboard->image) {
            Storage::disk('public')->delete($motherboard->image->url);
            $motherboard->image()->delete();
            $this->logAudit('image_supprimer', $motherboard, ['old' => ['image' => $oldImage]]);
        }

        $motherboard->servers()->detach();
        $motherboard->delete();

        $this->logAudit('supprimer', $motherboard, ['old' => $oldAttributes]);

        return redirect()->route('motherboards.index');
    }
}