<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockLevel extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['component_id', 'component_type', 'quantity'];

    public function component(): MorphTo
    {
        return $this->morphTo();
    }
}
