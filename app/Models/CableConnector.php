<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class CableConnector extends Model
{
    protected $fillable = [
        'name',
        'type',
        'length',
        'specifications',
        'price',
        'brand_id',
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
