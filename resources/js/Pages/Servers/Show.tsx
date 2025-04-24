import { Layout } from '@/Layouts/layout';
import { Link, usePage } from '@inertiajs/react';
import { can } from '@/helpers';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface Brand {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface Ram {
    id: number;
    name: string;
}

interface HardDrive {
    id: number;
    name: string;
    capacity: string;
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
}

interface PowerSupply {
    id: number;
    name: string;
    wattage: string;
}

interface Motherboard {
    id: number;
    name: string;
}

interface NetworkCard {
    id: number;
    name: string;
}

interface RaidController {
    id: number;
    name: string;
}

interface CoolingSolution {
    id: number;
    name: string;
}

interface Chassis {
    id: number;
    name: string;
}

interface GraphicCard {
    id: number;
    name: string;
}

interface FiberOpticCard {
    id: number;
    name: string;
}

interface ExpansionCard {
    id: number;
    name: string;
}

interface Cable {
    id: number;
    name: string;
}

interface Battery {
    id: number;
    name: string;
}
interface Server {
    id: number;
    name: string;
    price: string;
    brand: Brand;
    model: string;
    cpu_socket: string;
    ram_slots: number;
    storage_slots: number;
    power_supply_type: string;
    rack_mountable: boolean;
    form_factor: string;
    image: Image;
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
    cable_connectors: Cable[];
    batteries: Battery[];
}

interface Props {
    server: Server;
}

export default function Show({ server }: Props) {

    const { flash, auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const renderComponentList = (components: ComponentBase[], label: string) => {
        if (!components?.length) return null;
        return (
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">{label}</label>
                <div className="flex flex-wrap gap-2">
                    {components.map((component) => (
                        <span 
                            key={component.id}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {component.name}
                        </span>
                    ))}
                </div>
            </div>
        );
    };
    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white rounded-2xl">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Détails du Serveur</h1>
                    <p className="text-xs text-gray-600">Configuration complète du serveur</p>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Image Section */}
                    <div className="mb-8 lg:mb-0">
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                            {server.image ? (
                                <img
                                    className="w-full h-64 object-contain rounded-md"
                                    src={`/storage/${server.image.url}`}
                                    alt={server.name}
                                />
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center text-gray-400">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nom</label>
                                    <p className="text-gray-900">{server.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Marque</label>
                                    <p className="text-gray-900">{server.brand.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Modèle</label>
                                    <p className="text-gray-900">{server.model}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Prix</label>
                                    <p className="text-gray-900">{server.price} DH</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Socket CPU</label>
                                    <p className="text-gray-900">{server.cpu_socket}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Format</label>
                                    <p className="text-gray-900">{server.form_factor}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Technical Specs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Slots RAM</label>
                                    <p className="text-gray-900">{server.ram_slots}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Slots stockage</label>
                                    <p className="text-gray-900">{server.storage_slots}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Type alimentation</label>
                                    <p className="text-gray-900">{server.power_supply_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Montable en rack</label>
                                    <p className="text-gray-900">{server.rack_mountable ? 'Oui' : 'Non'}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Components */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderComponentList(server.rams, 'RAM')}
                            {renderComponentList(server.processors, 'Processeurs')}
                            {renderComponentList(server.hard_drives, 'Disques durs')}
                            {renderComponentList(server.power_supplies, 'Alimentations')}
                            {renderComponentList(server.motherboards, 'Cartes mères')}
                            {renderComponentList(server.network_cards, 'Cartes réseau')}
                            {renderComponentList(server.raid_controllers, 'Contrôleurs RAID')}
                            {renderComponentList(server.cooling_solutions, 'Refroidissement')}
                            {renderComponentList(server.chassis, 'Châssis')}
                            {renderComponentList(server.graphic_cards, 'Cartes graphiques')}
                            {renderComponentList(server.fiber_optic_cards, 'Cartes fibre optique')}
                            {renderComponentList(server.expansion_cards, "Cartes d'expansion")}
                            {renderComponentList(server.cable_connectors, 'Câbles')}
                            {renderComponentList(server.batteries, 'Batteries')}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Link
                                href="/servers"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Retour à la liste
                            </Link>
                            {can(user, 'Edit_Servers') && (
                                <Link
                                    href={`/servers/${server.id}/edit`}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Modifier le serveur
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

