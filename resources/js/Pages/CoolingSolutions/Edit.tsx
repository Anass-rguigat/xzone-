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

interface CoolingSolution {
    id: number;
    name: string;
    type: string;
    manufacturer: string;
    power_rating: number;
    price: number;
    brand: Brand;
    servers: Server[];
    image: { url: string } | null;
}

interface Props {
    coolingSolution: CoolingSolution;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ coolingSolution, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: coolingSolution.name,
        type: coolingSolution.type,
        manufacturer: coolingSolution.manufacturer,
        power_rating: coolingSolution.power_rating,
        price: coolingSolution.price,
        brand_id: coolingSolution.brand?.id ?? '',
        server_ids: coolingSolution.servers.map((server) => server.id),
        image: null as File | null,
        _method: 'PUT',
    });

    const { flash, auth } = usePage().props;
    const user = auth.user;
    const [selectedImage, setSelectedImage] = useState<string | null>(
        coolingSolution.image?.url ? `/storage/${coolingSolution.image.url}` : null
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

        post(`/cooling-solutions/${coolingSolution.id}`, {
            data: formData,
            preserveScroll: true,
            onSuccess: () => toast.success('Solution mise à jour avec succès!'),
            onError: () => toast.error('Erreur lors de la mise à jour')
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier la Solution de Refroidissement</h1>
                    <p className="text-xs text-gray-600">Mettez à jour les spécifications techniques du système</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        {/* Section Principale */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Nom de la solution
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Entrez le nom de la solution"
                                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-sm"
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Section Marque et Fabricant */}
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
                                    Fabricant
                                </label>
                                <input
                                    type="text"
                                    value={data.manufacturer}
                                    onChange={(e) => setData('manufacturer', e.target.value)}
                                    placeholder="Entrez le fabricant"
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.manufacturer && <p className="text-red-600 text-xs mt-1">{errors.manufacturer}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Spécifications techniques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Type de refroidissement
                                </label>
                                <input
                                    type="text"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    placeholder="Ex: Refroidissement liquide"
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Puissance (W)
                                </label>
                                <input
                                    type="number"
                                    value={data.power_rating}
                                    onChange={(e) => setData('power_rating', Number(e.target.value))}
                                    placeholder="Ex: 150"
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.power_rating && <p className="text-red-600 text-xs mt-1">{errors.power_rating}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Prix (€)
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', Number(e.target.value))}
                                    placeholder="0.00"
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
                                href="/cooling-solutions"
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
                                    {progress ? 'Enregistrement...' : 'Mettre à jour la Solution'}
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}