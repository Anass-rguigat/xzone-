import { can } from '@/helpers';
import { Layout } from '@/Layouts/layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
    servers: Server[];
}

export default function Create({ brands, servers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        brand_id: '',
        model: '',
        interface: '',
        speed: '',
        price: '',
        image: null as File | null,
        server_ids: [] as number[],
    });

    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/network-cards', {
            onSuccess: () => toast.success('Carte réseau créée avec succès'),
            onError: () => toast.error('Erreur lors de la création')
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Ajouter une Nouvelle Carte Réseau</h1>
                    <p className="text-xs text-gray-600">Configurez les spécifications techniques de la carte</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Section Informations de base */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Nom de la carte
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Entrez le nom de la carte"
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-sm"
                                />
                                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <hr className="border-gray-200" />

                            {/* Section Marque et Modèle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Marque
                                    </label>
                                    <select
                                        value={data.brand_id}
                                        onChange={(e) => setData('brand_id', e.target.value)}
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionner une marque</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand_id && <p className="text-red-600 text-xs mt-1">{errors.brand_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Modèle
                                    </label>
                                    <input
                                        type="text"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="Entrez le modèle de la carte"
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.model && <p className="text-red-600 text-xs mt-1">{errors.model}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Spécifications techniques */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Interface
                                    </label>
                                    <input
                                        type="text"
                                        value={data.interface}
                                        onChange={(e) => setData('interface', e.target.value)}
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.interface && <p className="text-red-600 text-xs mt-1">{errors.interface}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Vitesse (Mbps)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.speed}
                                        onChange={(e) => setData('speed', e.target.value)}
                                        placeholder="Ex: 1000"
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.speed && <p className="text-red-600 text-xs mt-1">{errors.speed}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Prix (DH)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Upload d'image */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Image
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                        <input
                                            type="file"
                                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                        <span className="text-gray-500 text-sm">
                                            {data.image ? data.image.name : 'Glissez-déposez ou cliquez pour uploader'}
                                        </span>
                                    </label>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    PNG, JPG, JPEG (Max. 2MB)
                                </p>
                                {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image}</p>}
                            </div>

                            <hr className="border-gray-200" />

                            {/* Serveurs compatibles */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Serveurs compatibles
                                </label>
                                <select
                                    multiple
                                    value={data.server_ids}
                                    onChange={(e) => setData('server_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {servers.map((server) => (
                                        <option key={server.id} value={server.id}>
                                            {server.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs text-gray-500">
                                    Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélectionner plusieurs
                                </p>
                                {errors.server_ids && <p className="text-red-600 text-xs mt-1">{errors.server_ids}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 w-full">
                            <Link
                                href="/network-cards"
                                className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Ajouter_Composants') &&
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : 'Créer la carte réseau'}
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}