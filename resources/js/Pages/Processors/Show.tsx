import { Link, usePage } from '@inertiajs/react';
import { Layout } from '@/Layouts/layout';
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

interface Server {
    id: number;
    name: string;
}

interface Processor {
    id: number;
    name: string;
    brand: Brand;
    image?: Image;
    servers: Server[];
    model: string;
    core_count: number;
    thread_count: number;
    base_clock: string;
    boost_clock: string;
    socket: string;
    thermal_design_power: number;
    price: number;
}

interface Props {
    processor: Processor;
}

export default function Show({ processor }: Props) {
    const { flash, auth } = usePage().props;
    const user = auth.user;
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);
    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white rounded-2xl">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Détails du Processeur</h1>
                    <p className="text-xs text-gray-600">Informations techniques détaillées</p>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Image Section */}
                    <div className="mb-8 lg:mb-0">
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                            {processor.image ? (
                                <img
                                    className="w-full h-64 object-contain rounded-md"
                                    src={`/storage/${processor.image.url}`}
                                    alt={processor.name}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nom</label>
                                    <p className="text-gray-900">{processor.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Marque</label>
                                    <p className="text-gray-900">{processor.brand.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Modèle</label>
                                    <p className="text-gray-900">{processor.model}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Prix</label>
                                    <p className="text-gray-900">{processor.price} DH</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Socket</label>
                                    <p className="text-gray-900">{processor.socket}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Consommation</label>
                                    <p className="text-gray-900">{processor.thermal_design_power} W</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Technical Specs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Cœurs</label>
                                    <p className="text-gray-900">{processor.core_count}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Threads</label>
                                    <p className="text-gray-900">{processor.thread_count}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fréquence de base</label>
                                    <p className="text-gray-900">{processor.base_clock} GHz</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Fréquence turbo</label>
                                    <p className="text-gray-900">{processor.boost_clock} GHz</p>
                                </div>
                            </div>
                        </div>

                        {processor.servers.length > 0 && (
                            <>
                                <hr className="border-gray-200" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Serveurs compatibles</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {processor.servers.map((server) => (
                                            <span 
                                                key={server.id}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {server.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Link
                                href="/processors"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Retour à la liste
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
