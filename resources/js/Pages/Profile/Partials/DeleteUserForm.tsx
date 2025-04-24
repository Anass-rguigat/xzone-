import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser: React.FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Supprimer le compte
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Une fois votre compte supprimé, toutes ses ressources et données seront définitivement effacées.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Supprimer le compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Êtes-vous sûr de vouloir supprimer votre compte?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Entrez votre mot de passe pour confirmer la suppression définitive de votre compte.
                    </p>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Mot de passe *" className="sr-only" />
                        <TextInput
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Mot de passe"
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Annuler
                        </SecondaryButton>
                        <DangerButton disabled={processing}>
                            {processing ? 'Suppression...' : 'Supprimer le compte'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}