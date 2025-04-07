import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
    });

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/suppliers', {
            onSuccess: () => toast.success('Fournisseur créé avec succès'),
            onError: () => toast.error('Erreur lors de la création')
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Ajouter un Nouveau Fournisseur</h1>
                    <p className="text-gray-600">Renseignez les informations du fournisseur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        {/* Section Informations de base */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Nom du fournisseur
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Nom du contact
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.contact_name && <p className="text-red-600 text-sm mt-1">{errors.contact_name}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Coordonnées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Téléphone
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Adresse */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                            </div>

                            <hr className="border-gray-200" />

                            {/* Localisation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Pays
                                    </label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Link
                                href="/suppliers"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement...' : 'Créer le Fournisseur'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}