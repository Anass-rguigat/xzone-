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
        price: '',
        form_factor: '',
        material: '',
        type: '',
        server_ids: [] as number[],
        image: null as File | null,
    });

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/chassis', {
            onSuccess: () => toast.success('Châssis créé avec succès'),
            onError: () => toast.error('Erreur lors de la création')
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Ajouter un Nouveau Châssis</h1>
                    <p className="text-gray-600">Configurez les spécifications techniques du châssis</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        {/* Section Principale */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Nom du châssis
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <hr className="border-gray-200" />

                            {/* Section Marque et Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Marque
                                    </label>
                                    <select
                                        value={data.brand_id}
                                        onChange={(e) => setData('brand_id', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionner une marque</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand_id && <p className="text-red-600 text-sm mt-1">{errors.brand_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Type de châssis
                                    </label>
                                    <input
                                        type="text"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Spécifications techniques */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Prix (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Format
                                    </label>
                                    <input
                                        type="text"
                                        value={data.form_factor}
                                        onChange={(e) => setData('form_factor', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.form_factor && <p className="text-red-600 text-sm mt-1">{errors.form_factor}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Matériau
                                    </label>
                                    <input
                                        type="text"
                                        value={data.material}
                                        onChange={(e) => setData('material', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.material && <p className="text-red-600 text-sm mt-1">{errors.material}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Upload d'image */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Image
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                        <input
                                            type="file"
                                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                        <span className="text-gray-500">
                                            {data.image ? data.image.name : 'Glissez-déposez ou cliquez pour uploader'}
                                        </span>
                                    </label>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    PNG, JPG, JPEG (Max. 2MB)
                                </p>
                                {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                            </div>

                            <hr className="border-gray-200" />

                            {/* Serveurs compatibles */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Serveurs compatibles
                                </label>
                                <select
                                    multiple
                                    value={data.server_ids}
                                    onChange={(e) => setData('server_ids', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {servers.map((server) => (
                                        <option key={server.id} value={server.id}>
                                            {server.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-sm text-gray-500">
                                    Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélectionner plusieurs
                                </p>
                                {errors.server_ids && <p className="text-red-600 text-sm mt-1">{errors.server_ids}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Link
                                href="/chassis"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement...' : 'Créer le Châssis'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}