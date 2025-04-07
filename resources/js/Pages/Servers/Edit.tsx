import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/Layout';
import toast from 'react-hot-toast';
interface Brand { id: number; name: string; }
interface Ram { id: number; name: string; }
interface HardDrive { id: number; name: string; }
interface Processor { id: number; name: string; }
interface PowerSupply { id: number; name: string; }
interface Motherboard { id: number; name: string; }
interface NetworkCard { id: number; name: string; }
interface RaidController { id: number; name: string; }
interface CoolingSolution { id: number; name: string; }
interface Chassis { id: number; name: string; }
interface GraphicCard { id: number; name: string; }
interface FiberOpticCard { id: number; name: string; }
interface ExpansionCard { id: number; name: string; }
interface CableConnector { id: number; name: string; }
interface Battery { id: number; name: string; }

interface Server {
    id: number;
    name: string;
    price: number;
    model: string;
    brand?: Brand;
    rams: Ram[];
    hard_drives: HardDrive[];
    processors: Processor[];
    power_supplies: PowerSupply[];
    motherboards: Motherboard[];
    network_cards: NetworkCard[];
    raid_controllers: RaidController[];
    cooling_solutions: CoolingSolution[];
    chassis: Chassis[];
    graphic_cards: GraphicCard[];
    fiber_optic_cards: FiberOpticCard[];
    expansion_cards: ExpansionCard[];
    cable_connectors: CableConnector[];
    batteries: Battery[];
    image: { url: string } | null;
    cpu_socket: string;
    ram_slots: number;
    storage_slots: number;
    power_supply_type: string;
    rack_mountable: boolean;
    form_factor: string;
}

interface Props {
    server: Server;
    brands: Brand[];
    rams: Ram[];
    hardDrives: HardDrive[];
    processors: Processor[];
    powerSupplies: PowerSupply[];
    motherboards: Motherboard[];
    networkCards: NetworkCard[];
    raidControllers: RaidController[];
    coolingSolutions: CoolingSolution[];
    chassis: Chassis[];
    graphicCards: GraphicCard[];
    fiberOpticCards: FiberOpticCard[];
    expansionCards: ExpansionCard[];
    cable_connectors: CableConnector[];
    batteries: Battery[];
}

