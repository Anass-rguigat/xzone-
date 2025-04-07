<?php

namespace App\Http\Controllers;

use App\Models\StockLevel;
use Inertia\Inertia;
use Inertia\Response;

class StockLevelController extends Controller
{
    public function index()
    {
        $stockLevels = StockLevel::with('component')->paginate(10);

        return Inertia::render('StockLevels/Index', [
            'stockLevels' => $stockLevels->items(),
            'pagination' => [
                'total' => $stockLevels->total(),
                'per_page' => $stockLevels->perPage(),
                'current_page' => $stockLevels->currentPage(),
                'last_page' => $stockLevels->lastPage(),
            ],
        ]);
    }

    public function show(StockLevel $stockLevel)
    {
        return Inertia::render('StockLevels/Show', [
            'stockLevel' => $stockLevel->load('component'),
        ]);
    }
}
