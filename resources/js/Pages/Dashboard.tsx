import { Head, Link } from '@inertiajs/react';
import { Header } from '@/Components/Header';
import { Footer } from '@/Components/Footer';
import { User, Calendar, ShoppingBag, Heart } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <Header />

            <main className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                            <p className="text-muted-foreground">Kelola akun dan aktivitas Anda</p>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <Link
                                href="/profile"
                                className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <User className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Profil</h3>
                                        <p className="text-sm text-muted-foreground">Edit profil Anda</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/booking"
                                className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Calendar className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Booking</h3>
                                        <p className="text-sm text-muted-foreground">Buat booking baru</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/cart"
                                className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <ShoppingBag className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Keranjang</h3>
                                        <p className="text-sm text-muted-foreground">Lihat keranjang</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/pet-shop"
                                className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Heart className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Pet Shop</h3>
                                        <p className="text-sm text-muted-foreground">Belanja kebutuhan pet</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4">Aktivitas Terbaru</h2>
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                    <Calendar size={32} className="text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground mb-4">Belum ada aktivitas</p>
                                <Link
                                    href="/booking"
                                    className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Buat Booking Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
