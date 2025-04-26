<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Battery;
use App\Models\Server;
use App\Models\Ram;
use App\Models\HardDrive;
use App\Models\Processor;
use App\Models\PowerSupply;
use App\Models\Motherboard;
use App\Models\NetworkCard;
use App\Models\RaidController;
use App\Models\CoolingSolution;
use App\Models\Chassis;
use App\Models\GraphicCard;
use App\Models\FiberOpticCard;
use App\Models\ExpansionCard;
use App\Models\Brand;
use App\Models\CableConnector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServerController extends Controller
{
    private function logAudit($event, $server, $changes = null)
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
            'auditable_type' => Server::class,
            'auditable_id' => $server->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $servers = Server::with([
            'brand',
            'rams',
            'image',
            'batteries',
        ])->get();

        $data = [];

        foreach ($servers as $server) {
            $serverData = [
                'server_name' => $server->name,
                'price' => $server->price,
                'id' => $server->id,
                'brand' => $server->brand->name,
                'image' => $server->image,
                'model' => $server->model,
                'cpu_socket' => $server->cpu_socket,
                'ram_slots' => $server->ram_slots,
                'storage_slots' => $server->storage_slots,
                'power_supply_type' => $server->power_supply_type,
                'rack_mountable' => $server->rack_mountable,
                'form_factor' => $server->form_factor,

            ];

            $data[] = $serverData;
        }
        return Inertia::render('Servers/Index', ['data' => $data]);
    }






    public function create()
    {
        $brands = Brand::all();
        $rams = Ram::all();
        $hardDrives = HardDrive::all();
        $processors = Processor::all();
        $powerSupplies = PowerSupply::all();
        $motherboards = Motherboard::all();
        $networkCards = NetworkCard::all();
        $raidControllers = RaidController::all();
        $coolingSolutions = CoolingSolution::all();
        $chassis = Chassis::all();
        $graphicCards = GraphicCard::all();
        $fiberOpticCards = FiberOpticCard::all();
        $expansionCards = ExpansionCard::all();
        $batteries = Battery::all();
        $cable_connectors = CableConnector::all();

        return Inertia::render('Servers/Create', [
            'brands' => $brands,
            'rams' => $rams,
            'hardDrives' => $hardDrives,
            'processors' => $processors,
            'powerSupplies' => $powerSupplies,
            'motherboards' => $motherboards,
            'networkCards' => $networkCards,
            'raidControllers' => $raidControllers,
            'coolingSolutions' => $coolingSolutions,
            'chassis' => $chassis,
            'graphicCards' => $graphicCards,
            'fiberOpticCards' => $fiberOpticCards,
            'expansionCards' => $expansionCards,
            'batteries' => $batteries,
            'cable_connectors' => $cable_connectors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'ram_ids' => 'nullable|array',
            'ram_ids.*' => 'exists:rams,id',
            'hard_drive_ids' => 'nullable|array',
            'hard_drive_ids.*' => 'exists:hard_drives,id',
            'processor_ids' => 'nullable|array',
            'processor_ids.*' => 'exists:processors,id',
            'power_supply_ids' => 'nullable|array',
            'power_supply_ids.*' => 'exists:power_supplies,id',
            'motherboard_ids' => 'nullable|array',
            'motherboard_ids.*' => 'exists:motherboards,id',
            'network_card_ids' => 'nullable|array',
            'network_card_ids.*' => 'exists:network_cards,id',
            'raid_controller_ids' => 'nullable|array',
            'raid_controller_ids.*' => 'exists:raid_controllers,id',
            'cooling_solution_ids' => 'nullable|array',
            'cooling_solution_ids.*' => 'exists:cooling_solutions,id',
            'chassis_ids' => 'nullable|array',
            'chassis_ids.*' => 'exists:chassis,id',
            'graphic_card_ids' => 'nullable|array',
            'graphic_card_ids.*' => 'exists:graphic_cards,id',
            'fiber_optic_card_ids' => 'nullable|array',
            'fiber_optic_card_ids.*' => 'exists:fiber_optic_cards,id',
            'expansion_card_ids' => 'nullable|array',
            'expansion_card_ids.*' => 'exists:expansion_cards,id',
            'battery_ids' => 'nullable|array',
            'battery_ids.*' => 'exists:batteries,id',
            'cable_connector_ids' => 'nullable|array',
            'cable_connector_ids.*' => 'exists:cable_connectors,id',
            'price' => 'required|numeric|min:1',
            'model' => 'required|string|max:255',
            'cpu_socket' => 'required|string|max:255',
            'ram_slots' => 'required|integer|min:1',
            'storage_slots' => 'required|integer|min:1',
            'power_supply_type' => 'required|string|max:255',
            'rack_mountable' => 'required|boolean',
            'form_factor' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        $server = Server::create([
            'name' => $validated['name'],
            'brand_id' => $validated['brand_id'],
            'price' => $validated['price'],
            'model' => $validated['model'],
            'cpu_socket' => $validated['cpu_socket'],
            'ram_slots' => $validated['ram_slots'],
            'storage_slots' => $validated['storage_slots'],
            'power_supply_type' => $validated['power_supply_type'],
            'rack_mountable' => $validated['rack_mountable'],
            'form_factor' => $validated['form_factor'],
        ]);
        $this->logAudit('ajouter', $server, ['new' => $server->getAttributes()]);


        $relationships = [
            'ram_ids' => 'rams',
            'hard_drive_ids' => 'hardDrives',
            'processor_ids' => 'processors',
            'power_supply_ids' => 'powerSupplies',
            'motherboard_ids' => 'motherboards',
            'network_card_ids' => 'networkCards',
            'raid_controller_ids' => 'raidControllers',
            'cooling_solution_ids' => 'coolingSolutions',
            'chassis_ids' => 'chassis',
            'graphic_card_ids' => 'graphicCards',
            'fiber_optic_card_ids' => 'fiberOpticCards',
            'expansion_card_ids' => 'expansionCards',
            'battery_ids' => 'batteries',
            'cable_connector_ids' => 'cable_connectors',
        ];
        foreach ($relationships as $key => $relation) {
            if (!empty($validated[$key])) {
                $server->$relation()->attach($validated[$key] ?? []);
                $this->logAudit($relation . '_attacher', $server, ['new' => $validated[$key]]);
            }
        }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('servers', 'public');
            $server->image()->create(['url' => $path]);
            $this->logAudit('image_ajouter', $server, ['new' => ['image' => $path]]);
        }

        return redirect()->route('servers.index');
    }



    public function edit(Server $server)
    {
        $brands = Brand::all()->toArray();
        $rams = Ram::all()->toArray();
        $hardDrives = HardDrive::all()->toArray();
        $processors = Processor::all()->toArray();
        $powerSupplies = PowerSupply::all()->toArray();
        $motherboards = Motherboard::all()->toArray();
        $networkCards = NetworkCard::all()->toArray();
        $raidControllers = RaidController::all()->toArray();
        $coolingSolutions = CoolingSolution::all()->toArray();
        $chassis = Chassis::all()->toArray();
        $graphicCards = GraphicCard::all()->toArray();
        $fiberOpticCards = FiberOpticCard::all()->toArray();
        $expansionCards = ExpansionCard::all()->toArray();
        $batteries = Battery::all();
        $cableConnectors = CableConnector::all();
        $serverWithRelations = $server->load([
            'brand',
            'rams',
            'hardDrives',
            'processors',
            'powerSupplies',
            'motherboards',
            'networkCards',
            'raidControllers',
            'coolingSolutions',
            'chassis',
            'graphicCards',
            'fiberOpticCards',
            'expansionCards',
            'image',
            'batteries',
            'cable_connectors',

        ]);
        $serverArray = $serverWithRelations->toArray();
        return Inertia::render('Servers/Edit', [
            'server' => $serverArray,

            'brands' => $brands,
            'rams' => $rams,
            'hardDrives' => $hardDrives,
            'processors' => $processors,
            'powerSupplies' => $powerSupplies,
            'motherboards' => $motherboards,
            'networkCards' => $networkCards,
            'raidControllers' => $raidControllers,
            'coolingSolutions' => $coolingSolutions,
            'chassis' => $chassis,
            'graphicCards' => $graphicCards,
            'fiberOpticCards' => $fiberOpticCards,
            'expansionCards' => $expansionCards,
            'batteries' => $batteries,
            'cable_connectors' => $cableConnectors,
        ]);
    }





    public function update(Request $request, Server $server)
    {
        $oldAttributes = $server->getAttributes();
        $oldRelations = [];
        $relationships = [
            'rams',
            'hardDrives',
            'processors',
            'powerSupplies',
            'motherboards',
            'networkCards',
            'raidControllers',
            'coolingSolutions',
            'chassis',
            'graphicCards',
            'fiberOpticCards',
            'expansionCards',
            'batteries',
            'cable_connectors',
        ];

        // Capture old relationship IDs
        foreach ($relationships as $relation) {
            $oldRelations[$relation] = $server->$relation->pluck('id')->toArray();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',
            'ram_ids' => 'nullable|array',
            'ram_ids.*' => 'exists:rams,id',
            'hard_drive_ids' => 'nullable|array',
            'hard_drive_ids.*' => 'exists:hard_drives,id',
            'processor_ids' => 'nullable|array',
            'processor_ids.*' => 'exists:processors,id',
            'power_supply_ids' => 'nullable|array',
            'power_supply_ids.*' => 'exists:power_supplies,id',
            'motherboard_ids' => 'nullable|array',
            'motherboard_ids.*' => 'exists:motherboards,id',
            'network_card_ids' => 'nullable|array',
            'network_card_ids.*' => 'exists:network_cards,id',
            'raid_controller_ids' => 'nullable|array',
            'raid_controller_ids.*' => 'exists:raid_controllers,id',
            'cooling_solution_ids' => 'nullable|array',
            'cooling_solution_ids.*' => 'exists:cooling_solutions,id',
            'chassis_ids' => 'nullable|array',
            'chassis_ids.*' => 'exists:chassis,id',
            'graphic_card_ids' => 'nullable|array',
            'graphic_card_ids.*' => 'exists:graphic_cards,id',
            'fiber_optic_card_ids' => 'nullable|array',
            'fiber_optic_card_ids.*' => 'exists:fiber_optic_cards,id',
            'expansion_card_ids' => 'nullable|array',
            'expansion_card_ids.*' => 'exists:expansion_cards,id',
            'battery_ids' => 'nullable|array',
            'battery_ids.*' => 'exists:batteries,id',
            'cable_connector_ids' => 'nullable|array',
            'cable_connector_ids.*' => 'exists:cable_connectors,id',
            'price' => 'required|numeric|min:1',
            'model' => 'required|string|max:255',
            'cpu_socket' => 'required|string|max:255',
            'ram_slots' => 'required|integer|min:1',
            'storage_slots' => 'required|integer|min:1',
            'power_supply_type' => 'required|string|max:255',
            'rack_mountable' => 'required|boolean',
            'form_factor' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update server attributes
        $server->update($validated);
        $this->logAudit('modifier', $server, [
            'old' => $oldAttributes,
            'new' => $server->getChanges()
        ]);

        // Define relationship mapping
        $relationMap = [
            'ram_ids' => 'rams',
            'hard_drive_ids' => 'hardDrives',
            'processor_ids' => 'processors',
            'power_supply_ids' => 'powerSupplies',
            'motherboard_ids' => 'motherboards',
            'network_card_ids' => 'networkCards',
            'raid_controller_ids' => 'raidControllers',
            'cooling_solution_ids' => 'coolingSolutions',
            'chassis_ids' => 'chassis',
            'graphic_card_ids' => 'graphicCards',
            'fiber_optic_card_ids' => 'fiberOpticCards',
            'expansion_card_ids' => 'expansionCards',
            'battery_ids' => 'batteries',
            'cable_connector_ids' => 'cable_connectors',
        ];

        // Handle relationships and audit logging
        foreach ($relationMap as $key => $relation) {
            $newIds = $validated[$key] ?? [];
            $oldIds = $oldRelations[$relation] ?? [];

            // Sync relationships
            $server->$relation()->sync($newIds);

            // Calculate changes
            $added = array_diff($newIds, $oldIds);
            $removed = array_diff($oldIds, $newIds);

            // Log attachments
            if (!empty($added)) {
                $this->logAudit("{$relation}_attacher", $server, [
                    'new' => $added
                ]);
            }

            // Log detachments
            if (!empty($removed)) {
                $this->logAudit("{$relation}_détacher", $server, [
                    'old' => $removed
                ]);
            }
        }

        // Image handling (keep your existing code)
        if ($request->hasFile('image')) {
            $oldImage = $server->image?->url;
            if ($server->image) {
                Storage::disk('public')->delete($server->image->url);
                $server->image()->delete();
            }

            $path = $request->file('image')->store('servers', 'public');
            $server->image()->create(['url' => $path]);

            $this->logAudit('image_modifier', $server, [
                'old' => ['image' => $oldImage],
                'new' => ['image' => $path]
            ]);
        }

        return redirect()->route('servers.index');
    }


    public function show(Server $server)
    {
        $serverWithRelations = $server->load([
            'brand',
            'rams',
            'hardDrives',
            'processors',
            'powerSupplies',
            'motherboards',
            'networkCards',
            'raidControllers',
            'coolingSolutions',
            'chassis',
            'graphicCards',
            'fiberOpticCards',
            'expansionCards',
            'image',
            'batteries',
            'cable_connectors',
        ]);

        $serverArray = $serverWithRelations->toArray();

        return Inertia::render('Servers/Show', [
            'server' => $serverArray,
        ]);
    }

    public function destroy(Server $server)
    {
        $oldAttributes = $server->getAttributes();
        $oldImage = $server->image?->url;

        if ($server->image) {
            Storage::disk('public')->delete($server->image->url);
            $server->image()->delete();
            $this->logAudit('image_supprimer', $server, ['old' => ['image' => $oldImage]]);
        }

        $server->rams()->detach();
        $server->hardDrives()->detach();
        $server->processors()->detach();
        $server->powerSupplies()->detach();
        $server->motherboards()->detach();
        $server->networkCards()->detach();
        $server->raidControllers()->detach();
        $server->coolingSolutions()->detach();
        $server->chassis()->detach();
        $server->graphicCards()->detach();
        $server->fiberOpticCards()->detach();
        $server->expansionCards()->detach();
        $server->batteries()->detach();
        $server->cable_connectors()->detach();

        $server->delete();
        $this->logAudit('supprimer', $server, ['old' => $oldAttributes]);
        return redirect()->route('servers.index');
    }
}
