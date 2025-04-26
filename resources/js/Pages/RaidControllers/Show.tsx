
import { Layout } from '@/Layouts/layout';
import { Link } from '@inertiajs/react';

interface Brand {
    id: number;
    name: string;
}

interface Server {
    id: number;
    name: string;
}

interface Image {
    url: string;
}

interface RaidController {
    id: number;
    name: string;
    model: string;
    supported_levels: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    price: string;
}

interface Props {
    raidController: RaidController;
}

export default function Show({ raidController }: Props) {
    return (
        <Layout>
            <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200 p-2">
                Détails du RAID Controller
            </h2>
            <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                            {raidController.image ? (
                                <img
                                    className="w-full dark:hidden"
                                    src={`/storage/${raidController.image.url}`}
                                    alt={raidController.name}
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
                                {raidController.name}
                            </h1>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                                    Prix {raidController.price} €
                                </p>
                            </div>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                            <div className="mt-6 sm:gap-4 sm:items-start sm:flex sm:mt-8 flex-col space-y-4">
                                <div>
                                    <strong>Modèle:</strong> {raidController.model}
                                </div>
                                <div>
                                    <strong>Niveaux supportés:</strong> {raidController.supported_levels}
                                </div>
                                <div>
                                    <strong>Marque:</strong> {raidController.brand.name}
                                </div>

                                {raidController.servers.length > 0 && (
                                    <div className="mt-4">
                                        <strong>Serveurs Associés:</strong>
                                        <ul className="ml-4 list-disc">
                                            {raidController.servers.map((server) => (
                                                <li key={server.id}>{server.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                                

                                <Link
                                    href="/raid-controllers"
                                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                                    role="button"
                                >
                                    Retour à la liste
                                </Link>
                            </div>
                            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
