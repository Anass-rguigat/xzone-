<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Battery;
use App\Models\CableConnector;
use App\Models\Chassis;
use App\Models\CoolingSolution;
use App\Models\Discount;
use App\Models\ExpansionCard;
use App\Models\FiberOpticCard;
use App\Models\GraphicCard;
use App\Models\HardDrive;
use App\Models\Motherboard;
use App\Models\NetworkCard;
use App\Models\PowerSupply;
use App\Models\Processor;
use App\Models\RaidController;
use App\Models\Ram;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DiscountComponentController extends Controller
{
    private $componentTypes = [
        'rams',
        'processors',
        'motherboards',
        'raidControllers',
        'chassis',
        'fiberOpticCards',
        'hardDrives',
        'networkCards',
        'powerSupplies',
        'coolingSolutions',
        'graphicCards',
        'expansionCards',
        'batteries',
        'cable_connectors',
    ];

    public function index()
    {
        $discounts = Discount::doesntHave('servers')->get();

        return Inertia::render('DiscountComponents/Index', [
            'discounts' => $discounts
        ]);
    }
    private function logAudit($event, $discount, $changes = null)
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
            'auditable_type' => Discount::class,
            'auditable_id' => $discount->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function create()
    {
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
        $cableConnectors = CableConnector::all();
        return Inertia::render('DiscountComponents/Create', [
            'rams' => $rams,
            'hard_drives' => $hardDrives,
            'processors' => $processors,
            'power_supplies' => $powerSupplies,
            'motherboards' => $motherboards,
            'network_cards' => $networkCards,
            'raid_controllers' => $raidControllers,
            'cooling_solutions' => $coolingSolutions,
            'chassis' => $chassis,
            'graphic_cards' => $graphicCards,
            'fiber_optic_cards' => $fiberOpticCards,
            'expansion_cards' => $expansionCards,
            'battery' => $batteries,
            'cable_connector' => $cableConnectors,
        ]);
    }






    public function edit($id)
    {
        $discount = Discount::with([
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
            'cable_connectors'
        ])->findOrFail($id);

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
        $cableConnectors = CableConnector::all();
        return Inertia::render('DiscountComponents/Edit', [
            'discount' => $discount,
            'rams' => $rams,
            'hard_drives' => $hardDrives,
            'processors' => $processors,
            'power_supplies' => $powerSupplies,
            'motherboards' => $motherboards,
            'network_cards' => $networkCards,
            'raid_controllers' => $raidControllers,
            'cooling_solutions' => $coolingSolutions,
            'chassis' => $chassis,
            'graphic_cards' => $graphicCards,
            'fiber_optic_cards' => $fiberOpticCards,
            'expansion_cards' => $expansionCards,
            'batteries' => $batteries,
            'cable_connectors' => $cableConnectors,
        ]);
    }

    public function show(Discount $discount)
    {
        $componentTypes = [
            'rams',
            'processors',
            'motherboards',
            'raidControllers',
            'chassis',
            'fiberOpticCards',
            'hardDrives',
            'networkCards',
            'powerSupplies',
            'coolingSolutions',
            'graphicCards',
            'expansionCards',
            'batteries',
            'cable_connectors',
        ];

        $components = [];

        foreach ($componentTypes as $type) {
            $components[$type] = $discount->$type()
                ->get()
                ->map(function ($component) use ($discount) {
                    $currentPrice = $component->price;
                    $originalPrice = $this->calculateOriginalPrice(
                        $currentPrice,
                        $discount->discount_type,
                        $discount->value
                    );

                    return [
                        'id' => $component->id,
                        'name' => $component->name,
                        'original_price' => $originalPrice,
                        'current_price' => $currentPrice,
                    ];
                });
        }

        return Inertia::render('DiscountComponents/Show', [
            'discount' => $discount,
            'components' => $components,
        ]);
    }

    private function calculateOriginalPrice($currentPrice, $type, $value)
    {
        if ($type === 'percentage') {
            return round($currentPrice / (1 - ($value / 100)), 2);
        }

        if ($type === 'fixed') {
            return $currentPrice + $value;
        }

        return $currentPrice;
    }

    public function update(Request $request, Discount $discount)
    {
        $oldAttributes = $discount->getAttributes();
        $oldComponents = $this->getComponentIds($discount);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'components' => 'nullable|array',
            'components.*.ram_id' => 'nullable|exists:rams,id',
            'components.*.processor_id' => 'nullable|exists:processors,id',
            'components.*.motherboard_id' => 'nullable|exists:motherboards,id',
            'components.*.raid_controller_id' => 'nullable|exists:raid_controllers,id',
            'components.*.chassi_id' => 'nullable|exists:chassis,id',
            'components.*.fiber_optic_card_id' => 'nullable|exists:fiber_optic_cards,id',
            'components.*.hard_drive_id' => 'nullable|exists:hard_drives,id',
            'components.*.network_card_id' => 'nullable|exists:network_cards,id',
            'components.*.power_supplie_id' => 'nullable|exists:power_supplies,id',
            'components.*.cooling_solution_id' => 'nullable|exists:cooling_solutions,id',
            'components.*.graphic_card_id' => 'nullable|exists:graphic_cards,id',
            'components.*.expansion_card_id' => 'nullable|exists:expansion_cards,id',
            'components.*.batterie_id' => 'nullable|exists:batteries,id',
            'components.*.cable_connector_id' => 'nullable|exists:cable_connectors,id',
        ]);

        $this->revertComponentPrices($discount);

        $componentTypes = [
            'rams',
            'processors',
            'motherboards',
            'raidControllers',
            'chassis',
            'fiberOpticCards',
            'hardDrives',
            'networkCards',
            'powerSupplies',
            'coolingSolutions',
            'graphicCards',
            'expansionCards',
            'batteries',
            'cable_connectors',
        ];

        foreach ($componentTypes as $relation) {
            $discount->$relation()->detach();
        }
        $discount->update([
            'name' => $validated['name'],
            'discount_type' => $validated['discount_type'],
            'value' => $validated['value'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        if ($validated['components']) {
            $this->applyDiscountToComponentsUpdate($validated['components'], $discount);
        }
        $discount->load($this->componentTypes);
        $newComponents = $this->getComponentIds($discount);

        $this->logAudit('updated', $discount, [
            'old' => array_merge($oldAttributes, ['components' => $oldComponents]),
            'new' => array_merge($discount->getChanges(), ['components' => $newComponents])
        ]);
        return redirect()->route('discountComponents.index')->with('success', 'Réduction mise à jour avec succès.');
    }

    public function destroy(Discount $discount)
    {
        $oldAttributes = $discount->getAttributes();
        $oldComponents = $this->getComponentIds($discount);

        $this->revertComponentPrices($discount);
        $componentTypes = [
            'rams',
            'processors',
            'motherboards',
            'raidControllers',
            'chassis',
            'fiberOpticCards',
            'hardDrives',
            'networkCards',
            'powerSupplies',
            'coolingSolutions',
            'graphicCards',
            'expansionCards',
            'batteries',
            'cable_connectors',
        ];

        foreach ($componentTypes as $relation) {
            $discount->$relation()->detach();
        }

        $discount->delete();

        $this->logAudit('deleted', $discount, [
            'old' => array_merge($oldAttributes, ['components' => $oldComponents])
        ]);

        return redirect()->route('discountComponents.index')->with('success', 'Discount deleted and prices reverted successfully');
    }

    public function store(Request $request)
    {
        $valid = $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'components' => 'nullable|array',
            'components.*.ram_id' => 'nullable|exists:rams,id',
            'components.*.processor_id' => 'nullable|exists:processors,id',
            'components.*.motherboard_id' => 'nullable|exists:motherboards,id',
            'components.*.raid_controller_id' => 'nullable|exists:raid_controllers,id',
            'components.*.chassi_id' => 'nullable|exists:chassis,id',
            'components.*.fiber_optic_card_id' => 'nullable|exists:fiber_optic_cards,id',
            'components.*.hard_drive_id' => 'nullable|exists:hard_drives,id',
            'components.*.network_card_id' => 'nullable|exists:network_cards,id',
            'components.*.power_supplie_id' => 'nullable|exists:power_supplies,id',
            'components.*.cooling_solution_id' => 'nullable|exists:cooling_solutions,id',
            'components.*.graphic_card_id' => 'nullable|exists:graphic_cards,id',
            'components.*.expansion_card_id' => 'nullable|exists:expansion_cards,id',
            'components.*.batterie_id' => 'nullable|exists:batteries,id',
            'components.*.cable_connector_id' => 'nullable|exists:cable_connectors,id',
        ]);

        $discount = Discount::create([
            'name' => $request->name,
            'discount_type' => $request->discount_type,
            'value' => $request->value,
            'start_date' => $request->start_date ?? Carbon::now(),
            'end_date' => $request->end_date,
        ]);
        $this->applyDiscountToComponentsStore($request, $discount);

        $discount->load($this->componentTypes);
        $componentData = $this->getComponentIds($discount);

        $this->logAudit('created', $discount, [
            'new' => array_merge($discount->getAttributes(), ['components' => $componentData])
        ]);
        
        return redirect()->route('discountComponents.index')->with('success', 'Discount created successfully');
    }

    protected function applyDiscountToComponentsStore($request, Discount $discount)
    {
        if ($request->components) {
            foreach ($request->components as $component) {
                if (isset($component['ram_id'])) {
                    try {
                        $ram = Ram::findOrFail($component['ram_id']);
                        $ram->discounts()->attach($discount);
                        $this->updateComponentPrice($ram, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to RAM', $e->getMessage());
                    }
                }

                if (isset($component['processor_id'])) {
                    try {
                        $processor = Processor::findOrFail($component['processor_id']);
                        $processor->discounts()->attach($discount);
                        $this->updateComponentPrice($processor, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to Processor', $e->getMessage());
                    }
                }

                if (isset($component['batterie_id'])) {
                    try {
                        $battery = Battery::findOrFail($component['batterie_id']);
                        $battery->discounts()->attach($discount);
                        $this->updateComponentPrice($battery, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to battery', $e->getMessage());
                    }
                }

                if (isset($component['cable_connector_id'])) {
                    try {
                        $cableConnector = CableConnector::findOrFail($component['cable_connector_id']);
                        $cableConnector->discounts()->attach($discount);
                        $this->updateComponentPrice($cableConnector, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to cable connector', $e->getMessage());
                    }
                }

                if (isset($component['motherboard_id'])) {

                    try {
                        $motherboards = Motherboard::findOrFail($component['motherboard_id']);
                        $motherboards->discounts()->attach($discount);
                        $this->updateComponentPrice($motherboards, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to motherboard', $e->getMessage());
                    }
                }

                if (isset($component['raid_controller_id'])) {

                    try {
                        $raid_controller = RaidController::findOrFail($component['raid_controller_id']);
                        $raid_controller->discounts()->attach($discount);
                        $this->updateComponentPrice($raid_controller, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to raid controller', $e->getMessage());
                    }
                }

                if (isset($component['chassi_id'])) {

                    try {
                        $chassis = Chassis::findOrFail($component['chassi_id']);
                        $chassis->discounts()->attach($discount);
                        $this->updateComponentPrice($chassis, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to chassis', $e->getMessage());
                    }
                }

                if (isset($component['fiber_optic_card_id'])) {

                    try {
                        $fiber_optic_card = FiberOpticCard::findOrFail($component['fiber_optic_card_id']);
                        $fiber_optic_card->discounts()->attach($discount);
                        $this->updateComponentPrice($fiber_optic_card, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to fiber optic card', $e->getMessage());
                    }
                }

                if (isset($component['hard_drive_id'])) {

                    try {
                        $hard_drive = HardDrive::findOrFail($component['hard_drive_id']);
                        $hard_drive->discounts()->attach($discount);
                        $this->updateComponentPrice($hard_drive, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to hard drive', $e->getMessage());
                    }
                }

                if (isset($component['network_card_id'])) {

                    try {
                        $network_card = NetworkCard::findOrFail($component['network_card_id']);
                        $network_card->discounts()->attach($discount);
                        $this->updateComponentPrice($network_card, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to network card', $e->getMessage());
                    }
                }

                if (isset($component['power_supplie_id'])) {

                    try {
                        $power_supplie = PowerSupply::findOrFail($component['power_supplie_id']);
                        $power_supplie->discounts()->attach($discount);
                        $this->updateComponentPrice($power_supplie, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to power_supplie ', $e->getMessage());
                    }
                }

                if (isset($component['cooling_solution_id'])) {

                    try {
                        $cooling_solution = CoolingSolution::findOrFail($component['cooling_solution_id']);
                        $cooling_solution->discounts()->attach($discount);
                        $this->updateComponentPrice($cooling_solution, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to cooling_solution', $e->getMessage());
                    }
                }

                if (isset($component['graphic_card_id'])) {

                    try {
                        $graphic_card = GraphicCard::findOrFail($component['graphic_card_id']);
                        $graphic_card->discounts()->attach($discount);
                        $this->updateComponentPrice($graphic_card, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to graphic_card', $e->getMessage());
                    }
                }

                if (isset($component['expansion_card_id'])) {

                    try {
                        $expansion_card = ExpansionCard::findOrFail($component['expansion_card_id']);
                        $expansion_card->discounts()->attach($discount);
                        $this->updateComponentPrice($expansion_card, $discount);
                    } catch (\Exception $e) {
                        dd('Error applying discount to expansion_card', $e->getMessage());
                    }
                }
            }
        } else {
            dd('No components provided in the request.');
        }
    }


    protected function applyDiscountToComponentsUpdate($components, Discount $discount)
    {
        if ($components) {
            foreach ($components as $component) {
                if (is_array($component)) {
                    if (isset($component['ram_id'])) {
                        $ram = Ram::findOrFail($component['ram_id']);
                        $ram->discounts()->attach($discount);
                        $this->updateComponentPrice($ram, $discount);
                    }

                    if (isset($component['processor_id'])) {
                        $processor = Processor::findOrFail($component['processor_id']);
                        $processor->discounts()->attach($discount);
                        $this->updateComponentPrice($processor, $discount);
                    }

                    if (isset($component['motherboard_id'])) {
                        $motherboard = Motherboard::findOrFail($component['motherboard_id']);
                        $motherboard->discounts()->attach($discount);
                        $this->updateComponentPrice($motherboard, $discount);
                    }

                    if (isset($component['raid_controller_id'])) {
                        $raidController = RaidController::findOrFail($component['raid_controller_id']);
                        $raidController->discounts()->attach($discount);
                        $this->updateComponentPrice($raidController, $discount);
                    }

                    if (isset($component['chassi_id'])) {
                        $chassis = Chassis::findOrFail($component['chassi_id']);
                        $chassis->discounts()->attach($discount);
                        $this->updateComponentPrice($chassis, $discount);
                    }

                    if (isset($component['fiber_optic_card_id'])) {
                        $fiberOpticCard = FiberOpticCard::findOrFail($component['fiber_optic_card_id']);
                        $fiberOpticCard->discounts()->attach($discount);
                        $this->updateComponentPrice($fiberOpticCard, $discount);
                    }

                    if (isset($component['hard_drive_id'])) {
                        $hardDrive = HardDrive::findOrFail($component['hard_drive_id']);
                        $hardDrive->discounts()->attach($discount);
                        $this->updateComponentPrice($hardDrive, $discount);
                    }

                    if (isset($component['network_card_id'])) {
                        $networkCard = NetworkCard::findOrFail($component['network_card_id']);
                        $networkCard->discounts()->attach($discount);
                        $this->updateComponentPrice($networkCard, $discount);
                    }

                    if (isset($component['power_supplie_id'])) {
                        $powerSupply = PowerSupply::findOrFail($component['power_supplie_id']);
                        $powerSupply->discounts()->attach($discount);
                        $this->updateComponentPrice($powerSupply, $discount);
                    }

                    if (isset($component['cooling_solution_id'])) {
                        $coolingSolution = CoolingSolution::findOrFail($component['cooling_solution_id']);
                        $coolingSolution->discounts()->attach($discount);
                        $this->updateComponentPrice($coolingSolution, $discount);
                    }

                    if (isset($component['graphic_card_id'])) {
                        $graphicCard = GraphicCard::findOrFail($component['graphic_card_id']);
                        $graphicCard->discounts()->attach($discount);
                        $this->updateComponentPrice($graphicCard, $discount);
                    }
                    if (isset($component['batterie_id'])) {
                        try {
                            $battery = Battery::findOrFail($component['batterie_id']);
                            $battery->discounts()->attach($discount);
                            $this->updateComponentPrice($battery, $discount);
                        } catch (\Exception $e) {
                            dd('Error applying discount to battery', $e->getMessage());
                        }
                    }

                    if (isset($component['cable_connector_id'])) {
                        try {
                            $cableConnector = CableConnector::findOrFail($component['cable_connector_id']);
                            $cableConnector->discounts()->attach($discount);
                            $this->updateComponentPrice($cableConnector, $discount);
                        } catch (\Exception $e) {
                            dd('Error applying discount to cable connector', $e->getMessage());
                        }
                    }

                    if (isset($component['expansion_card_id'])) {
                        $expansionCard = ExpansionCard::findOrFail($component['expansion_card_id']);
                        $expansionCard->discounts()->attach($discount);
                        $this->updateComponentPrice($expansionCard, $discount);
                    }
                }
            }
        } else {
        }
    }

    protected function updateComponentPrice($component, Discount $discount)
    {
        $originalPrice = $component->price;
        $newPrice = $originalPrice;

        if ($discount->discount_type === 'percentage') {
            $newPrice -= ($originalPrice * ($discount->value / 100));
        } elseif ($discount->discount_type === 'fixed') {
            $newPrice -= $discount->value;
        }

        $component->price = max($newPrice, 0);
        $component->save();
    }

    protected function revertComponentPrices(Discount $discount)
    {
        foreach ($discount->rams as $ram) {
            $this->revertPrice($ram, $discount);
        }

        foreach ($discount->batteries as $battery) {
            $this->revertPrice($battery, $discount);
        }

        foreach ($discount->cable_connectors as $cableConnector) {
            $this->revertPrice($cableConnector, $discount);
        }

        foreach ($discount->processors as $processor) {
            $this->revertPrice($processor, $discount);
        }

        foreach ($discount->motherboards as $motherboard) {
            $this->revertPrice($motherboard, $discount);
        }

        foreach ($discount->raidControllers as $raidController) {
            $this->revertPrice($raidController, $discount);
        }

        foreach ($discount->chassis as $chassi) {
            $this->revertPrice($chassi, $discount);
        }

        foreach ($discount->fiberOpticCards as $fiberOpticCard) {
            $this->revertPrice($fiberOpticCard, $discount);
        }

        foreach ($discount->hardDrives as $hardDrive) {
            $this->revertPrice($hardDrive, $discount);
        }

        foreach ($discount->networkCards as $networkCard) {
            $this->revertPrice($networkCard, $discount);
        }

        foreach ($discount->powerSupplies as $powerSupply) {
            $this->revertPrice($powerSupply, $discount);
        }

        foreach ($discount->coolingSolutions as $coolingSolution) {
            $this->revertPrice($coolingSolution, $discount);
        }

        foreach ($discount->graphicCards as $graphicCard) {
            $this->revertPrice($graphicCard, $discount);
        }

        foreach ($discount->expansionCards as $expansionCard) {
            $this->revertPrice($expansionCard, $discount);
        }
    }

    protected function revertPrice($component, Discount $discount)
    {
        $currentPrice = $component->price;
        $originalPrice = $currentPrice;

        if ($discount->discount_type === 'percentage') {
            $originalPrice = $currentPrice / (1 - $discount->value / 100);
        } elseif ($discount->discount_type === 'fixed') {
            $originalPrice = $currentPrice + $discount->value;
        }

        $component->price = max($originalPrice, 0);
        $component->save();
    }

    private function getComponentIds(Discount $discount)
    {
        $componentData = [];
        foreach ($this->componentTypes as $type) {
            $componentData[$type] = $discount->$type->pluck('id')->toArray();
        }
        return $componentData;
    }
}

