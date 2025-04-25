<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $fillable = [
        'user_id',
        'event',
        'auditable_type',
        'auditable_id',
        'url',
        'ip_address',
        'user_agent',
        'old_values',
        'new_values'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d\TH:i:s', // ISO 8601 format
        'updated_at' => 'datetime:Y-m-d\TH:i:s',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function auditable()
    {
        return $this->morphTo();
    }

    // Ensure proper decoding of JSON even if double-encoded
    public function getOldValuesAttribute($value)
    {
        $decoded = json_decode($value, true);
        if (is_string($decoded)) {
            return json_decode($decoded, true);
        }
        return $decoded;
    }

    public function getNewValuesAttribute($value)
    {
        $decoded = json_decode($value, true);
        if (is_string($decoded)) {
            return json_decode($decoded, true);
        }
        return $decoded;
    }
}
