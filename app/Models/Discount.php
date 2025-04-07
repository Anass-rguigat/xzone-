<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'discount_type', 'value', 'start_date', 'end_date'];

    public function servers()
    {
        return $this->belongsToMany(Server::class, 'discount_server');
    }

    public function rams()
    {
        return $this->belongsToMany(Ram::class, 'discount_component');
    }

    public function batteries()
    {
        return $this->belongsToMany(Battery::class, 'discount_component');
    }

    public function cable_connectors()
    {
        return $this->belongsToMany(CableConnector::class, 'discount_component');
    }

    public function hardDrives()
    {
        return $this->belongsToMany(HardDrive::class, 'discount_component');
    }

    public function processors()
    {
        return $this->belongsToMany(Processor::class, 'discount_component');
    }

    public function powerSupplies()
    {
        return $this->belongsToMany(PowerSupply::class, 'discount_component');
    }

    public function motherboards()
    {
        return $this->belongsToMany(Motherboard::class, 'discount_component');
    }

    public function networkCards()
    {
        return $this->belongsToMany(NetworkCard::class, 'discount_component');
    }

    public function raidControllers()
    {
        return $this->belongsToMany(RaidController::class, 'discount_component');
    }

    public function coolingSolutions()
    {
        return $this->belongsToMany(CoolingSolution::class, 'discount_component');
    }

    public function chassis()
    {
        return $this->belongsToMany(Chassis::class, 'discount_component');
    }

    public function graphicCards()
    {
        return $this->belongsToMany(GraphicCard::class, 'discount_component');
    }

    public function fiberOpticCards()
    {
        return $this->belongsToMany(FiberOpticCard::class, 'discount_component');
    }

    public function expansionCards()
    {
        return $this->belongsToMany(ExpansionCard::class, 'discount_component');
    }
}
