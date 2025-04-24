import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { can } from '@/helpers';
import { PencilIcon, ChevronLeftIcon } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    hasCompte: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white rounded-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                        <h1 className="text-lg font-semibold text-gray-900">{customer.name}</h1>
                        <p className="text-xs text-gray-600">Fiche client créée le {new Date(customer.created_at).toLocaleDateString()}</p>
                    </div>
                    
                </div>

                <div className="space-y-4">
                    {/* Section Informations de base */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-500">
                                    Nom complet
                                </label>
                                <p className="text-sm text-gray-900">{customer.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-500">
                                    Email
                                </label>
                                <p className="text-sm text-gray-900">{customer.email}</p>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Coordonnées */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-500">
                                    Téléphone
                                </label>
                                <p className="text-sm text-gray-900">{customer.phone}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-500">
                                    Statut du compte
                                </label>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    customer.hasCompte 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                    {customer.hasCompte ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Adresse */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-500">
                                Adresse postale
                            </label>
                            <p className="text-sm text-gray-900">{customer.address}</p>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Localisation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-500">
                                    Ville
                                </label>
                                <p className="text-sm text-gray-900">{customer.city}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-500">
                                    Pays
                                </label>
                                <p className="text-sm text-gray-900">{customer.country}</p>
                            </div>
                        </div>

                        {/* Métadonnées */}
                        <hr className="border-gray-200" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <label className="block text-xs font-medium text-gray-500">
                                    Dernière mise à jour
                                </label>
                                <p className="text-gray-600">
                                    {new Date(customer.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">
                                    ID Client
                                </label>
                                <p className="font-mono text-gray-600">#{customer.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Link
                            href="/customers"
                            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            ← Retour
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}