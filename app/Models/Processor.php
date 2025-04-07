<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Processor extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'name',
        'model',
        'price',
        'core_count',
        'thread_count',
        'base_clock',
        'boost_clock',
        'socket',
        'thermal_design_power',
    ];

    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'component');
    }

    public function stockLevel()
    {
        return $this->morphOne(StockLevel::class, 'component');
    }


    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function servers()
    {
        return $this->belongsToMany(Server::class, 'servers_components');
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class, 'discount_component');
    }
}
