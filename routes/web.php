<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\RamController;
use App\Http\Controllers\HardDriveController;
use App\Http\Controllers\ProcessorController;
use App\Http\Controllers\PowerSupplyController;
use App\Http\Controllers\MotherboardController;
use App\Http\Controllers\NetworkCardController;
use App\Http\Controllers\RaidControllerController;
use App\Http\Controllers\CoolingSolutionController;
use App\Http\Controllers\ChassisController;
use App\Http\Controllers\GraphicCardController;
use App\Http\Controllers\FiberOpticCardController;
use App\Http\Controllers\ExpansionCardController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\DiscountComponentController;
use App\Http\Controllers\CableConnectorController;
use App\Http\Controllers\BatteryController;
use App\Http\Controllers\StockLevelController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::middleware(['verified'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
    });


    // Suppliers
    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('suppliers.index')->middleware('can:' . PermissionsEnum::ListSuppliers->value);
        Route::get('/create', [SupplierController::class, 'create'])->name('suppliers.create')->middleware('can:' . PermissionsEnum::AddSuppliers->value);
        Route::post('/', [SupplierController::class, 'store'])->name('suppliers.store')->middleware('can:' . PermissionsEnum::AddSuppliers->value);
        Route::get('/{supplier}', [SupplierController::class, 'show'])->name('suppliers.show')->middleware('can:' . PermissionsEnum::ShowSuppliers->value);
        Route::get('/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit')->middleware('can:' . PermissionsEnum::EditSuppliers->value);
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update')->middleware('can:' . PermissionsEnum::EditSuppliers->value);
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy')->middleware('can:' . PermissionsEnum::DeleteSuppliers->value);
    });

    // Discount Components
    Route::prefix('discountComponents')->group(function () {
        Route::get('/', [DiscountComponentController::class, 'index'])->name('discountComponents.index')->middleware('can:' . PermissionsEnum::ListDiscounts_Composants->value);
        Route::get('/create', [DiscountComponentController::class, 'create'])->name('discountComponents.create')->middleware('can:' . PermissionsEnum::AddDiscounts_Composants->value);
        Route::post('/', [DiscountComponentController::class, 'store'])->name('discountComponents.store')->middleware('can:' . PermissionsEnum::AddDiscounts_Composants->value);
        Route::get('/{discount}/edit', [DiscountComponentController::class, 'edit'])->name('discountComponents.edit')->middleware('can:' . PermissionsEnum::EditDiscounts_Composants->value);
        Route::put('/{discount}', [DiscountComponentController::class, 'update'])->name('discountComponents.update')->middleware('can:' . PermissionsEnum::EditDiscounts_Composants->value);
        Route::delete('/{discount}', [DiscountComponentController::class, 'destroy'])->name('discountComponents.destroy')->middleware('can:' . PermissionsEnum::DeleteDiscounts_Composants->value);
        Route::get('/{discount}', [DiscountComponentController::class, 'show'])->name('discounts.show')->middleware('can:' . PermissionsEnum::ShowDiscounts_Composants->value);
    });

    // Discounts (Servers)
    Route::prefix('discounts')->group(function () {
        Route::get('/', [DiscountController::class, 'index'])->name('discounts.index')->middleware('can:' . PermissionsEnum::ListDiscounts_Servers->value);
        Route::get('/create', [DiscountController::class, 'create'])->name('discounts.create')->middleware('can:' . PermissionsEnum::AddDiscounts_Servers->value);
        Route::post('/', [DiscountController::class, 'store'])->name('discounts.store')->middleware('can:' . PermissionsEnum::AddDiscounts_Servers->value);
        Route::get('/{discount}', [DiscountController::class, 'show'])->name('discounts.show')->middleware('can:' . PermissionsEnum::ShowDiscounts_Servers->value);
        Route::get('/{discount}/edit', [DiscountController::class, 'edit'])->name('discounts.edit')->middleware('can:' . PermissionsEnum::EditDiscounts_Servers->value);
        Route::put('/{discount}', [DiscountController::class, 'update'])->name('discounts.update')->middleware('can:' . PermissionsEnum::EditDiscounts_Servers->value);
        Route::delete('/{discount}', [DiscountController::class, 'destroy'])->name('discounts.destroy')->middleware('can:' . PermissionsEnum::DeleteDiscounts_Servers->value);
    });

    // Brands
    Route::prefix('brands')->group(function () {
        Route::get('/', [BrandController::class, 'index'])->name('brands.index')->middleware('can:' . PermissionsEnum::ListBrands->value);
        Route::get('/create', [BrandController::class, 'create'])->name('brands.create')->middleware('can:' . PermissionsEnum::AddBrands->value);
        Route::post('/', [BrandController::class, 'store'])->name('brands.store')->middleware('can:' . PermissionsEnum::AddBrands->value);
        Route::get('/{brand}', [BrandController::class, 'show'])->name('brands.show')->middleware('can:' . PermissionsEnum::ShowBrands->value);
        Route::get('/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit')->middleware('can:' . PermissionsEnum::EditBrands->value);
        Route::put('/{brand}', [BrandController::class, 'update'])->name('brands.update')->middleware('can:' . PermissionsEnum::EditBrands->value);
        Route::delete('/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy')->middleware('can:' . PermissionsEnum::DeleteBrands->value);
    });

    // RAMS
    Route::prefix('rams')->group(function () {
        Route::get('/', [RamController::class, 'index'])->name('rams.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [RamController::class, 'create'])->name('rams.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [RamController::class, 'store'])->name('rams.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{ram}', [RamController::class, 'show'])->name('rams.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{ram}/edit', [RamController::class, 'edit'])->name('rams.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{ram}', [RamController::class, 'update'])->name('rams.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{ram}', [RamController::class, 'destroy'])->name('rams.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Hard Drives
    Route::prefix('hard-drives')->group(function () {
        Route::get('/', [HardDriveController::class, 'index'])->name('hard-drives.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [HardDriveController::class, 'create'])->name('hard-drives.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [HardDriveController::class, 'store'])->name('hard-drives.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{hardDrive}', [HardDriveController::class, 'show'])->name('hard-drives.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{hardDrive}/edit', [HardDriveController::class, 'edit'])->name('hard-drives.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{hardDrive}', [HardDriveController::class, 'update'])->name('hard-drives.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{hardDrive}', [HardDriveController::class, 'destroy'])->name('hard-drives.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Processors
    Route::prefix('processors')->group(function () {
        Route::get('/', [ProcessorController::class, 'index'])->name('processors.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [ProcessorController::class, 'create'])->name('processors.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [ProcessorController::class, 'store'])->name('processors.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{processor}', [ProcessorController::class, 'show'])->name('processors.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{processor}/edit', [ProcessorController::class, 'edit'])->name('processors.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{processor}', [ProcessorController::class, 'update'])->name('processors.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{processor}', [ProcessorController::class, 'destroy'])->name('processors.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Raid Controllers
    Route::prefix('raid-controllers')->group(function () {
        Route::get('/', [RaidControllerController::class, 'index'])->name('raid-controllers.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [RaidControllerController::class, 'create'])->name('raid-controllers.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [RaidControllerController::class, 'store'])->name('raid-controllers.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{raidController}', [RaidControllerController::class, 'show'])->name('raid-controllers.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{raidController}/edit', [RaidControllerController::class, 'edit'])->name('raid-controllers.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{raidController}', [RaidControllerController::class, 'update'])->name('raid-controllers.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{raidController}', [RaidControllerController::class, 'destroy'])->name('raid-controllers.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Cooling Solutions
    Route::prefix('cooling-solutions')->group(function () {
        Route::get('/', [CoolingSolutionController::class, 'index'])->name('cooling-solutions.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [CoolingSolutionController::class, 'create'])->name('cooling-solutions.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [CoolingSolutionController::class, 'store'])->name('cooling-solutions.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{coolingSolution}', [CoolingSolutionController::class, 'show'])->name('cooling-solutions.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{coolingSolution}/edit', [CoolingSolutionController::class, 'edit'])->name('cooling-solutions.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{coolingSolution}', [CoolingSolutionController::class, 'update'])->name('cooling-solutions.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{coolingSolution}', [CoolingSolutionController::class, 'destroy'])->name('cooling-solutions.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Chassis
    Route::prefix('chassis')->group(function () {
        Route::get('/', [ChassisController::class, 'index'])->name('chassis.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [ChassisController::class, 'create'])->name('chassis.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [ChassisController::class, 'store'])->name('chassis.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{chassis}', [ChassisController::class, 'show'])->name('chassis.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{chassis}/edit', [ChassisController::class, 'edit'])->name('chassis.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{chassis}', [ChassisController::class, 'update'])->name('chassis.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{chassis}', [ChassisController::class, 'destroy'])->name('chassis.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Graphic Cards
    Route::prefix('graphic-cards')->group(function () {
        Route::get('/', [GraphicCardController::class, 'index'])->name('graphic-cards.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [GraphicCardController::class, 'create'])->name('graphic-cards.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [GraphicCardController::class, 'store'])->name('graphic-cards.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{graphicCard}', [GraphicCardController::class, 'show'])->name('graphic-cards.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{graphicCard}/edit', [GraphicCardController::class, 'edit'])->name('graphic-cards.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{graphicCard}', [GraphicCardController::class, 'update'])->name('graphic-cards.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{graphicCard}', [GraphicCardController::class, 'destroy'])->name('graphic-cards.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Fiber Optic Cards
    Route::prefix('fiber-optic-cards')->group(function () {
        Route::get('/', [FiberOpticCardController::class, 'index'])->name('fiber-optic-cards.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [FiberOpticCardController::class, 'create'])->name('fiber-optic-cards.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [FiberOpticCardController::class, 'store'])->name('fiber-optic-cards.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{fiberOpticCard}', [FiberOpticCardController::class, 'show'])->name('fiber-optic-cards.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{fiberOpticCard}/edit', [FiberOpticCardController::class, 'edit'])->name('fiber-optic-cards.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{fiberOpticCard}', [FiberOpticCardController::class, 'update'])->name('fiber-optic-cards.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{fiberOpticCard}', [FiberOpticCardController::class, 'destroy'])->name('fiber-optic-cards.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Expansion Cards
    Route::prefix('expansion-cards')->group(function () {
        Route::get('/', [ExpansionCardController::class, 'index'])->name('expansion-cards.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [ExpansionCardController::class, 'create'])->name('expansion-cards.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [ExpansionCardController::class, 'store'])->name('expansion-cards.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{expansionCard}', [ExpansionCardController::class, 'show'])->name('expansion-cards.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{expansionCard}/edit', [ExpansionCardController::class, 'edit'])->name('expansion-cards.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{expansionCard}', [ExpansionCardController::class, 'update'])->name('expansion-cards.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{expansionCard}', [ExpansionCardController::class, 'destroy'])->name('expansion-cards.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Cable Connectors
    Route::prefix('cable-connectors')->group(function () {
        Route::get('/', [CableConnectorController::class, 'index'])->name('cable-connectors.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [CableConnectorController::class, 'create'])->name('cable-connectors.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [CableConnectorController::class, 'store'])->name('cable-connectors.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{cableConnector}', [CableConnectorController::class, 'show'])->name('cable-connectors.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{cableConnector}/edit', [CableConnectorController::class, 'edit'])->name('cable-connectors.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{cableConnector}', [CableConnectorController::class, 'update'])->name('cable-connectors.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{cableConnector}', [CableConnectorController::class, 'destroy'])->name('cable-connectors.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    // Batteries
    Route::prefix('batteries')->group(function () {
        Route::get('/', [BatteryController::class, 'index'])->name('batteries.index')->middleware('can:' . PermissionsEnum::ListComposants->value);
        Route::get('/create', [BatteryController::class, 'create'])->name('batteries.create')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::post('/', [BatteryController::class, 'store'])->name('batteries.store')->middleware('can:' . PermissionsEnum::AddComposants->value);
        Route::get('/{battery}', [BatteryController::class, 'show'])->name('batteries.show')->middleware('can:' . PermissionsEnum::ShowComposants->value);
        Route::get('/{battery}/edit', [BatteryController::class, 'edit'])->name('batteries.edit')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::put('/{battery}', [BatteryController::class, 'update'])->name('batteries.update')->middleware('can:' . PermissionsEnum::EditComposants->value);
        Route::delete('/{battery}', [BatteryController::class, 'destroy'])->name('batteries.destroy')->middleware('can:' . PermissionsEnum::DeleteComposants->value);
    });

    Route::resource('rams', RamController::class);
    Route::resource('hard-drives', HardDriveController::class);
    Route::resource('processors', ProcessorController::class);
    Route::resource('power-supplies', PowerSupplyController::class);
    Route::resource('motherboards', MotherboardController::class);
    Route::resource('network-cards', NetworkCardController::class);
    Route::resource('raid-controllers', RaidControllerController::class);
    Route::resource('cooling-solutions', CoolingSolutionController::class);
    Route::resource('chassis', ChassisController::class);
    Route::resource('graphic-cards', GraphicCardController::class);
    Route::resource('fiber-optic-cards', FiberOpticCardController::class);
    Route::resource('expansion-cards', ExpansionCardController::class);
    Route::resource('cable-connectors', CableConnectorController::class);
    Route::resource('batteries', BatteryController::class);

    // Stock Movements
    Route::prefix('stock-movements')->group(function () {
        Route::get('/', [StockMovementController::class, 'index'])->name('stock-movements.index')->middleware('can:' . PermissionsEnum::ListStock_Mouvements->value);
        Route::get('/create', [StockMovementController::class, 'create'])->name('stock-movements.create')->middleware('can:' . PermissionsEnum::AddStock_Mouvements->value);
        Route::post('/', [StockMovementController::class, 'store'])->name('stock-movements.store')->middleware('can:' . PermissionsEnum::AddStock_Mouvements->value);
        Route::get('/{stockMovement}', [StockMovementController::class, 'show'])->name('stock-movements.show')->middleware('can:' . PermissionsEnum::ShowStock_Mouvements->value);
        Route::get('/{stockMovement}/edit', [StockMovementController::class, 'edit'])->name('stock-movements.edit')->middleware('can:' . PermissionsEnum::EditStock_Mouvements->value);
        Route::put('/{stockMovement}', [StockMovementController::class, 'update'])->name('stock-movements.update')->middleware('can:' . PermissionsEnum::EditStock_Mouvements->value);
        Route::delete('/{stockMovement}', [StockMovementController::class, 'destroy'])->name('stock-movements.destroy')->middleware('can:' . PermissionsEnum::DeleteStock_Mouvements->value);
    });

    Route::get('/get-components/{type}', [StockMovementController::class, 'getComponents'])
        ->name('stock-movements.get-components')
        ->middleware('can:' . PermissionsEnum::ListStock_Mouvements->value);

    // Stock Levels
    Route::prefix('stock-levels')->group(function () {
        Route::get('/', [StockLevelController::class, 'index'])->name('stock-levels.index')->middleware('can:' . PermissionsEnum::ListStock_Levels->value);
        Route::get('/{stockLevel}', [StockLevelController::class, 'show'])->name('stock-levels.show')->middleware('can:' . PermissionsEnum::ShowStock_Levels->value);
    });

    // Servers
    Route::prefix('servers')->group(function () {
        Route::get('/', [ServerController::class, 'index'])->name('servers.index')->middleware('can:' . PermissionsEnum::ListServers->value);
        Route::get('/create', [ServerController::class, 'create'])->name('servers.create')->middleware('can:' . PermissionsEnum::AddServers->value);
        Route::post('/', [ServerController::class, 'store'])->name('servers.store')->middleware('can:' . PermissionsEnum::AddServers->value);
        Route::get('/{server}', [ServerController::class, 'show'])->name('servers.show')->middleware('can:' . PermissionsEnum::ShowServers->value);
        Route::get('/{server}/edit', [ServerController::class, 'edit'])->name('servers.edit')->middleware('can:' . PermissionsEnum::EditServers->value);
        Route::put('/{server}', [ServerController::class, 'update'])->name('servers.update')->middleware('can:' . PermissionsEnum::EditServers->value);
        Route::delete('/{server}', [ServerController::class, 'destroy'])->name('servers.destroy')->middleware('can:' . PermissionsEnum::DeleteServers->value);
    });

    // Customers
    Route::resource('customers', CustomerController::class);

    // Users Management
    Route::middleware(['auth', 'can:manage_users'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    });

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
