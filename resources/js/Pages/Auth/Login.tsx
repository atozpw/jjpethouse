import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Login" />

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <Link href="/">
                            <img src="/logo.png" alt="JJ Pet House" className="h-16 w-auto mx-auto" />
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Selamat Datang</h2>
                        <p className="mt-2 text-sm text-gray-600">Silakan login untuk melanjutkan</p>
                    </div>

                    {status && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                                    placeholder="nama@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                                    placeholder="Masukkan password"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked as false)}
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Memproses...' : 'Login'}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="font-medium text-accent hover:text-accent/80 transition-colors">
                                    Daftar sekarang
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image/Brand */}
            <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-accent to-accent/80 relative">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-white space-y-6 max-w-lg">
                        <h1 className="text-4xl font-bold">JJ Pet House</h1>
                        <p className="text-xl text-white/90">
                            Platform terpercaya untuk semua kebutuhan hewan peliharaan Anda
                        </p>
                        <div className="space-y-3 pt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                <div>
                                    <h3 className="font-semibold">Layanan Grooming Profesional</h3>
                                    <p className="text-sm text-white/80">Tim groomer berpengalaman siap merawat hewan kesayangan Anda</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                <div>
                                    <h3 className="font-semibold">Klinik Hewan 24/7</h3>
                                    <p className="text-sm text-white/80">Dokter hewan profesional siap melayani kapan saja</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                <div>
                                    <h3 className="font-semibold">Pet Shop Lengkap</h3>
                                    <p className="text-sm text-white/80">Berbagai kebutuhan hewan peliharaan tersedia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
