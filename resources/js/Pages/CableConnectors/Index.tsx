import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { PlusIcon, ChevronUpIcon, ChevronDownIcon} from 'lucide-react';
import { can } from '@/helpers';

interface Brand {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Server {
    id: number;
    name: string;
}

interface CableConnector {
    id: number;
    name: string;
    type: string;
    length: number;
    specifications: string;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    cables: CableConnector[];
}

export default function Index({ cables }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof CableConnector; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce connecteur de câble ?")) {
            destroy(`/cable-connectors/${id}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Connecteur supprimé avec succès'),
                onError: () => toast.error('Erreur lors de la suppression'),
            });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key: keyof CableConnector) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredCables = cables.filter(cable =>
        cable.name.toLowerCase().includes(searchTerm) ||
        cable.brand.name.toLowerCase().includes(searchTerm) ||
        cable.type.toLowerCase().includes(searchTerm)
    );

    const sortedCables = [...filteredCables].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortConfig.direction === 'asc' 
            ? String(aValue).localeCompare(String(bValue)) 
            : String(bValue).localeCompare(String(aValue));
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCables.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedCables.length / itemsPerPage);

    const getSortIcon = (key: keyof CableConnector) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpIcon className="h-4 w-4 ml-1 opacity-50" />;
        return sortConfig.direction === 'asc' 
            ? <ChevronUpIcon className="h-4 w-4 ml-1" /> 
            : <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    return (
        <Layout>
            <div className="p-10 min-h-screen bg-white rounded-lg w-full">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Gestion des Connecteurs de Câble
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
                            {can(user, 'Add_Composants') && (
                                <Link
                                    href="/cable-connectors/create"
                                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 
                                       text-white rounded-lg shadow-sm whitespace-nowrap"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Ajouter Connecteur
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            { key: 'image', label: 'Image', sortable: false },
                                            { key: 'name', label: 'Nom', sortable: true },
                                            { key: 'brand', label: 'Marque', sortable: true },
                                            { key: 'price', label: 'Prix', sortable: true },
                                            { key: 'type', label: 'Type', sortable: true },
                                            { key: 'length', label: 'Longueur', sortable: true },
                                            { key: 'specifications', label: 'Spécifications', sortable: true },
                                            { key: 'servers', label: 'Serveurs', sortable: false },
                                        ].map((header) => (
                                            <th 
                                                key={header.key}
                                                className="px-4 py-2 text-left text-xs font-semibold text-gray-700"
                                                onClick={() => header.sortable && handleSort(header.key as keyof CableConnector)}
                                            >
                                                <div className="flex items-center group">
                                                    {header.label}
                                                    {header.sortable && (
                                                        <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            {getSortIcon(header.key as keyof CableConnector)}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        {(can(user, 'Delete_Composants') || can(user, 'Edit_Composants')) && (
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((cable) => (
                                        <tr key={cable.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2">
                                                {cable.image ? (
                                                    <img 
                                                        src={`/storage/${cable.image.url}`}
                                                        alt={cable.name}
                                                        className="w-8 h-8 object-cover rounded border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
                                                        <span className="text-[10px] text-gray-400">N/A</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{cable.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600">{cable.brand.name}</td>
                                            <td className="px-4 py-2 text-sm text-blue-600">{cable.price} DH</td>
                                            <td className="px-4 py-2 text-sm text-purple-600 uppercase">{cable.type}</td>
                                            <td className="px-4 py-2 text-sm text-gray-700">{cable.length} m</td>
                                            <td className="px-4 py-2 text-sm text-gray-600 max-w-[200px] truncate">{cable.specifications}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600">
                                                {cable.servers.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {cable.servers.map(server => (
                                                            <span 
                                                                key={server.id} 
                                                                className="px-2 py-0.5 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-100"
                                                            >
                                                                {server.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">
                                                    {can(user, 'Edit_Composants') && (
                                                        <Link
                                                            href={`/cable-connectors/${cable.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                    )}
                                                    {can(user, 'Delete_Composants') && (
                                                        <button
                                                            onClick={() => handleDelete(cable.id)}
                                                            className="text-red-600 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
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
                                {sortedCables.length} résultat{sortedCables.length > 1 && 's'} • Page {currentPage} sur {totalPages}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 
                                           disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-300"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 
                                           disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-300"
                                >
                                    →
                                </button>
                            </div>
                        </div>

                        {filteredCables.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-xs">
                                Aucun connecteur de câble trouvé
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}



// Ajouter les mêmes composants d'icônes SVG que dans l'exemple RAM
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}