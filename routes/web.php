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
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('suppliers', SupplierController::class);

    Route::get('discountComponents/create', [DiscountComponentController::class, 'create'])->name('discountComponents.create');
    Route::get('discountComponents', [DiscountComponentController::class, 'index'])->name('discountComponents.index');
    Route::post('discountComponents', [DiscountComponentController::class, 'store'])->name('discountComponents.store');
    Route::get('discountComponents/{discount}/edit', [DiscountComponentController::class, 'edit'])->name('discountComponents.edit'); // Edit route should come before update
    Route::put('discountComponents/{discount}', [DiscountComponentController::class, 'update'])->name('discountComponents.update');
    Route::delete('discountComponents/{discount}', [DiscountComponentController::class, 'destroy'])->name('discountComponents.destroy');
    Route::get('/discountComponents/{discount}', [DiscountComponentController::class, 'show'])->name('discounts.show');

    Route::resource('discounts', DiscountController::class);

    Route::resource('brands', BrandController::class);

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

    Route::resource('stock-movements', StockMovementController::class);
    Route::get('/get-components/{type}', [StockMovementController::class, 'getComponents']);


    Route::get('/stock-levels', [StockLevelController::class, 'index'])->name('stock-levels.index');
    Route::get('/stock-levels/{stockLevel}', [StockLevelController::class, 'show'])->name('stock-levels.show');

    Route::resource('servers', ServerController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
