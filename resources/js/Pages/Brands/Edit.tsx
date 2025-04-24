import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { can } from '@/helpers';

interface Brand {
    id: number;
    name: string;
}

interface Props {
    brand: Brand;
}

export default function Edit({ brand }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: brand.name,
        _method: 'PUT',
    });

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/brands/${brand.id}`, {
            onSuccess: () => toast.success('Marque mise à jour avec succès'),
            onError: () => toast.error('Erreur lors de la mise à jour')
        });
    };
    const { auth } = usePage().props;
    const user = auth.user;
    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    
                    <h1 className="text-lg font-semibold text-gray-900">Modifier la Marque</h1>
                    <p className="text-xs text-gray-600">Mettez à jour les informations de la marque</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Section Nom */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Nom de la marque
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                placeholder="Entrez le nom de la marque"
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-sm"
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <hr className="border-gray-200" />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 w-full">
                        <Link
                            href="/brands"
                            className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Annuler
                        </Link>
                        {can(user, 'Edit_Brands') &&
                        <button
                            type="submit"
                            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
                        >
                            {progress ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>}
                    </div>
                </form>
            </div>
        </Layout>
    );
}
