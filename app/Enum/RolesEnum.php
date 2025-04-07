<?php

namespace App\Enum;

enum RolesEnum: string
{
    case SuperAdmin = 'super_admin';

    case Admin = 'admin';

    case User = 'user';

    public static function labels(): array
    {
        return [
            self::SuperAdmin->value => 'SuperAdmin',
            self::Admin->value => 'Admin',
            self::User->value => 'User',
        ];
    }

    public function label()
    {
        return match($this){
            self::SuperAdmin => 'SuperAdmin',
            self::Admin => 'Admin',
            self::User => 'User',
        };
    }
}
