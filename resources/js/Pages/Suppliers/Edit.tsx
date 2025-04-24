import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { can } from '@/helpers';

interface Supplier {
    id: number;
    name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
}

interface Props {
    supplier: Supplier;
}

export default function Edit({ supplier }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name,
        contact_name: supplier.contact_name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        city: supplier.city,
        country: supplier.country,
    });

    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/suppliers/${supplier.id}`, {
            onSuccess: () => toast.success('Fournisseur mis à jour avec succès'),
            onError: () => toast.error('Erreur lors de la mise à jour')
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white rounded-md">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier le Fournisseur</h1>
                    <p className="text-xs text-gray-600">Mettez à jour les informations du fournisseur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        {/* Section Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Nom du fournisseur
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Nom du contact
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_name}
                                    onChange={(e) => setData('contact_name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.contact_name && <p className="text-red-600 text-xs mt-1">{errors.contact_name}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Coordonnées */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Téléphone
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Adresse */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Adresse
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Localisation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Pays
                                </label>
                                <input
                                    type="text"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/suppliers"
                                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Edit_Suppliers') && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
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