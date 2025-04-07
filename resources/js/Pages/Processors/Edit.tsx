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

interface Processor {
    id: number;
    name: string;
    model: string;
    core_count: number;
    thread_count: number;
    base_clock: number;
    boost_clock: number;
    socket: string;
    thermal_design_power: number;
    brand_id: number;
    image: { url: string } | null;
    servers: Server[];
    price: number;
}

interface Props {
    processor: Processor;
    brands: Brand[];
    servers: Server[];
}

export default function Edit({ processor, brands, servers }: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: processor.name,
        model: processor.model,
        core_count: processor.core_count,
        thread_count: processor.thread_count,
        base_clock: processor.base_clock,
        boost_clock: processor.boost_clock,
        socket: processor.socket,
        thermal_design_power: processor.thermal_design_power,
        brand_id: processor.brand_id,
        server_ids: processor.servers.map((server) => server.id),
        image: null as File | null,
        price: processor.price,
        _method: 'PUT',
    });

    const { flash } = usePage().props;
    const [selectedImage, setSelectedImage] = useState<string | null>(
        processor.image?.url ? `/storage/${processor.image.url}` : null
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);

            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'server_ids') {
                value.forEach((id: number) => formData.append('server_ids[]', id.toString()));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        post(`/processors/${processor.id}`, {
            data: formData,
            preserveScroll: true,
            onSuccess: () => toast.success('Processeur mis à jour avec succès!'),
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    toast.error('Erreurs de validation dans le formulaire');
                } else {
                    toast.error('Erreur technique lors de la mise à jour');
                }
            }
        });
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Modifier le Processeur</h1>
                    <p className="text-gray-600">Mettez à jour les spécifications techniques du processeur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        {/* Section Principale */}
                        <div className="space-y-4">
                            {/* Nom et Marque */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Nom du processeur
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>

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
                            </div>

                            <hr className="border-gray-200" />

                            {/* Spécifications techniques */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Modèle
                                        </label>
                                        <input
                                            type="text"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Socket
                                        </label>
                                        <input
                                            type="text"
                                            value={data.socket}
                                            onChange={(e) => setData('socket', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.socket && <p className="text-red-600 text-sm mt-1">{errors.socket}</p>}
                                    </div>

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
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                                Cœurs
                                            </label>
                                            <input
                                                type="number"
                                                value={data.core_count}
                                                onChange={(e) => setData('core_count', e.target.value)}
                                                className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.core_count && <p className="text-red-600 text-sm mt-1">{errors.core_count}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                                Threads
                                            </label>
                                            <input
                                                type="number"
                                                value={data.thread_count}
                                                onChange={(e) => setData('thread_count', e.target.value)}
                                                className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.thread_count && <p className="text-red-600 text-sm mt-1">{errors.thread_count}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                                Fréquence de base (GHz)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={data.base_clock}
                                                onChange={(e) => setData('base_clock', e.target.value)}
                                                className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.base_clock && <p className="text-red-600 text-sm mt-1">{errors.base_clock}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                                Fréquence boost (GHz)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={data.boost_clock}
                                                onChange={(e) => setData('boost_clock', e.target.value)}
                                                className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.boost_clock && <p className="text-red-600 text-sm mt-1">{errors.boost_clock}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            TDP (W)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.thermal_design_power}
                                            onChange={(e) => setData('thermal_design_power', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.thermal_design_power && <p className="text-red-600 text-sm mt-1">{errors.thermal_design_power}</p>}
                                    </div>
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
                                    Serveurs associés
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
                                href="/processors"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={!!progress}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {progress ? 'Enregistrement...' : 'Mettre à jour le processeur'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}