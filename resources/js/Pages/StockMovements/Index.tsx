import { Layout } from '@/Layouts/Layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

interface Component {
    id: number;
    name: string;
    type: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface StockMovement {
    id: number;
    quantity: number;
    movement_type: 'in' | 'out';
    date: string;
    component: Component;
    supplier?: Supplier;
}

interface Props {
    movements: {
        data: StockMovement[];
        links: any[];
    };
    suppliers: Supplier[];
}

export default function Index({ movements, suppliers }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof StockMovement; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = (id: number) => {
            destroy(`/stock-movements/${id}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Mouvement supprimé avec succès'),
                onError: () => toast.error('Erreur lors de la suppression')
            });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key: keyof StockMovement) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredMovements = movements.data.filter(movement =>
        movement.component.name.toLowerCase().includes(searchTerm) ||
        movement.supplier?.name?.toLowerCase().includes(searchTerm)
    );

    const sortedMovements = [...filteredMovements].sort((a, b) => {
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
    const currentItems = sortedMovements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedMovements.length / itemsPerPage);

    const getSortIcon = (key: keyof StockMovement) => {
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
                        <h1 className="text-2xl font-bold text-gray-900">
                            Gestion des Mouvements de Stock
                        </h1>
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
                                href="/stock-movements/create"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl 
                                       transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Nouveau Mouvement
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            { key: 'component', label: 'Composant', sortable: true },
                                            { key: 'quantity', label: 'Quantité', sortable: true },
                                            { key: 'movement_type', label: 'Type', sortable: true },
                                            { key: 'supplier', label: 'Fournisseur', sortable: true },
                                            { key: 'date', label: 'Date', sortable: true },
                                            { key: 'actions', label: 'Actions', sortable: false }
                                        ].map((header) => (
                                            <th 
                                                key={header.key}
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                                                onClick={() => header.sortable && handleSort(header.key as keyof StockMovement)}
                                            >
                                                <div className="flex items-center group">
                                                    {header.label}
                                                    {header.sortable && (
                                                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {getSortIcon(header.key as keyof StockMovement)}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {movement.component.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{movement.quantity}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-2xl text-xs font-medium ${
                                                    movement.movement_type === 'in' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {movement.movement_type === 'in' ? 'Entrée' : 'Sortie'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {movement.supplier?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(movement.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-3">
                                                    <Link
                                                        href={`/stock-movements/${movement.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-700 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(movement.id)}
                                                        className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
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
                                {sortedMovements.length} résultat{sortedMovements.length > 1 && 's'} • Page {currentPage} sur {totalPages}
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

                        {filteredMovements.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                Aucun mouvement trouvé
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