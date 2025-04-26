import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { can } from '@/helpers';

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { flash } = usePage().props;
    usePage().props.auth.user
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = (id: number) => {
        destroy(`/brands/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Marque supprimée avec succès'),
            onError: () => toast.error('Erreur lors de la suppression'),
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    const { auth } = usePage().props;
    const user = auth.user;
    return (
        <Layout>
            <div className="p-10 min-h-screen bg-white rounded-xl text-sm leading-tight w-full">
                <div className="w-full">
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Gestion des Marques
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto flex-1">
                                <input
                                    type="text"
                                    className="w-full pl-3 pr-9 py-1.5 border border-gray-300 rounded-lg text-sm 
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
                                        placeholder-gray-400 bg-white"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <SearchIcon className="h-4 w-4 absolute right-2 top-2.5 text-gray-400" />
                            </div>

                            {can(user, 'Ajouter_Marques') && <Link
                                href="/brands/create"
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 
                                    text-white rounded-lg shadow-sm"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Ajouter
                            </Link>}
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm w-full">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Nom</th>
                                        {(can(user, 'Supprimer_Marques') || can(user, 'Modifier_Marques')) && (
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((brand) => (
                                        <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 text-xs text-gray-900">{brand.name}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">
                                                    {can(user, 'Modifier_Marques') && <Link
                                                        href={`/brands/${brand.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-700 transition p-1 hover:bg-blue-50 rounded"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Link>}
                                                    {can(user, 'Supprimer_Marques') &&
                                                        <button
                                                            onClick={() => handleDelete(brand.id)}
                                                            className="text-red-600 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row justify-between items-center p-3 border-t border-gray-200 text-xs">
                            <div className="mb-2 sm:mb-0 text-gray-600">
                                {filteredBrands.length} résultat{filteredBrands.length > 1 && 's'} • Page {currentPage} sur {totalPages}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-2 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        {filteredBrands.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-xs">
                                Aucune marque trouvée
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}
