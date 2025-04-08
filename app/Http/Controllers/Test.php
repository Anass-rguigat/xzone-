<?php

namespace App\Http\Controllers;

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
use Inertia\Inertia;

class DiscountComponentController extends Controller
{
    /**
     * Display a listing of the discounts.
     */
    public function index()
    {
        // Retrieve all discounts that are applied to RAM (doesn't have servers)
        $discounts = Discount::doesntHave('servers')->get();

        return Inertia::render('DiscountComponents/Index', [
            'discounts' => $discounts
        ]);
    }

    /**
     * Show the form for creating a new discount.
     */
    public function create()
{
    // Get all components for selection
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
    ]);
}



    


public function edit($id)
{
    // Find the discount component by ID and eager load related components
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
        'expansionCards'
    ])->findOrFail($id);

    

    // Prepare other component data
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

    // Return the Inertia view with the loaded data
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
    ]);
}

    /**
     * Store a newly created discount in storage and apply it to a RAM.
     */
    

    /**
     * Display the specified discount.
     */
    public function show(Discount $discount)
    {
        return view('DiscountComponents.show', compact('discount'));
    }

    /**
     * Show the form for editing the specified discount.
     */
    
    /**
     * Update the specified discount in storage.
     */
    public function update(Request $request, Discount $discount)
{
    
    // Validate the request input
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'discount_type' => 'required|in:percentage,fixed',
        'value' => 'required|numeric|min:0',
        'start_date' => 'nullable|date',
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
    ]);
    
    $this->revertComponentPrices($discount);

    // Mise à jour du discount
    $discount->update([
        'name' => $validated['name'],
        'discount_type' => $validated['discount_type'],
        'value' => $validated['value'],
        'start_date' => $validated['start_date'],
        'end_date' => $validated['end_date'],
    ]);

    // Appliquer la nouvelle réduction sur les composants sélectionnés
    if ($validated['components']) {
        $this->applyDiscountToComponents($validated['components'], $discount);
    }

    // Redirection avec message de succès
    return redirect()->route('discountComponents.index')->with('success', 'Réduction mise à jour avec succès.');
}


    /**
     * Remove the specified discount from storage.
     */
    public function destroy(Discount $discount)
    {
        // Revert RAM prices back to original value for each associated RAM
        foreach ($discount->rams as $ram) {
            $this->revertPrice($ram, $discount);
        }

        // Detach all associated RAMs from the discount
        $discount->rams()->detach();

        // Delete the discount
        $discount->delete();

        return redirect()->route('discountComponents.index')->with('success', 'Discount deleted and prices reverted successfully');
    }

    /**
     * Update the RAM price based on the applied discount.
     */
    public function store(Request $request)
    {
        $valid = $request->validate([
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
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
        ]);
        
        // Create the discount record
        $discount = Discount::create([
            'name' => $request->name,
            'discount_type' => $request->discount_type,
            'value' => $request->value,
            'start_date' => $request->start_date ?? Carbon::now(),
            'end_date' => $request->end_date,
        ]);
        // Apply the discount to the selected components
        $this->applyDiscountToComponents($request, $discount);
        
        return redirect()->route('discountComponents.index')->with('success', 'Discount created successfully');
    }

    /**
     * Apply the discount to the selected components.
     */
    protected function applyDiscountToComponents($components, Discount $discount)
{
    // Check if components are provided
    if ($components) {
        // Loop through all components and apply the discount
        foreach ($components as $component) {
            // Ensure the component is an array and contains at least one ID
            if (is_array($component)) {
                // Apply discount based on each component's ID (e.g., RAM, Processor)
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




/**
 * Update the price of the Processor after applying the discount.
 */
            protected function updateProcessorPrice(Processor $processor, Discount $discount)
            {
                $originalPrice = $processor->price;
                $newPrice = $originalPrice;

                // Apply the discount based on the type
                if ($discount->discount_type === 'percentage') {
                    $newPrice -= ($originalPrice * ($discount->value / 100));
                } elseif ($discount->discount_type === 'fixed') {
                    $newPrice -= $discount->value;
                }

                // Ensure the price does not go below zero
                $processor->price = max($newPrice, 0);
                $processor->save();
            }


    /**
     * Update the price of the RAM after applying the discount.
     */
    /**
 * Update the price of the component after applying the discount.
 */
protected function updateComponentPrice($component, Discount $discount)
{
    $originalPrice = $component->price;
    $newPrice = $originalPrice;

    // Apply the discount based on the type
    if ($discount->discount_type === 'percentage') {
        $newPrice -= ($originalPrice * ($discount->value / 100));
    } elseif ($discount->discount_type === 'fixed') {
        $newPrice -= $discount->value;
    }

    // Ensure the price does not go below zero
    $component->price = max($newPrice, 0);
    $component->save();
}

protected function revertComponentPrices(Discount $discount)
{
    // Revert the price for each attached component

    // Revert RAM prices
    foreach ($discount->rams as $ram) {
        $this->revertPrice($ram, $discount);
    }

    // Revert Processor prices
    foreach ($discount->processors as $processor) {
        $this->revertPrice($processor, $discount);
    }

    // Revert Motherboard prices
    foreach ($discount->motherboards as $motherboard) {
        $this->revertPrice($motherboard, $discount);
    }

    // Revert RAID Controller prices
    foreach ($discount->raidControllers as $raidController) {
        $this->revertPrice($raidController, $discount);
    }

    // Revert Chassis prices
    foreach ($discount->chassis as $chassi) {
        $this->revertPrice($chassi, $discount);
    }

    // Revert Fiber Optic Card prices
    foreach ($discount->fiberOpticCards as $fiberOpticCard) {
        $this->revertPrice($fiberOpticCard, $discount);
    }

    // Revert Hard Drive prices
    foreach ($discount->hardDrives as $hardDrive) {
        $this->revertPrice($hardDrive, $discount);
    }

    // Revert Network Card prices
    foreach ($discount->networkCards as $networkCard) {
        $this->revertPrice($networkCard, $discount);
    }

    // Revert Power Supply prices
    foreach ($discount->powerSupplies as $powerSupply) {
        $this->revertPrice($powerSupply, $discount);
    }

    // Revert Cooling Solution prices
    foreach ($discount->coolingSolutions as $coolingSolution) {
        $this->revertPrice($coolingSolution, $discount);
    }

    // Revert Graphic Card prices
    foreach ($discount->graphicCards as $graphicCard) {
        $this->revertPrice($graphicCard, $discount);
    }

    // Revert Expansion Card prices
    foreach ($discount->expansionCards as $expansionCard) {
        $this->revertPrice($expansionCard, $discount);
    }

    // Revert any other component types that may exist in the future
    // You can keep adding new components as necessary by following this structure
    // For example:
    // foreach ($discount->newComponentType as $newComponent) {
    //     $this->revertPrice($newComponent, $discount);
    // }

    // Continue to add more component types here if necessary...
}



    /**
     * Revert the RAM price to its original value when the discount is deleted.
     */
    protected function revertPrice($component, Discount $discount)
{
    $currentPrice = $component->price;
    $originalPrice = $currentPrice;

    // Calcul du prix d'origine en fonction du type de réduction
    if ($discount->discount_type === 'percentage') {
        // Pour une réduction en pourcentage, on calcule le prix d'origine
        $originalPrice = $currentPrice / (1 - $discount->value / 100);
    } elseif ($discount->discount_type === 'fixed') {
        // Pour une réduction fixe, on l'ajoute au prix actuel
        $originalPrice = $currentPrice + $discount->value;
    }

    // S'assurer que le prix original ne soit pas inférieur à zéro
    $component->price = max($originalPrice, 0);
    $component->save();
}


    /**
     * Automatically delete expired discounts and restore RAM's original price.
     */
    public function deleteExpiredDiscounts()
    {
        $expiredDiscounts = Discount::where('end_date', '<', Carbon::now())->get();

        foreach ($expiredDiscounts as $discount) {
            $discount->rams()->each(function ($ram) use ($discount) {
                // Restore the RAM price
                $this->revertPrice($ram, $discount);
                // Detach the discount from RAM
                $ram->discounts()->detach($discount->id);
            });

            // Delete the expired discount
            $discount->delete();
        }

        return response()->json(['message' => 'Expired discounts have been deleted and RAM prices restored.'], 200);
    }
}