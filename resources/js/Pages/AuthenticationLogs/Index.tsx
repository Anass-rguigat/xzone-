import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { ChevronUpIcon, ChevronDownIcon, SearchIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthenticationLog {
    id: number;
    user_id: number | null;
    email: string;
    ip_address: string;
    mac_address: string;
    success: boolean;
    user_agent: string;
    created_at: string;
    user?: User;
}

interface Props {
    logs: AuthenticationLog[];
}

export default function Index({ logs }: Props) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof AuthenticationLog; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const parseUserAgent = (userAgent: string) => {
        const parser = new UAParser(userAgent);
        return {
            browser: parser.getBrowser(),
            os: parser.getOS(),
            device: parser.getDevice()
        };
    };



    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key: keyof AuthenticationLog) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredLogs = logs.filter(log =>
        log.email.toLowerCase().includes(searchTerm) ||
        log.ip_address.toLowerCase().includes(searchTerm) ||
        log.mac_address.toLowerCase().includes(searchTerm)
    );

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === 'created_at') {
            return sortConfig.direction === 'asc'
                ? new Date(aValue).getTime() - new Date(bValue).getTime()
                : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        return sortConfig.direction === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

    const getSortIcon = (key: keyof AuthenticationLog) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpIcon className="h-4 w-4 ml-1 opacity-50" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUpIcon className="h-4 w-4 ml-1" />
            : <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR');
    };

    return (
        <Layout>
            <div className="p-10 min-h-screen bg-white rounded-lg w-full">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                        <h1 className="text-lg font-semibold text-gray-900">Journal d'authentification</h1>
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
                                            { key: 'created_at', label: 'Date/Heure', sortable: true },
                                            { key: 'email', label: 'Email', sortable: true },
                                            { key: 'user', label: 'Utilisateur', sortable: true },
                                            { key: 'ip_address', label: 'IP', sortable: true },
                                            { key: 'success', label: 'Statut', sortable: true },
                                            { key: 'details', label: 'Détails', sortable: false },
                                        ].map((header) => (
                                            <th
                                                key={header.key}
                                                className="px-4 py-2 text-left text-xs font-semibold text-gray-700"
                                                onClick={() => header.sortable && handleSort(header.key as keyof AuthenticationLog)}
                                            >
                                                <div className="flex items-center group">
                                                    {header.label}
                                                    {header.sortable && (
                                                        <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            {getSortIcon(header.key as keyof AuthenticationLog)}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((log) => {
                                        const { browser, os } = parseUserAgent(log.user_agent);

                                        return (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-2 text-sm text-gray-600">
                                                    {formatDateTime(log.created_at)}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {log.email}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600">
                                                    {log.user?.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600 font-mono">
                                                    {log.ip_address}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                                        ${log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {log.success ? 'Succès' : 'Échec'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600">
                                                    <div className="grid gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">{browser.name || 'Inconnu'}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-gray-500">{os.name} {os.version}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center p-3 border-t border-gray-200 text-xs">
                            <div className="mb-2 sm:mb-0 text-gray-600">
                                {sortedLogs.length} résultat{sortedLogs.length > 1 && 's'} • Page {currentPage} sur {totalPages}
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

                        {filteredLogs.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-xs">
                                Aucun log trouvé
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}