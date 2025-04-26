import { Layout } from '@/Layouts/layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { can } from '@/helpers';
interface Server {
    id: number;
    name: string;
}

interface Props {
    servers: Server[];
    errors: Record<string, string>; 
}

export default function CreateDiscount({ servers, errors: initialErrors }: Props) {
    const { data, setData, post, processing, errors, setError } = useForm({
        name: '',
        discount_type: 'percentage',
        value: 0,
        start_date: '',
        end_date: '',
        server_id: ''
    });
    
    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        Object.entries(initialErrors).forEach(([key, value]) => {
            setError(key as keyof typeof data, value);
        });

        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash, initialErrors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('discounts.store'), {
            onError: (errors) => {
                Object.entries(errors).forEach(([key, value]) => {
                    if (!Object.keys(data).includes(key)) {
                        toast.error(value);
                    }
                });
            }
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Créer une Nouvelle Remise</h1>
                    <p className="text-xs text-gray-600">Configurez les paramètres de la remise et ses règles d'application</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Valeur
                                </label>
                                <input
                                    type="number"
                                    value={data.value}
                                    onChange={(e) => setData('value', Number(e.target.value))}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.value && 
                                    <p className="text-red-600 text-xs mt-1">{errors.value}</p>
                                }
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Serveur concerné
                                </label>
                                <select
                                    value={data.server_id}
                                    onChange={(e) => setData('server_id', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner un serveur</option>
                                    {servers.map((server) => (
                                        <option key={server.id} value={server.id}>
                                            {server.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.server_id && 
                                    <p className="text-red-600 text-xs mt-1">{errors.server_id}</p>
                                }
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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

                        <div className="flex justify-end gap-3 pt-4 w-full">
                            <Link
                                href="/discounts"
                                className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Ajouter_Remises_Serveurs') && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : 'Créer la Remise'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}