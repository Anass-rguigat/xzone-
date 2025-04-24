import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

export default function UpdatePasswordForm() {
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: React.FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Mettre à jour le mot de passe
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Assurez-vous d'utiliser un mot de passe long et aléatoire pour rester en sécurité.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <InputLabel htmlFor="current_password" value="Mot de passe actuel *" />
                    <TextInput
                        id="current_password"
                        type="password"
                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Nouveau mot de passe *" />
                        <TextInput
                            id="password"
                            type="password"
                            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe *" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
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