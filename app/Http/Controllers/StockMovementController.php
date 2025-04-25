<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Battery;
use App\Models\CableConnector;
use App\Models\Chassis;
use App\Models\CoolingSolution;
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
use App\Models\Server;
use App\Models\StockMovement;
use App\Models\StockLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class StockMovementController extends Controller
{
    private function logAudit($event, $movement, $changes = null)
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
            'auditable_type' => StockMovement::class,
            'auditable_id' => $movement->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        $movements = StockMovement::with(['component', 'supplier'])
            ->latest()
            ->paginate(10);

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements
        ]);
    }

    public function create()
    {
        return Inertia::render('StockMovements/Create', [
            'componentTypes' => $this->getComponentTypes(),
            'suppliers' => \App\Models\Supplier::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'component_id'   => 'required|integer',
            'component_type' => 'required|string',
            'quantity'       => 'required|integer|min:1',
            'movement_type'  => 'required|in:in,out',
            'supplier_id'    => 'nullable|exists:suppliers,id',
            'date'           => 'required|date',
        ]);

        $validated['component_id'] = (int) $validated['component_id'];
        $validated['quantity'] = (int) $validated['quantity'];
        DB::beginTransaction();

        try {
        $movement = StockMovement::create($validated);
        $this->logAudit('created', $movement, ['new' => $movement->getAttributes()]);

        $stockLevel = StockLevel::where('component_id', $validated['component_id'])
            ->where('component_type', $validated['component_type'])
            ->first();

        if (!$stockLevel) {
            $stockLevel = StockLevel::create([
                'component_id'   => $validated['component_id'],
                'component_type' => $validated['component_type'],
                'quantity'       => $validated['quantity'],
            ]);
        } else {
            if ($movement->movement_type === 'in') {
                $stockLevel->increment('quantity', $validated['quantity']);
            } else {
                if (($stockLevel->quantity ?? 0) < $validated['quantity']) {
                    throw new \Exception('Stock insuffisant pour cette opération.');
                }
                $stockLevel->decrement('quantity', $validated['quantity']);
            }
        }

        DB::commit();

        return redirect()->route('stock-movements.index')
            ->with('success', 'Mouvement enregistré avec succès');

    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()
            ->withInput()
            ->withErrors(['stock' => $e->getMessage()]);
    }
    }

    private function getModelClass($type)
    {
        $componentTypes = [
            'Battery' => Battery::class,
            'Ram' => Ram::class,
            'Server' => Server::class,
            'cable' => CableConnector::class,
            'chassis' => Chassis::class,
            'coolingSolution' => CoolingSolution::class,
            'expansionCard' => ExpansionCard::class,
            'fiberOpticCard' => FiberOpticCard::class,
            'graphicCard' => GraphicCard::class,
            'hardDrive' => HardDrive::class,
            'motherboard' => Motherboard::class,
            'networkCard' => NetworkCard::class,
            'powerSupply' => PowerSupply::class,
            'processor' => Processor::class,
            'raidController' => RaidController::class,
        ];

        return $componentTypes[$type] ?? null;
    }


    public function edit(StockMovement $stockMovement)
    {
        $componentTypes = $this->getComponentTypes();
        $componentTypeKey = array_search($stockMovement->component_type, $componentTypes);

        return Inertia::render('StockMovements/Edit', [
            'movement' => $stockMovement,
            'componentTypes' => $componentTypes,
            'suppliers' => \App\Models\Supplier::all(),
            'components' => $componentTypeKey ? $this->getComponentsByType($componentTypeKey) : [],
            'selectedComponentType' => $componentTypeKey,
        ]);
    }

    public function update(Request $request, StockMovement $stockMovement)
    {
        $oldAttributes = $stockMovement->getAttributes();
        $validated = $request->validate([
            'component_id'   => 'required|integer',
            'component_type' => 'required|string',
            'quantity'       => 'required|integer|min:1',
            'movement_type'  => 'required|in:in,out',
            'supplier_id'    => 'nullable|exists:suppliers,id',
            'date'           => 'required|date',
        ]);


        DB::beginTransaction();
        try {
            $previousQuantity = $stockMovement->quantity;
            $previousType = $stockMovement->movement_type;
            $previousComponentId = $stockMovement->component_id;
            $previousComponentType = $stockMovement->component_type;

            

            $oldStockLevel = StockLevel::where('component_id', $previousComponentId)
                ->where('component_type', $previousComponentType)
                ->first();
            if ($oldStockLevel) {
                if ($previousType === 'in') {
                    $oldStockLevel->decrement('quantity', $previousQuantity);
                } else {
                    $oldStockLevel->increment('quantity', $previousQuantity);
                }
            }

            $newStockLevel = StockLevel::firstOrCreate([
                'component_id'   => $validated['component_id'],
                'component_type' => $validated['component_type'],
            ], ['quantity' => 0]);
            if ($validated['movement_type'] === 'out' && $newStockLevel->quantity < $validated['quantity']) {
                DB::rollBack();
                return redirect()->back()
                ->withErrors(['quantity' => 'Stock insuffisant pour cette opération.'])
                ->withInput();
            }

            $stockMovement->update($validated);
            $this->logAudit('updated', $stockMovement, [
                'old' => $oldAttributes,
                'new' => $stockMovement->getChanges()
            ]);
            Log::info('Mouvement mis à jour:', $stockMovement->toArray());

            if ($validated['movement_type'] === 'in') {
                $newStockLevel->increment('quantity', $validated['quantity']);
            } else {
                $newStockLevel->decrement('quantity', $validated['quantity']);
            }

            DB::commit();
        return redirect()->route('stock-movements.index')
            ->with('success', 'Mouvement mis à jour avec succès');
        } catch (ValidationException $e) {
            throw $e; // Laisse Inertia gérer les erreurs de validation automatiquement
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['global' => 'Erreur technique: ' . $e->getMessage()])
                ->withInput();
        }
    }



    public function destroy(StockMovement $stockMovement)
    {
        $oldAttributes = $stockMovement->getAttributes();
        DB::beginTransaction();
        try {

            $quantity = $stockMovement->quantity;
            $movementType = $stockMovement->movement_type;

            // Récupération du stock concerné
            $stockLevel = StockLevel::where('component_id', $stockMovement->component_id)
                ->where('component_type', $stockMovement->component_type)
                ->first();

            if (!$stockLevel) {
                return redirect()->back()->with('error', 'Stock introuvable.');
            }

            Log::info('StockLevel avant suppression:', $stockLevel->toArray());

            // Revert stock changes
            if ($movementType === 'in') {
                if ($stockLevel->quantity < $quantity) {
                    Log::error('Stock insuffisant pour suppression', ['id' => $stockMovement->id]);
                    return redirect()->back()->with('error', 'Impossible de supprimer : stock insuffisant.');
                }
                $stockLevel->decrement('quantity', $quantity);
            } else {
                $stockLevel->increment('quantity', $quantity);
            }

            // Suppression du mouvement
            $stockMovement->delete();
            $this->logAudit('deleted', $stockMovement, ['old' => $oldAttributes]);

            DB::commit();
            return redirect()->route('stock-movements.index')->with('success', 'Mouvement supprimé avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur suppression mouvement', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Erreur : ' . $e->getMessage());
        }
    }


    // Fonction pour obtenir les composants par type
    private function getComponentsByType($type)
    {
        $model = $this->getModelClass($type);
        return $model ? $model::select('id', 'name')->get() : collect();
    }

    // Récupérer les composants du type donné
    public function getComponents($type)
    {
        try {
        $model = match ($type) {
            'battery' => Battery::class,
            'ram' => Ram::class,
            'server' => Server::class,
            'cable' => CableConnector::class,
            'chassis' => Chassis::class,
            'coolingSolution' => CoolingSolution::class,
            'expansionCard' => ExpansionCard::class,
            'fiberOpticCard' => FiberOpticCard::class,
            'graphicCard' => GraphicCard::class,
            'hardDrive' => HardDrive::class,
            'motherboard' => Motherboard::class,
            'networkCard' => NetworkCard::class,
            'powerSupply' => PowerSupply::class,
            'processor' => Processor::class,
            'raidController' => RaidController::class,
            default => throw new \Exception('Type de composant invalide'),
        };

        if (!$model) {
            return response()->json([]);
        }

        return $model::select('id', 'name')->get();
        } catch (\Exception $e) {
        return response()->json(
            ['error' => $e->getMessage()],
            400
        );
    }
    }







    // Obtenir les types de composants
    private function getComponentTypes()
    {
        return [
            'battery' => 'App\Models\Battery',
            'ram' => 'App\Models\Ram',
            'server' => 'App\Models\Server',
            'cable' => 'App\Models\CableConnector',
            'chassis' => 'App\Models\Chassis',
            'coolingSolution' => 'App\Models\CoolingSolution',
            'expansionCard' => 'App\Models\ExpansionCard',
            'fiberOpticCard' => 'App\Models\FiberOpticCard',
            'graphicCard' => 'App\Models\GraphicCard',
            'hardDrive' => 'App\Models\HardDrive',
            'motherboard' => 'App\Models\Motherboard',
            'networkCard' => 'App\Models\NetworkCard',
            'powerSupply' => 'App\Models\PowerSupply',
            'processor' => 'App\Models\Processor',
            'raidController' => 'App\Models\RaidController',
        ];
    }
}
