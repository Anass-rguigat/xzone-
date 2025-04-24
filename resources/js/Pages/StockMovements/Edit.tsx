import { useEffect, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { can } from '@/helpers';

interface ComponentItem {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface StockMovement {
    id: number;
    component_id: number;
    component_type: string;
    quantity: number;
    movement_type: 'in' | 'out';
    supplier_id: number | null;
    date: string;
}

interface Props {
    movement: StockMovement;
    suppliers: Supplier[];
    componentTypes: {
        [key: string]: string;
    };
    components: ComponentItem[];
    selectedComponentType: string;
    selectedComponent: ComponentItem | null;
}

export default function Edit({ movement, suppliers, componentTypes, components, selectedComponentType }: Props) {
    const [selectedType, setSelectedType] = useState(selectedComponentType);
    const [isLoadingComponents, setIsLoadingComponents] = useState(false);
    const [availableComponents, setAvailableComponents] = useState(components);
    const { auth } = usePage().props;
    const user = auth.user;


    const { data, setData, put, processing, errors } = useForm({
        component_id: movement.component_id,
        component_type: movement.component_type,
        quantity: movement.quantity,
        movement_type: movement.movement_type,
        supplier_id: movement.supplier_id ?? '',
        date: movement.date,
    });

    const { flash, errors: pageErrors } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        
        if (flash?.error) {
            toast.error(flash.error);
        }
    
        if (Object.keys(pageErrors).length > 0) {
            Object.entries(pageErrors).forEach(([field, message]) => {
                toast.error(`${field}: ${message}`);
            });
        }
    }, [flash, pageErrors]);

    useEffect(() => {
        if (selectedType) {
            setIsLoadingComponents(true);
            fetch(`/get-components/${selectedType}`)
                .then((res) => res.json())
                .then((data) => {
                    setAvailableComponents(data);
                    setIsLoadingComponents(false);
                })
                .catch(() => {
                    setAvailableComponents([]);
                    setIsLoadingComponents(false);
                });
        }
    }, [selectedType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/stock-movements/${movement.id}`, {
            preserveScroll: true,
             onSuccess: () => toast.success('Mouvement mise à jour avec succès!'),
        onError: (errors) => {
            // Gestion spécifique des erreurs de stock
            if (errors.quantity?.includes('Stock insuffisant')) {
                toast.error(errors.quantity);
            }
        }

        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier le Mouvement de Stock</h1>
                    <p className="text-xs text-gray-600">Mettez à jour les détails du mouvement</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Type de composant et composant */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Type de Composant *
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        setSelectedType(newType);
                                        setData('component_type', componentTypes[newType]);
                                    }}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {Object.keys(componentTypes).map((typeKey) => (
                                        <option key={typeKey} value={typeKey}>
                                            {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {errors.component_type && <p className="text-red-600 text-xs mt-1">{errors.component_type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Composant *
                                </label>
                                <select
                                    value={data.component_id}
                                    onChange={(e) => setData('component_id', Number(e.target.value))}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">{isLoadingComponents ? 'Chargement...' : 'Sélectionner un composant'}</option>
                                    {availableComponents.map((component) => (
                                        <option key={component.id} value={component.id}>
                                            {component.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.component_id && <p className="text-red-600 text-xs mt-1">{errors.component_id}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Quantité et Type de mouvement */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Quantité *
                                </label>
                                <input
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', Number(e.target.value))}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Type de Mouvement *
                                </label>
                                <select
                                    value={data.movement_type}
                                    onChange={(e) => setData('movement_type', e.target.value as 'in' | 'out')}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="in">Entrée</option>
                                    <option value="out">Sortie</option>
                                </select>
                                {errors.movement_type && <p className="text-red-600 text-xs mt-1">{errors.movement_type}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Fournisseur et Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Fournisseur
                                </label>
                                <select
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', Number(e.target.value))}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner un fournisseur</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && <p className="text-red-600 text-xs mt-1">{errors.supplier_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 w-full">
                            <Link
                                href="/stock-movements"
                                className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Edit_Stock_Mouvements') && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : 'Mettre à jour'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}