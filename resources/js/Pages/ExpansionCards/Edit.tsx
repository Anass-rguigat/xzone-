import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { can } from '@/helpers';

interface Brand {
    id: number;
    name: string;
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
    servers: Server[];
    image: { url: string } | null;
}

interface Props {
    expansionCard: ExpansionCard;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ expansionCard, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: expansionCard.name,
        type: expansionCard.type,
        interface_type: expansionCard.interface_type,
        speed: expansionCard.speed,
        power_rating: expansionCard.power_rating,
        price: expansionCard.price,
        brand_id: expansionCard.brand?.id ?? '',
        server_ids: expansionCard.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const { flash, auth } = usePage().props;
    const user = auth.user;
    const [selectedImage, setSelectedImage] = useState<string | null>(
        expansionCard.image?.url ? `/storage/${expansionCard.image.url}` : null
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

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'server_ids') {
                value.forEach((id: number) => formData.append('server_ids[]', String(id)));
            } else if (value !== null) {
                formData.append(key, value);
            }
        });

        post(`/expansion-cards/${expansionCard.id}`, {
            data: formData,
            preserveScroll: true,
            onSuccess: () => toast.success('Carte mise à jour avec succès!'),
            onError: () => toast.error('Erreur lors de la mise à jour')
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier la Carte d'Extension</h1>
                    <p className="text-xs text-gray-600">Mettez à jour les spécifications techniques de la carte</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Nom de la carte */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Nom de la Carte
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Marque et Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                                    Type de Carte
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner un type</option>
                                    <option value="pci-e">PCI-E</option>
                                    <option value="usb">USB</option>
                                    <option value="m.2">M.2</option>
                                </select>
                                {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Spécifications techniques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Prix (€)
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Interface
                                </label>
                                <input
                                    type="text"
                                    value={data.interface_type}
                                    onChange={(e) => setData('interface_type', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.interface_type && <p className="text-red-600 text-xs mt-1">{errors.interface_type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Vitesse (MHz)
                                </label>
                                <input
                                    type="number"
                                    value={data.speed}
                                    onChange={(e) => setData('speed', e.target.value)}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.speed && <p className="text-red-600 text-xs mt-1">{errors.speed}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Puissance */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Puissance (W)
                            </label>
                            <input
                                type="number"
                                value={data.power_rating}
                                onChange={(e) => setData('power_rating', e.target.value)}
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.power_rating && <p className="text-red-600 text-xs mt-1">{errors.power_rating}</p>}
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
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <span className="text-gray-500 text-sm">
                                        {data.image ? data.image.name : 'Glissez-déposez ou cliquez pour uploader'}
                                    </span>
                                </label>
                            </div>
                            {selectedImage && (
                                <div className="mt-4">
                                    <img
                                        src={selectedImage}
                                        alt="Prévisualisation"
                                        className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
                                    />
                                </div>
                            )}
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

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 w-full">
                            <Link
                                href="/expansion-cards"
                                className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Edit_Composants') &&
                                <button
                                    type="submit"
                                    disabled={!!progress}
                                    className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {progress ? 'Enregistrement...' : 'Mettre à jour la Carte'}
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}