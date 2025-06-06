import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informations du Profil
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Mettez à jour vos informations de profil et votre adresse email.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nom complet *" />
                        <TextInput
                            id="name"
                            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email *" />
                        <TextInput
                            id="email"
                            type="email"
                            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-1" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-800">
                            Votre adresse email n'est pas vérifiée.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 text-sm text-blue-600 underline hover:text-blue-700"
                            >
                                Renvoyer l'email de vérification
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm text-green-600">
                                Un nouveau lien de vérification a été envoyé à votre adresse email.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 ">
                    <PrimaryButton disabled={processing}>
                        Sauvegarder
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Sauvegardé</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}