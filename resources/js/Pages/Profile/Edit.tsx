
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Layout } from '@/Layouts/Layout';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <Layout>
            <Head title="Profile" />

            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Modifier le Profil</h1>
                    <p className="text-xs text-gray-600">Mettez à jour vos informations de profil et votre mot de passe</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <UpdatePasswordForm />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
}