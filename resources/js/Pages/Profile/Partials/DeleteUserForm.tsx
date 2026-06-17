import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
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

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                    Hapus Akun
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Setelah akun Anda dihapus, semua data dan informasi akan dihapus secara permanen.
                    Sebelum menghapus akun, silakan unduh data atau informasi yang ingin Anda simpan.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="text-sm text-muted-foreground mb-6">
                        Setelah akun Anda dihapus, semua data akan dihapus secara permanen.
                        Masukkan password Anda untuk mengkonfirmasi penghapusan akun.
                    </p>

                    <div className="mb-6">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            autoFocus
                            placeholder="Masukkan password"
                        />

                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hapus Akun
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
