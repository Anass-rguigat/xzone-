import { Link } from '@inertiajs/react';
import { Layout } from '@/Layouts/layout';

interface Supplier {
    id: number;
    name: string;
    contact_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
}

interface Props {
    supplier: Supplier;
}

export default function Show({ supplier }: Props) {
    return (
        <Layout>
            <h2 className="text-3xl font-semibold leading-tight text-gray-800 p-2">
                Détails du Fournisseur
            </h2>

            <section className="py-8 bg-white md:py-16 antialiased">
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                        <div className="mt-6 sm:mt-8 lg:mt-0">
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                                {supplier.name}
                            </h1>
                            <hr className="my-6 md:my-8 border-gray-200" />

                            <div className="mt-6 sm:gap-4 sm:items-start sm:flex sm:mt-8 flex-col space-y-4">
                                <div>
                                    <strong>Contact:</strong> {supplier.contact_name}
                                </div>
                                <div>
                                    <strong>Email:</strong> {supplier.email}
                                </div>
                                <div>
                                    <strong>Téléphone:</strong> {supplier.phone}
                                </div>
                                <div>
                                    <strong>Adresse:</strong> {supplier.address}
                                </div>
                                <div>
                                    <strong>Ville:</strong> {supplier.city}
                                </div>
                                <div>
                                    <strong>Pays:</strong> {supplier.country}
                                </div>
                            </div>

                            <hr className="my-6 md:my-8 border-gray-200" />

                            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                               

                                <Link
                                    href="/suppliers"
                                    className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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