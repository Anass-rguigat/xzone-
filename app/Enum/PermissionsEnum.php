<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case ManageBrands = 'manage_brands';

    case ManageServers = 'manage_Servers';

    case ManageComposants = 'manage_Composants';

    case ManageUsers = 'manage_users';
}
