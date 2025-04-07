import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

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

interface ExpansionCard {
    id: number;
    name: string;
    type: string;
    interface_type: string;
    speed: number;
    power_rating: number;
    price: number;
    brand: Brand;
    image?: Image;
    servers: Server[];
}

interface Props {
    expansionCards: ExpansionCard[];
}

export default function Index({ expansionCards }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof ExpansionCard; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette carte d'extension ?")) {
            destroy(`/expansion-cards/${id}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Carte supprimée avec succès'),
                onError: () => toast.error('Erreur lors de la suppression'),
            });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key: keyof ExpansionCard) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredCards = expansionCards.filter(card =>
        card.name.toLowerCase().includes(searchTerm) ||
        card.brand.name.toLowerCase().includes(searchTerm) ||
        card.type.toLowerCase().includes(searchTerm)
    );

    const sortedCards = [...filteredCards].sort((a, b) => {
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
    const currentItems = sortedCards.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedCards.length / itemsPerPage);

    const getSortIcon = (key: keyof ExpansionCard) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpIcon className="h-4 w-4 ml-1 opacity-50" />;
        return sortConfig.direction === 'asc' 
            ? <ChevronUpIcon className="h-4 w-4 ml-1" /> 
            : <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    return (
        <Layout>
            <div className="p-6 min-h-screen bg-white rounded-2xl">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des Cartes d'Extension</h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1 max-w-xs">
                                <input
                                    type="text"
                                    className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl text-gray-700 
                                               focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                               placeholder-gray-400 transition-all bg-white"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <SearchIcon className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
                            </div>
                            <Link
                                href="/expansion-cards/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
                                       transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Ajouter Carte
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            { key: 'image', label: 'Image', sortable: false },
                                            { key: 'name', label: 'Nom', sortable: true },
                                            { key: 'brand', label: 'Marque', sortable: true },
                                            { key: 'servers', label: 'Serveurs', sortable: false },
                                            { key: 'price', label: 'Prix', sortable: true },
                                            { key: 'actions', label: 'Actions', sortable: false }
                                        ].map((header) => (
                                            <th 
                                                key={header.key}
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                                                onClick={() => header.sortable && handleSort(header.key as keyof ExpansionCard)}
                                            >
                                                <div className="flex items-center group">
                                                    {header.label}
                                                    {header.sortable && (
                                                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {getSortIcon(header.key as keyof ExpansionCard)}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((card) => (
                                        <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                {card.image ? (
                                                    <img 
                                                        src={`/storage/${card.image.url}`}
                                                        alt={card.name}
                                                        className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">N/A</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{card.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{card.brand.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {card.servers.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                        {card.servers.map(server => (
                                                            <span 
                                                                key={server.id} 
                                                                className="px-2.5 py-1 bg-blue-50 rounded-2xl text-xs text-blue-700 border border-blue-100"
                                                            >
                                                                {server.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-blue-600 font-medium">{card.price} DH</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <Link
                                                        href={`/expansion-cards/${card.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-700 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(card.id)}
                                                        className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                    <Link
                                                        href={`/expansion-cards/${card.id}`}
                                                        className="text-green-600 hover:text-green-700 transition-colors p-1.5 hover:bg-green-50 rounded-lg"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
                            <div className="mb-4 sm:mb-0 text-sm text-gray-600">
                                {sortedCards.length} résultat{sortedCards.length > 1 && 's'} • Page {currentPage} sur {totalPages}
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3.5 py-1.5 rounded-2xl text-gray-700 hover:bg-gray-100 
                                               disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-300"
                                    >
                                        ← Précédent
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3.5 py-1.5 rounded-2xl text-gray-700 hover:bg-gray-100 
                                               disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-300"
                                    >
                                        Suivant →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {filteredCards.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                Aucune carte d'extension trouvée
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

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}