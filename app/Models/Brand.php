<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = ['name'];

    public function rams()
    {
        return $this->hasMany(Ram::class);
    }

    public function cable_connectors()
    {
        return $this->hasMany(CableConnector::class);
    }

    public function batteries()
    {
        return $this->hasMany(Battery::class);
    }

    public function servers()
    {
        return $this->hasMany(Server::class);
    }

    public function hardDrives() {
        return $this->hasMany(HardDrive::class);
    }

    public function processors() {
        return $this->hasMany(Processor::class);
    }

    public function powerSupplies() {
        return $this->hasMany(PowerSupply::class);
    }

    public function motherboards() {
        return $this->hasMany(Motherboard::class);
    }

    public function networkCards() {
        return $this->hasMany(NetworkCard::class);
    }

    public function raidControllers() {
        return $this->hasMany(RaidController::class);
    }

    public function coolingSolutions() {
        return $this->hasMany(CoolingSolution::class);
    }

    public function chassis() {
        return $this->hasMany(Chassis::class);
    }

    public function graphicCards() {
        return $this->hasMany(GraphicCard::class);
    }

    public function fiberOpticCards() {
        return $this->hasMany(FiberOpticCard::class);
    }

    public function expansionCards() {
        return $this->hasMany(ExpansionCard::class);
    }
    
}
