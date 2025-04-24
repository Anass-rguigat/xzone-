<?php

namespace Database\Seeders;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Models\Customer;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles
        $userRole = Role::create(['name' => RolesEnum::User->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);
        $superadminRole = Role::create(['name' => RolesEnum::SuperAdmin->value]);

        // Create permissions based on PermissionsEnum
        $permissions = [];
        foreach (PermissionsEnum::cases() as $permission) {
            $permissions[] = Permission::create([
                'name' => $permission->value,
            ]);
        }



        $superadminRole->syncPermissions($permissions);

        // Create Users
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
        ])->assignRole(RolesEnum::Admin->value);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
        ])->assignRole(RolesEnum::SuperAdmin->value)->syncPermissions($permissions);

        

        $user = User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'phone' => '0606060606',
            'city' => 'Paris',
            'country' => 'France',
            'address' => '123 rue de la paix',
        ]);

        $user->assignRole(RolesEnum::User->value);


        Customer::create([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '0606060606',
            'address' => '123 rue de la paix',
            'city' => 'Paris',
            'country' => 'France',
            'hasCompte' => true,
        ]);
    }
}
