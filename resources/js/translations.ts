
export const modelTranslations: Record<string, string> = {
    'AuditLog': 'Journal d\'audit',
    'AuthenticationLog': 'Journal d\'authentification',
    'Battery': 'Batterie',
    'Brand': 'Marque',
    'CableConnector': 'Connecteur de câble',
    'Chassis': 'Châssis',
    'CoolingSolution': 'Solution de refroidissement',
    'Customer': 'Client',
    'Discount': 'Remise',
    'ExpansionCard': 'Carte d\'extension',
    'FiberOpticCard': 'Carte fibre optique',
    'GraphicCard': 'Carte graphique',
    'HardDrive': 'Disque dur',
    'Image': 'Image',
    'Motherboard': 'Carte mère',
    'NetworkCard': 'Carte réseau',
    'PowerSupply': 'Alimentation',
    'Processor': 'Processeur',
    'RaidController': 'Contrôleur RAID',
    'Ram': 'RAM',
    'Server': 'Serveur',
    'StockLevel': 'Niveau de stock',
    'StockMovement': 'Mouvement de stock',
    'Supplier': 'Fournisseur',
    'User': 'Utilisateur'
};

export const translateModel = (model: string) => {
    const modelName = model.split('\\').pop() || model;
    return modelTranslations[modelName] || modelName;
};