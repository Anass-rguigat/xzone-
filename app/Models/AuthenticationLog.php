<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthenticationLog extends Model
{
    protected $fillable = [
        'user_id',
        'email', 
        'ip_address',
        'mac_address',
        'success',
        'user_agent'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
