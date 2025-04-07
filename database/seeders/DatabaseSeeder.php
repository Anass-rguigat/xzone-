<?php

namespace Database\Seeders;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
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

        $userRole = Role::create(['name'=>RolesEnum::User->value]);
        $adminRole = Role::create(['name'=>RolesEnum::Admin->value]);
        $superadminRole = Role::create(['name'=>RolesEnum::SuperAdmin->value]);
        
        $ManageBrandsPermission = Permission::create([
            'name' => PermissionsEnum::ManageBrands->value,
        ]);

        $ManageServersPermission = Permission::create([
            'name' => PermissionsEnum::ManageServers->value,
        ]);

        $ManageComposantsPermission = Permission::create([
            'name' => PermissionsEnum::ManageComposants->value,
        ]);

        $ManageUsersPermission = Permission::create([
            'name' => PermissionsEnum::ManageUsers->value,
        ]);

        $adminRole->syncPermissions([
            $ManageComposantsPermission,
            $ManageServersPermission,
            $ManageBrandsPermission
        ]);

        $superadminRole->syncPermissions([
            $ManageComposantsPermission,
            $ManageServersPermission,
            $ManageBrandsPermission,
            $ManageUsersPermission
        ]);

        //$userRole->syncPermissions([
        //    $ManageComposantsPermission,
        //   $ManageServersPermission,
        //    $ManageBrandsPermission
        //]);
        

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',

        ])->assignRole(RolesEnum::Admin);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',

        ])->assignRole(RolesEnum::SuperAdmin);

        User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',

        ])->assignRole(RolesEnum::User);
    }
}
