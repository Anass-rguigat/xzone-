import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { can } from '@/helpers';
import { Layout } from '@/Layouts/Layout';

export default function Index({ auth, users }: PageProps<{ users: User[] }>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.roles.join(' ').toLowerCase().includes(searchTerm) ||
        user.permissions.join(' ').toLowerCase().includes(searchTerm)
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        return sortConfig.direction === 'asc' 
            ? String(aValue).localeCompare(String(bValue)) 
            : String(bValue).localeCompare(String(aValue));
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const getSortIcon = (key: keyof User) => {
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
                            Gestion des Utilisateurs
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto flex-1">
                                <input
                                    type="text"
                                    className="w-full pl-3 pr-9 py-1.5 border border-gray-300 rounded-lg text-sm 
                                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
                                             placeholder-gray-400 bg-white"
                                    placeholder="Rechercher des utilisateurs..."
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
                                            { key: 'name', label: 'Nom', sortable: true },
                                            { key: 'email', label: 'Email', sortable: true },
                                            { key: 'roles', label: 'Rôles', sortable: false },
                                            { key: 'permissions', label: 'Permissions', sortable: false },
                                        ].map((header) => (
                                            <th 
                                                key={header.key}
                                                className="px-4 py-2 text-left text-xs font-semibold text-gray-700"
                                                onClick={() => header.sortable && handleSort(header.key as keyof User)}
                                            >
                                                <div className="flex items-center group">
                                                    {header.label}
                                                    {header.sortable && (
                                                        <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            {getSortIcon(header.key as keyof User)}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        {(can(auth.user, 'Gerer_Utilisateurs')) && (
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentItems.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                        >
                                                            {role.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.permissions.map((permission) => (
                                                        <span
                                                            key={permission}
                                                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                                        >
                                                            {permission.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">
                                                    {can(auth.user, 'Gerer_Utilisateurs') && (
                                                        <Link
                                                            href={route('users.edit', user.id)}
                                                            className="text-blue-600 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
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
                                {filteredUsers.length} résultat{filteredUsers.length !== 1 && 's'} • Page {currentPage} sur {totalPages}
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

                        {filteredUsers.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-xs">
                                Aucun utilisateur trouvé
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Rest of the icon components remain unchanged
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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