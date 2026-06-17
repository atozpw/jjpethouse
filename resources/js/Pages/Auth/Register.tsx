import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Daftar" />

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <Link href="/">
                            <img src="/logo.png" alt="JJ Pet House" className="h-16 w-auto mx-auto" />
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
                        <p className="mt-2 text-sm text-gray-600">Daftar untuk memulai perjalanan Anda bersama kami</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

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
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                                    placeholder="Minimal 8 karakter"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Konfirmasi Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                                    placeholder="Ulangi password"
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Memproses...' : 'Daftar'}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="font-medium text-accent hover:text-accent/80 transition-colors">
                                    Login sekarang
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
                        <h1 className="text-4xl font-bold">Bergabung dengan JJ Pet House</h1>
                        <p className="text-xl text-white/90">
                            Nikmati berbagai kemudahan untuk merawat hewan peliharaan kesayangan Anda
                        </p>
                        <div className="space-y-3 pt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                <div>
                                    <h3 className="font-semibold">Booking Online Mudah</h3>
                                    <p className="text-sm text-white/80">Atur jadwal grooming dan klinik kapan saja</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                <div>
                                    <h3 className="font-semibold">Belanja Mudah</h3>
                                    <p className="text-sm text-white/80">Temukan berbagai produk kebutuhan pet Anda</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">✓</div>
                                <div>
                                    <h3 className="font-semibold">Promo Eksklusif</h3>
                                    <p className="text-sm text-white/80">Dapatkan penawaran khusus untuk member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
