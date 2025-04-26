<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    // Marques
    case AddBrands = 'Ajouter_Marques';
    case ListBrands = 'Lister_Marques';
    case DeleteBrands = 'Supprimer_Marques';
    case EditBrands = 'Modifier_Marques';
    case ShowBrands = 'Voir_Marques';

    // Tableau de bord
    case ListDashboard = 'Lister_Tableau_de_bord';

    // Serveurs
    case AddServers = 'Ajouter_Serveurs';
    case ListServers = 'Lister_Serveurs';
    case DeleteServers = 'Supprimer_Serveurs';
    case EditServers = 'Modifier_Serveurs';
    case ShowServers = 'Voir_Serveurs';

    // Composants
    case AddComposants = 'Ajouter_Composants';
    case ListComposants = 'Lister_Composants';
    case DeleteComposants = 'Supprimer_Composants';
    case EditComposants = 'Modifier_Composants';
    case ShowComposants = 'Voir_Composants';

    // Remises sur serveurs
    case AddDiscounts_Servers = 'Ajouter_Remises_Serveurs';
    case ListDiscounts_Servers = 'Lister_Remises_Serveurs';
    case DeleteDiscounts_Servers = 'Supprimer_Remises_Serveurs';
    case EditDiscounts_Servers = 'Modifier_Remises_Serveurs';
    case ShowDiscounts_Servers = 'Voir_Remises_Serveurs';

    // Remises sur composants
    case AddDiscounts_Composants = 'Ajouter_Remises_Composants';
    case ListDiscounts_Composants = 'Lister_Remises_Composants';
    case DeleteDiscounts_Composants = 'Supprimer_Remises_Composants';
    case EditDiscounts_Composants = 'Modifier_Remises_Composants';
    case ShowDiscounts_Composants = 'Voir_Remises_Composants';

    // Fournisseurs
    case AddSuppliers = 'Ajouter_Fournisseurs';
    case ListSuppliers = 'Lister_Fournisseurs';
    case DeleteSuppliers = 'Supprimer_Fournisseurs';
    case EditSuppliers = 'Modifier_Fournisseurs';
    case ShowSuppliers = 'Voir_Fournisseurs';

    // Mouvements de stock
    case AddStock_Mouvements = 'Ajouter_Mouvements_Stock';
    case ListStock_Mouvements = 'Lister_Mouvements_Stock';
    case DeleteStock_Mouvements = 'Supprimer_Mouvements_Stock';
    case EditStock_Mouvements = 'Modifier_Mouvements_Stock';
    case ShowStock_Mouvements = 'Voir_Mouvements_Stock';

    // Niveaux de stock
    case ListStock_Levels = 'Lister_Niveaux_Stock';
    case ShowStock_Levels = 'Voir_Niveaux_Stock';

    // Audits
    case Affiche_Connexions_Audits = 'Voir_Audits_Connexion';
    case Affiche_logs_Audits = 'Voir_Logs_Audit';

    // Utilisateurs
    case ManageUsers = 'Gerer_Utilisateurs';

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