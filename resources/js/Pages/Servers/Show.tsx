import { Layout } from '@/Layouts/layout';
import { Link } from '@inertiajs/react';

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
    return (
        <Layout>
            <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 p-2">
                Détails du Serveur
            </h2>
            <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                            {server.image ? (
                                <img
                                    className="w-full dark:hidden"
                                    src={`/storage/${server.image.url}`}
                                    alt={server.name}
                                />
                            ) : (
                                <img
                                    className="w-full dark:hidden"
                                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                                    alt="Placeholder Image"
                                />
                            )}
                        </div>

                        <div className="mt-6 sm:mt-8 lg:mt-0">
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                                {server.name}
                            </h1>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                                    {server.price} €
                                </p>
                            </div>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                            <div className="mt-6 sm:gap-4 sm:items-start sm:flex sm:mt-8 flex-col space-y-4">
                                <div>
                                    <strong>Marque:</strong> {server.brand.name}
                                </div>
                                <div>
                                    <strong>Modèle:</strong> {server.model}
                                </div>
                                <div>
                                    <strong>CPU Socket:</strong> {server.cpu_socket}
                                </div>
                                <div>
                                    <strong>Form Factor:</strong> {server.form_factor}
                                </div>

                                {server.rams?.length > 0 && (
                                    <div>
                                        <strong>RAM:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.rams.map((ram) => (
                                                <li key={ram.id}>{ram.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.processors?.length > 0 && (
                                    <div>
                                        <strong>Processeurs:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.processors.map((processor) => (
                                                <li key={processor.id}>
                                                    {processor.name} ({processor.model}) - {processor.core_count} cores, {processor.thread_count} threads
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.hard_drives?.length > 0 && (
                                    <div>
                                        <strong>Disque dur :</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.hard_drives.map((hard_drive) => (
                                                <li key={hard_drive.id}>
                                                    {hard_drive.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.power_supplies?.length > 0 && (
                                    <div>
                                        <strong>Alimentations:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.power_supplies.map((powerSupply) => (
                                                <li key={powerSupply.id}>
                                                    {powerSupply.name} - {powerSupply.wattage} W
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.motherboards?.length > 0 && (
                                    <div>
                                        <strong>Cartes mères:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.motherboards.map((motherboard) => (
                                                <li key={motherboard.id}>{motherboard.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.network_cards?.length > 0 && (
                                    <div>
                                        <strong>Cartes réseau:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.network_cards.map((networkCard) => (
                                                <li key={networkCard.id}>{networkCard.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.raid_controllers?.length > 0 && (
                                    <div>
                                        <strong>Contrôleurs RAID:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.raid_controllers.map((raidController) => (
                                                <li key={raidController.id}>{raidController.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.cooling_solutions?.length > 0 && (
                                    <div>
                                        <strong>Systèmes de refroidissement:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.cooling_solutions.map((coolingSolution) => (
                                                <li key={coolingSolution.id}>{coolingSolution.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.chassis?.length > 0 && (
                                    <div>
                                        <strong>Châssis:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.chassis.map((chassis) => (
                                                <li key={chassis.id}>{chassis.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.graphic_cards?.length > 0 && (
                                    <div>
                                        <strong>Cartes graphiques:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.graphic_cards.map((graphicCard) => (
                                                <li key={graphicCard.id}>{graphicCard.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.fiber_optic_cards?.length > 0 && (
                                    <div>
                                        <strong>Cartes fibre optique:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.fiber_optic_cards.map((fiberOpticCard) => (
                                                <li key={fiberOpticCard.id}>{fiberOpticCard.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.expansion_cards?.length > 0 && (
                                    <div>
                                        <strong>Cartes d'expansion:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.expansion_cards.map((expansionCard) => (
                                                <li key={expansionCard.id}>{expansionCard.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.cable_connectors?.length > 0 && (
                                    <div>
                                        <strong>Câbles:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.cable_connectors.map((cable) => (
                                                <li key={cable.id}>{cable.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {server.batteries?.length > 0 && (
                                    <div>
                                        <strong>Batteries:</strong>
                                        <ul className="ml-4 list-disc">
                                            {server.batteries.map((battery) => (
                                                <li key={battery.id}>{battery.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                                <Link
                                    href={`/servers/${server.id}/edit`}
                                    className="text-green-900 hover:text-white border border-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                                    role="button"
                                >
                                    Modifier
                                </Link>

                                <Link
                                    href="/servers"
                                    className=" text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                                    role="button"
                                >
                                    Retour à la liste
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

