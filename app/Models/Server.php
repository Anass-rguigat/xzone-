<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand_id',
        'price',
        'model',
        'cpu_socket',
        'ram_slots',
        'storage_slots',
        'power_supply_type',
        'rack_mountable',
        'form_factor'
    ];

    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'component');
    }

    public function stockLevel()
    {
        return $this->morphOne(StockLevel::class, 'component');
    }

    public function rams()
    {
        return $this->belongsToMany(Ram::class, 'servers_components');
    }

    public function batteries()
    {
        return $this->belongsToMany(Battery::class, 'servers_components');
    }

    public function cable_connectors()
    {
        return $this->belongsToMany(CableConnector::class, 'servers_components');
    }

    public function hardDrives()
    {
        return $this->belongsToMany(HardDrive::class, 'servers_components');
    }

    public function processors()
    {
        return $this->belongsToMany(Processor::class, 'servers_components');
    }

    public function powerSupplies()
    {
        return $this->belongsToMany(PowerSupply::class, 'servers_components');
    }

    public function motherboards()
    {
        return $this->belongsToMany(Motherboard::class, 'servers_components');
    }

    public function networkCards()
    {
        return $this->belongsToMany(NetworkCard::class, 'servers_components');
    }

    public function raidControllers()
    {
        return $this->belongsToMany(RaidController::class, 'servers_components');
    }

    public function coolingSolutions()
    {
        return $this->belongsToMany(CoolingSolution::class, 'servers_components');
    }

    public function chassis()
    {
        return $this->belongsToMany(Chassis::class, 'servers_components');
    }

    public function graphicCards()
    {
        return $this->belongsToMany(GraphicCard::class, 'servers_components');
    }

    public function fiberOpticCards()
    {
        return $this->belongsToMany(FiberOpticCard::class, 'servers_components');
    }

    public function expansionCards()
    {
        return $this->belongsToMany(ExpansionCard::class, 'servers_components');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class, 'discount_server');
    }
}
