import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';

interface Brand {
    id: number;
    name: string;
}

interface Ram {
    id: number;
    name: string;
}

interface Component {
    id: number;
    name: string;
}

interface Props {
    brands: Brand[];
    rams: Ram[];
    hardDrives: Component[];
    processors: Component[];
    powerSupplies: Component[];
    motherboards: Component[];
    networkCards: Component[];
    raidControllers: Component[];
    coolingSolutions: Component[];
    chassis: Component[];
    graphicCards: Component[];
    fiberOpticCards: Component[];
    expansionCards: Component[];
    cableConnectors?: Component[];
    batteries?: Component[];
}

export default function Create({
    brands,
    rams,
    hardDrives,
    processors,
    powerSupplies,
    motherboards,
    networkCards,
    raidControllers,
    coolingSolutions,
    chassis,
    graphicCards,
    fiberOpticCards,
    expansionCards,
    cableConnectors = [],
    batteries = [],
}: Props) {
    const { data, setData, post, progress, errors, processing } = useForm({
        name: '',
        brand_id: 0,
        model: '',
        cpu_socket: '',
        ram_slots: 0,
        storage_slots: 0,
        power_supply_type: '',
        rack_mountable: false,
        form_factor: '',
        ram_ids: [] as number[],
        price: '',
        image: null as File | null,
        hard_drive_ids: [] as number[],
        processor_ids: [] as number[],
        power_supply_ids: [] as number[],
        motherboard_ids: [] as number[],
        network_card_ids: [] as number[],
        raid_controller_ids: [] as number[],
        cooling_solution_ids: [] as number[],
        chassis_ids: [] as number[],
        graphic_card_ids: [] as number[],
        fiber_optic_card_ids: [] as number[],
        expansion_card_ids: [] as number[],
        cable_ids: [] as number[],
        battery_ids: [] as number[],
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/servers', {
            onSuccess: () => toast.success('Serveur créé avec succès'),
            onError: () => toast.error('Erreur lors de la création')
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Ajouter un Nouveau Serveur</h1>
                    <p className="text-gray-600">Configurez les spécifications techniques du serveur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        {/* Section Informations de base */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Nom du Serveur
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Modèle
                                    </label>
                                    <input
                                        type="text"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Marque
                                    </label>
                                    <select
                                        value={data.brand_id}
                                        onChange={(e) => setData('brand_id', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
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
                                        Socket CPU
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cpu_socket}
                                        onChange={(e) => setData('cpu_socket', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.cpu_socket && <p className="text-red-600 text-sm mt-1">{errors.cpu_socket}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Spécifications techniques */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Slots RAM
                                    </label>
                                    <input
                                        type="number"
                                        value={data.ram_slots}
                                        onChange={(e) => setData('ram_slots', Number(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.ram_slots && <p className="text-red-600 text-sm mt-1">{errors.ram_slots}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Slots Stockage
                                    </label>
                                    <input
                                        type="number"
                                        value={data.storage_slots}
                                        onChange={(e) => setData('storage_slots', Number(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.storage_slots && <p className="text-red-600 text-sm mt-1">{errors.storage_slots}</p>}
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
                                        required
                                        step="0.01"
                                    />
                                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Type Alimentation
                                    </label>
                                    <input
                                        type="text"
                                        value={data.power_supply_type}
                                        onChange={(e) => setData('power_supply_type', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.power_supply_type && <p className="text-red-600 text-sm mt-1">{errors.power_supply_type}</p>}
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
                                        required
                                    />
                                    {errors.form_factor && <p className="text-red-600 text-sm mt-1">{errors.form_factor}</p>}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.rack_mountable}
                                        onChange={(e) => setData('rack_mountable', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Rack Mountable</span>
                                </label>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Composants */}
                            <div className="space-y-6">
                                {[
                                    { label: 'RAMs', id: 'ram_ids', options: rams },
                                    { label: 'Disques Durs', id: 'hard_drive_ids', options: hardDrives },
                                    { label: 'Processeurs', id: 'processor_ids', options: processors },
                                    { label: 'Alimentations', id: 'power_supply_ids', options: powerSupplies },
                                    { label: 'Cartes Mères', id: 'motherboard_ids', options: motherboards },
                                    { label: 'Cartes Réseau', id: 'network_card_ids', options: networkCards },
                                    { label: 'Contrôleurs RAID', id: 'raid_controller_ids', options: raidControllers },
                                    { label: 'Refroidissement', id: 'cooling_solution_ids', options: coolingSolutions },
                                    { label: 'Châssis', id: 'chassis_ids', options: chassis },
                                    { label: 'Cartes Graphiques', id: 'graphic_card_ids', options: graphicCards },
                                    { label: 'Cartes Fibre Optique', id: 'fiber_optic_card_ids', options: fiberOpticCards },
                                    { label: "Cartes d'Expansion", id: 'expansion_card_ids', options: expansionCards },
                                    { label: 'Câbles', id: 'cable_ids', options: cableConnectors },
                                    { label: 'Batteries', id: 'battery_ids', options: batteries },
                                ].map((component) => (
                                    component.options && component.options.length > 0 && (
                                        <div key={component.id}>
                                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                                {component.label}
                                            </label>
                                            <select
                                                multiple
                                                id={component.id}
                                                value={data[component.id as keyof typeof data] as number[]}
                                                onChange={(e) => setData(
                                                    component.id as keyof typeof data,
                                                    Array.from(e.target.selectedOptions, option => parseInt(option.value))
                                                )}
                                                className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                {component.options.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélectionner plusieurs
                                            </p>
                                            {errors[component.id as keyof typeof errors] && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {errors[component.id as keyof typeof errors]}
                                                </p>
                                            )}
                                        </div>
                                    )
                                ))}
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
                                        <div className="text-center">
                                            <span className="text-gray-500">
                                                {data.image ? data.image.name : 'Glissez-déposez ou cliquez pour uploader'}
                                            </span>
                                            {previewImage && (
                                                <img 
                                                    src={previewImage} 
                                                    alt="Preview" 
                                                    className="mt-2 w-16 h-16 object-cover rounded"
                                                />
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    PNG, JPG, JPEG (Max. 2MB)
                                </p>
                                {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Link
                                href="/servers"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {processing ? 'Enregistrement...' : 'Créer le Serveur'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}