import { Head, useForm, router, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { can } from '@/helpers';
import { Layout } from '@/Layouts/Layout';

export default function Edit({ auth, user, roles, roleLabels, permissions, permissionLabels }: PageProps<{ 
    user: User,
    roles: string[],
    roleLabels: Record<string, string>,
    permissions: string[],
    permissionLabels: string[] 
}>) {
    const { data, setData, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        country: user.country || '',
        roles: user.roles,
        permissions: user.permissions,
    });

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        if (data.roles.includes('super_admin')) {
            setData('permissions', permissions);
        }
    }, [data.roles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('users.update', user.id), data, {
            onSuccess: () => toast.success('Utilisateur mis à jour avec succès'),
            onError: () => toast.error('Erreur lors de la mise à jour de l\'utilisateur')
        });
    };

    return (
        <Layout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Modifier l'utilisateur</h2>}
        >
            <Head title="Modifier l'utilisateur" />

            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white rounded-md">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier l'utilisateur : {user.name}</h1>
                    <p className="text-xs text-gray-600">Gérer les informations et les droits de {user.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-6">
                        {/* Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="name" value="Nom" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="Téléphone" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && (
                                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="city" value="Ville" />
                                <TextInput
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('city', e.target.value)}
                                />
                                {errors.city && (
                                    <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="country" value="Pays" />
                                <TextInput
                                    id="country"
                                    type="text"
                                    value={data.country}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('country', e.target.value)}
                                />
                                {errors.country && (
                                    <p className="text-red-600 text-xs mt-1">{errors.country}</p>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Section Rôles */}
                        <div>
                            <InputLabel className="block text-sm font-medium mb-1 text-gray-700">
                                Rôles
                            </InputLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                {roles.map((role) => (
                                    <label key={role} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={role}
                                            checked={data.roles.includes(role)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('roles', [...data.roles, role]);
                                                } else {
                                                    setData('roles', data.roles.filter((r: string) => r !== role));
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{roleLabels[role] || role}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.roles && (
                                <p className="text-red-600 text-xs mt-1">{errors.roles}</p>
                            )}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Section Permissions */}
                        <div>
                            <InputLabel className="block text-sm font-medium mb-1 text-gray-700">
                                Permissions
                            </InputLabel>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {permissions.map((permission, index) => (
                                    <label key={permission} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={permission}
                                            checked={data.permissions.includes(permission)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('permissions', [...data.permissions, permission]);
                                                } else {
                                                    setData('permissions', data.permissions.filter((p: string) => p !== permission));
                                                }
                                            }}
                                            disabled={data.roles.includes('super_admin')}
                                            className={`rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500 ${
                                                data.roles.includes('super_admin') ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        />
                                        <span className="text-sm text-gray-700">
                                            {permissionLabels[index] || permission.replace(/_/g, ' ')}
                                            {data.roles.includes('super_admin') && (
                                                <span className="text-xs text-gray-500 ml-1">(Toutes permissions)</span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.permissions && (
                                <p className="text-red-600 text-xs mt-1">{errors.permissions}</p>
                            )}
                            {data.roles.includes('super_admin') && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Le Super Admin a toutes les permissions automatiquement
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.visit(route('users.index'))}
                                className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </button>
                            {can(auth.user, 'manage_users') && (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}