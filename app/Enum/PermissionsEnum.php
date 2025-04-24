<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case AddBrands = 'Add_Brands';
    case ListBrands = 'List_Brands';
    case DeleteBrands = 'Delete_Brands';
    case EditBrands = 'Edit_Brands';
    case ShowBrands = 'Show_Brands';

    case ListDashboard = 'List_Dashboard';

    case AddServers = 'Add_Servers';
    case ListServers = 'List_Servers';
    case DeleteServers = 'Delete_Servers';
    case EditServers = 'Edit_Servers';
    case ShowServers = 'Show_Servers';


    case AddComposants = 'Add_Composants';
    case ListComposants = 'List_Composants';
    case DeleteComposants = 'Delete_Composants';
    case EditComposants = 'Edit_Composants';
    case ShowComposants = 'Show_Composants';

    case AddDiscounts_Servers = 'Add_Discounts_Servers';
    case ListDiscounts_Servers = 'List_Discounts_Servers';
    case DeleteDiscounts_Servers = 'Delete_Discounts_Servers';
    case EditDiscounts_Servers = 'Edit_Discounts_Servers';
    case ShowDiscounts_Servers = 'Show_Discounts_Servers';


    case AddDiscounts_Composants = 'Add_Discounts_Composants';
    case ListDiscounts_Composants = 'List_Discounts_Composants';
    case DeleteDiscounts_Composants = 'Delete_Discounts_Composants';
    case EditDiscounts_Composants = 'Edit_Discounts_Composants';
    case ShowDiscounts_Composants = 'Show_Discounts_Composants';

    case AddSuppliers = 'Add_Suppliers';
    case ListSuppliers = 'List_Suppliers';
    case DeleteSuppliers = 'Delete_Suppliers';
    case EditSuppliers = 'Edit_Suppliers';
    case ShowSuppliers = 'Show_Suppliers';


    case AddStock_Mouvements = 'Add_Stock_Mouvements';
    case ListStock_Mouvements = 'List_Stock_Mouvements';
    case DeleteStock_Mouvements = 'Delete_Stock_Mouvements';
    case EditStock_Mouvements = 'Edit_Stock_Mouvements';
    case ShowStock_Mouvements = 'Show_Stock_Mouvements';

    case ListStock_Levels = 'List_Stock_Levels';
    case ShowStock_Levels = 'Show_Stock_Levels';

    case ManageUsers = 'manage_users';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return array_map(fn (self $case) => $case->label(), self::cases());
    }

    public function label(): string
    {
        return str_replace('_', ' ', $this->value);
    }
}
