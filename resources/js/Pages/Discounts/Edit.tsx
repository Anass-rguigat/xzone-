import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { can } from '@/helpers';

interface Server {
    id: number;
    name: string;
}

interface Discount {
    id: number;
    name: string;
    discount_type: string;
    value: number;
    start_date: string;
    end_date: string;
}

interface Props {
    discount: Discount;
    servers: Server[];
    associatedServers: Server[];
    errors: Record<string, string>;
}

export default function EditDiscount({ discount, servers, associatedServers, errors: initialErrors }: Props) {
    const { data, setData, put, processing, errors, setError } = useForm({
        name: discount.name,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        server_ids: associatedServers.map((server) => server.id),
    });

    const { flash, errors: inertiaErrors, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        // Synchroniser les erreurs Inertia
        Object.entries(inertiaErrors).forEach(([key, value]) => {
            setError(key as keyof typeof data, value);
        });
    
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (inertiaErrors.server_ids) {
            toast.error(inertiaErrors.server_ids);
        }
    }, [flash, inertiaErrors]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('discounts.update', discount.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Discount mise à jour successfully'),
            onError: (errors) => {
                if (errors.server_ids) {
                    setData('server_ids', associatedServers.map(s => s.id)); // Réinitialiser la sélection
                }
            }
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier la Remise</h1>
                    <p className="text-xs text-gray-600">Mettez à jour les paramètres de la réduction</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Section Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Nom de la remise
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.name && 
                                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                }
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Type de remise
                                </label>
                                <select
                                    value={data.discount_type}
                                    onChange={(e) => setData('discount_type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="percentage">Pourcentage</option>
                                    <option value="fixed">Montant fixe</option>
                                </select>
                                {errors.discount_type && 
                                    <p className="text-red-600 text-xs mt-1">{errors.discount_type}</p>
                                }
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Valeur et Serveurs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Valeur ({data.discount_type === 'percentage' ? '%' : '€'})
                                </label>
                                <input
                                    type="number"
                                    value={data.value}
                                    onChange={(e) => setData('value', Number(e.target.value))}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    step={data.discount_type === 'percentage' ? 0.1 : 1}
                                />
                                {errors.value && 
                                    <p className="text-red-600 text-xs mt-1">{errors.value}</p>
                                }
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Serveurs associés
                                </label>
                                <select
                                    multiple
                                    value={data.server_ids}
                                    onChange={(e) => setData('server_ids', 
                                        Array.from(e.target.selectedOptions, option => Number(option.value))
                                    )}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
                                >
                                    {servers.map((server) => (
                                        <option key={server.id} value={server.id}>
                                            {server.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs text-gray-500">
                                    Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélectionner plusieurs
                                </p>
                                {errors.server_ids && 
                                    <p className="text-red-600 text-xs mt-1">{errors.server_ids}</p>
                                }
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.start_date && 
                                    <p className="text-red-600 text-xs mt-1">{errors.start_date}</p>
                                }
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.end_date && 
                                    <p className="text-red-600 text-xs mt-1">{errors.end_date}</p>
                                }
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 w-full">
                            <Link
                                href="/discounts"
                                className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Modifier_Remises_Serveurs') && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
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