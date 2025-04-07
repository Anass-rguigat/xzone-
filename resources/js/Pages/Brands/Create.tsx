import React, { useState, FormEvent, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Layout } from '@/Layouts/layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

interface Props {
  brands: { id: number; name: string }[];
}

const Create: React.FC<Props> = ({ brands = [] }) => {  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    brand_id: '',
  });

  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/brands', {
      onSuccess: () => toast.success('Marque créée avec succès'),
      onError: () => toast.error('Erreur lors de la création')
    });
  };

  return (
    <Layout>
    <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Ajouter une Nouvelle Marque</h1>
            <p className="text-gray-600">Configurez les informations de la marque</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="space-y-4">
                    {/* Section Nom */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Nom de la marque
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <hr className="border-gray-200" />

                    {/* Section Marque parente */}
                    {brands.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Marque parente
                                </label>
                                <select
                                    value={data.brand_id}
                                    onChange={(e) => setData('brand_id', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner une marque</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brand_id && <p className="text-red-600 text-sm mt-1">{errors.brand_id}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6">
                    <Link
                        href="/brands"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                        {processing ? 'Enregistrement...' : 'Créer la Marque'}
                    </button>
                </div>
            </div>
        </form>
    </div>
</Layout>
);
}
export default Create;