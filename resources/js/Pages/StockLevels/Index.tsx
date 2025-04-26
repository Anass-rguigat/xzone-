import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';

interface Component {
    id: number;
    name: string;
}

interface StockLevel {
    id: number;
    component: Component | null;
    component_type: string;
    quantity: number;
}

interface Props {
    stockLevels: StockLevel[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ stockLevels, pagination }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof StockLevel; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { flash, auth } = usePage().props;
    const user = auth.user;


    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key: keyof StockLevel) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredStockLevels = stockLevels.filter(stockLevel =>
        stockLevel.component_type.toLowerCase().includes(searchTerm) ||
        stockLevel.component?.name.toLowerCase().includes(searchTerm)
    );

    const sortedStockLevels = [...filteredStockLevels].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'quantity') {
            return sortConfig.direction === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
        }

        return sortConfig.direction === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedStockLevels.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedStockLevels.length / itemsPerPage);

    const getSortIcon = (key: keyof StockLevel) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpIcon className="h-4 w-4 ml-1 opacity-50" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUpIcon className="h-4 w-4 ml-1" />
            : <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    return (
        <Layout>
            <div className="p-10 min-h-screen bg-white rounded-xl w-full">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Niveaux de Stock
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
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            { key: 'component_type', label: 'Type', sortable: true },
                                            { key: 'component', label: 'Composant', sortable: true },
                                            { key: 'quantity', label: 'Quantité', sortable: true },
                                        ].map((header) => (
                                            <th
                                                key={header.key}
                                                className="px-4 py-2 text-left text-xs font-semibold text-gray-700"
                                                onClick={() => header.sortable && handleSort(header.key as keyof StockLevel)}
                                            >
                                                <div className="flex items-center group">
                                                    {header.label}
                                                    {header.sortable && (
                                                        <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            {getSortIcon(header.key as keyof StockLevel)}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((stockLevel) => (
                                        <tr key={stockLevel.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 text-sm text-gray-900">
                                                {stockLevel.component_type.split('\\').pop()}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-600">
                                                {stockLevel.component?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-blue-600">
                                                {stockLevel.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row justify-between items-center p-3 border-t border-gray-200 text-xs">
                            <div className="mb-2 sm:mb-0 text-gray-600">
                                {sortedStockLevels.length} résultat{sortedStockLevels.length > 1 && 's'} • Page {currentPage} sur {totalPages}
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

                        {filteredStockLevels.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-xs">
                                Aucun niveau de stock trouvé
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
