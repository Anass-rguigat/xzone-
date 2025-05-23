<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'contact_name', 'email', 'phone', 'address', 'city', 'country'
    ];

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
