import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Header } from '@/Components/Header';
import { Footer } from '@/Components/Footer';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <>
            <Head title="Profile" />
            <Header />

            <main className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Profil Saya</h1>
                            <p className="text-muted-foreground">Kelola informasi profil dan keamanan akun Anda</p>
                        </div>

                        {/* Profile Information */}
                        <div className="bg-card rounded-xl border border-border p-6 sm:p-8 mb-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        {/* Update Password */}
                        <div className="bg-card rounded-xl border border-border p-6 sm:p-8 mb-6">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        {/* Delete Account */}
                        <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
