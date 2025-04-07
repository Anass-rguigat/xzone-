import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';

interface Brand {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
}

export default function Index({ brands }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const filteredBrands = brands.filter((brand) =>
        brand.name.includes(searchTerm)
    );

    const handleDelete = (id: number) => {
            destroy(`/brands/${id}`, {
                onSuccess: () => toast.success('Marque supprimée avec succès'),
                onError: () => toast.error('Erreur lors de la suppression')
            });
    };

    return (
        <Layout>
            <div className="p-6 max-w-screen-xl mx-auto">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Gestion des Marques</h1>
                                <p className="text-gray-600 mt-1">Liste des marques enregistrées</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4 gap-4">
                            <Link
                                href="/brands/create"
                                className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 
                                       focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Ajouter une Marque
                            </Link>
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Rechercher des marques..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <SearchIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {filteredBrands.map((brand) => (
                                <div key={brand.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{brand.name}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/brands/${brand.id}/edit`}
                                                className="text-blue-600 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(brand.id)}
                                                className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredBrands.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                Aucune marque trouvée
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Icônes SVG
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    )
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    )
}