import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface FiberOpticCard {
    id: number;
    name: string;
    price: number;
    fiber_type: string;
    speed: string;
    power_rating: number;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
}

interface Props {
    fiberOpticCard: FiberOpticCard;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ fiberOpticCard, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: fiberOpticCard.name,
        price: fiberOpticCard.price,
        fiber_type: fiberOpticCard.fiber_type,
        speed: fiberOpticCard.speed,
        power_rating: fiberOpticCard.power_rating,
        brand_id: fiberOpticCard.brand?.id ?? '',
        server_ids: fiberOpticCard.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const { flash } = usePage().props;
    const [selectedImage, setSelectedImage] = useState<string | null>(
        fiberOpticCard.image?.url ? `/storage/${fiberOpticCard.image.url}` : null
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);

            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('price', String(data.price));
        formData.append('fiber_type', data.fiber_type);
        formData.append('speed', data.speed);
        formData.append('power_rating', String(data.power_rating));
        formData.append('brand_id', String(data.brand_id));

        data.server_ids.forEach((id) => formData.append('server_ids[]', String(id)));

        if (data.image) {
            formData.append('image', data.image);
        }

        post(`/fiber-optic-cards/${fiberOpticCard.id}`, {
            data: formData,
            preserveScroll: true,
            onSuccess: () => toast.success('Carte optique mise à jour avec succès!'),
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    toast.error('Erreurs de validation dans le formulaire');
                } else {
                    toast.error('Erreur technique lors de la mise à jour');
                }
            }
        });
    };

    useEffect(() => {
        if (fiberOpticCard.image) {
            setSelectedImage(`/storage/${fiberOpticCard.image.url}`);
        }
    }, [fiberOpticCard]);

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Modifier la Carte Fibre Optique</h1>
                    <p className="text-gray-600">Mettez à jour les spécifications techniques de la carte</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        {/* Section Principale */}
                        <div className="space-y-4">
                            {/* Nom de la carte */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Nom de la Carte
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

                            {/* Marque et Type de fibre */}
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
                                        Type de Fibre
                                    </label>
                                    <input
                                        type="text"
                                        value={data.fiber_type}
                                        onChange={(e) => setData('fiber_type', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.fiber_type && <p className="text-red-600 text-sm mt-1">{errors.fiber_type}</p>}
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
                                        Vitesse (Mbps)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.speed}
                                        onChange={(e) => setData('speed', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.speed && <p className="text-red-600 text-sm mt-1">{errors.speed}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Puissance (W)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.power_rating}
                                        onChange={(e) => setData('power_rating', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.power_rating && <p className="text-red-600 text-sm mt-1">{errors.power_rating}</p>}
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
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <span className="text-gray-500">
                                            {data.image ? data.image.name : 'Glissez-déposez ou cliquez pour uploader'}
                                        </span>
                                    </label>
                                </div>
                                {selectedImage && (
                                    <div className="mt-4">
                                        <img
                                            src={selectedImage}
                                            alt="Prévisualisation"
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                    </div>
                                )}
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
                                href="/fiber-optic-cards"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={!!progress}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {progress ? 'Enregistrement...' : 'Mettre à jour la Carte'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}