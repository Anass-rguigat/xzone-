import { Layout } from '@/Layouts/layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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

interface Props {
    suppliers: Supplier[];
    componentTypes: {
        [key: string]: string;
    };
}

export default function Create({ suppliers, componentTypes }: Props) {
    const [components, setComponents] = useState<ComponentItem[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [isLoadingComponents, setIsLoadingComponents] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        component_id: '',
        component_type: '',
        quantity: '',
        movement_type: 'in' as 'in' | 'out',
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
    });

    const { flash, errors: inertiaErrors } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (inertiaErrors.stock) toast.error(inertiaErrors.stock);
    }, [flash, inertiaErrors]);

    useEffect(() => {
        if (selectedType) {
            setIsLoadingComponents(true);
            fetch(`/get-components/${selectedType}`)
                .then(res => res.json())
                .then(data => {
                    setComponents(data);
                    setIsLoadingComponents(false);
                })
                .catch(() => {
                    setComponents([]);
                    setIsLoadingComponents(false);
                });
        }
    }, [selectedType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-movements', {
            preserveScroll: true,
            onSuccess: () => toast.success('Mouvement créée avec succès!'),
            onError: (errors) => {
                if (errors.stock) {
                    toast.error(errors.stock);
                }
            }
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Nouveau Mouvement de Stock</h1>
                    <p className="text-xs text-gray-600">Gérez les entrées et sorties de composants informatiques</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Type et Composant */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Type de Composant *
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => {
                                        setSelectedType(e.target.value);
                                        setData('component_type', componentTypes[e.target.value]);
                                    }}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner un type</option>
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
                                    onChange={(e) => setData('component_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled={!selectedType || isLoadingComponents}
                                >
                                    <option value="">
                                        {isLoadingComponents ? 'Chargement...' : 'Sélectionner un composant'}
                                    </option>
                                    {components.map((component) => (
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
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    min="1"
                                    required
                                />
                                {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Type de Mouvement *
                                </label>
                                <div className="flex gap-3 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="in"
                                            checked={data.movement_type === 'in'}
                                            onChange={() => setData('movement_type', 'in')}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Entrée</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            value="out"
                                            checked={data.movement_type === 'out'}
                                            onChange={() => setData('movement_type', 'out')}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Sortie</span>
                                    </label>
                                </div>
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
                                    onChange={(e) => setData('supplier_id', e.target.value)}
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
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 w-full">
                        <Link
                            href="/stock-movements"
                            className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Annuler
                        </Link>
                        {can(user, 'Ajouter_Mouvements_Stock') && (
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement...' : 'Créer le Mouvement'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Layout>
    );
}