export default function Edit({
    server,
    brands = [],
    rams = [],
    hardDrives = [],
    processors = [],
    powerSupplies = [],
    motherboards = [],
    networkCards = [],
    raidControllers = [],
    coolingSolutions = [],
    chassis = [],
    graphicCards = [],
    fiberOpticCards = [],
    expansionCards = [],
    cable_connectors = [],
    batteries = [],
}: Props) {
    const { data, setData, post, progress, errors } = useForm({
        name: server.name,
        price: server.price,
        brand_id: server.brand?.id ?? 0,
        ram_ids: server.rams?.map((ram) => ram.id) || [],
        hard_drive_ids: server.hard_drives?.map((hardDrive) => hardDrive.id) || [],
        processor_ids: server.processors?.map((processor) => processor.id) || [],
        power_supply_ids: server.power_supplies?.map((powerSupply) => powerSupply.id) || [],
        motherboard_ids: server.motherboards?.map((motherboard) => motherboard.id) || [],
        network_card_ids: server.network_cards?.map((networkCard) => networkCard.id) || [],
        raid_controller_ids: server.raid_controllers?.map((raidController) => raidController.id) || [],
        cooling_solution_ids: server.cooling_solutions?.map((coolingSolution) => coolingSolution.id) || [],
        chassis_ids: server.chassis?.map((chassis) => chassis.id) || [],
        graphic_card_ids: server.graphic_cards?.map((graphicCard) => graphicCard.id) || [],
        fiber_optic_card_ids: server.fiber_optic_cards?.map((fiberOpticCard) => fiberOpticCard.id) || [],
        expansion_card_ids: server.expansion_cards?.map((expansionCard) => expansionCard.id) || [],
        cable_connector_ids: server.cable_connectors?.map((cable) => cable.id) || [],
        battery_ids: server.batteries?.map((battery) => battery.id) || [],
        image: null as File | null,
        model: server.model,
        cpu_socket: server.cpu_socket,
        ram_slots: server.ram_slots,
        storage_slots: server.storage_slots,
        power_supply_type: server.power_supply_type,
        rack_mountable: server.rack_mountable,
        form_factor: server.form_factor,
        _method: 'PUT',
    });
    const { flash } = usePage().props;
    const [selectedImage, setSelectedImage] = useState<string | null>(
        server.image?.url ? `/storage/${server.image.url}` : null
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
            if (key === '_method') return;
            if (Array.isArray(value)) {
                value.forEach(v => formData.append(`${key}[]`, v.toString()));
            } else if (value !== null) {
                formData.append(key, value.toString());
            }
        });

        post(`/servers/${server.id}`, {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Serveur mis à jour avec succès !');
                setSelectedImage(null);
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    toast.error('Erreurs de validation dans le formulaire');
                } else {
                    toast.error('Erreur technique lors de la mise à jour');
                }
            }
        });
    };

    const componentGroups = [
        { label: 'RAM', name: 'ram_ids', options: rams },
        { label: 'Disques durs', name: 'hard_drive_ids', options: hardDrives },
        { label: 'Processeurs', name: 'processor_ids', options: processors },
        { label: 'Alimentations', name: 'power_supply_ids', options: powerSupplies },
        { label: 'Cartes mères', name: 'motherboard_ids', options: motherboards },
        { label: 'Cartes réseau', name: 'network_card_ids', options: networkCards },
        { label: 'Contrôleurs RAID', name: 'raid_controller_ids', options: raidControllers },
        { label: 'Refroidissement', name: 'cooling_solution_ids', options: coolingSolutions },
        { label: 'Châssis', name: 'chassis_ids', options: chassis },
        { label: 'Cartes graphiques', name: 'graphic_card_ids', options: graphicCards },
        { label: 'Cartes fibre optique', name: 'fiber_optic_card_ids', options: fiberOpticCards },
        { label: "Cartes d'extension", name: 'expansion_card_ids', options: expansionCards },
        { label: 'Câbles', name: 'cable_connector_ids', options: cable_connectors },
        { label: 'Batteries', name: 'battery_ids', options: batteries },
    ];

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Modifier le Serveur</h1>
                    <p className="text-gray-600">Mettez à jour les spécifications techniques du serveur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        {/* Informations de base */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Nom du serveur
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
                                        onChange={(e) => setData('brand_id', Number(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value={0}>Sélectionner une marque</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                    {errors.brand_id && <p className="text-red-600 text-sm mt-1">{errors.brand_id}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Prix et Modèle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Prix (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
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
                                    />
                                    {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Spécifications techniques */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Socket CPU
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cpu_socket}
                                        onChange={(e) => setData('cpu_socket', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.cpu_socket && <p className="text-red-600 text-sm mt-1">{errors.cpu_socket}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Slots RAM
                                    </label>
                                    <input
                                        type="number"
                                        value={data.ram_slots}
                                        onChange={(e) => setData('ram_slots', Number(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.ram_slots && <p className="text-red-600 text-sm mt-1">{errors.ram_slots}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Slots stockage
                                    </label>
                                    <input
                                        type="number"
                                        value={data.storage_slots}
                                        onChange={(e) => setData('storage_slots', Number(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.storage_slots && <p className="text-red-600 text-sm mt-1">{errors.storage_slots}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Type alimentation
                                    </label>
                                    <input
                                        type="text"
                                        value={data.power_supply_type}
                                        onChange={(e) => setData('power_supply_type', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.power_supply_type && <p className="text-red-600 text-sm mt-1">{errors.power_supply_type}</p>}
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Configuration physique */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Facteur de forme
                                    </label>
                                    <input
                                        type="text"
                                        value={data.form_factor}
                                        onChange={(e) => setData('form_factor', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.form_factor && <p className="text-red-600 text-sm mt-1">{errors.form_factor}</p>}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.rack_mountable}
                                        onChange={(e) => setData('rack_mountable', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Montage en rack
                                    </label>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Composants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {componentGroups.map(({ label, name, options }) => (
                                    <div key={name}>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            {label}
                                        </label>
                                        <select
                                            multiple
                                            value={(data as any)[name]}
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                                                setData(name as any, selected);
                                            }}
                                            className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
                                        >
                                            {options.map((option: Component) => (
                                                <option key={option.id} value={option.id}>{option.name}</option>
                                            ))}
                                        </select>
                                        {errors[name as keyof typeof errors] && (
                                            <p className="text-red-600 text-sm mt-1">{errors[name as keyof typeof errors]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-200" />

                            {/* Image */}
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
                                disabled={!!progress}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                {progress ? 'Enregistrement...' : 'Mettre à jour le serveur'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}