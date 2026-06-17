import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShoppingBag, Sparkles, CalendarDays, Store, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

type Stats = {
    products: number;
    products_active: number;
    services: number;
    services_active: number;
    bookings: number;
    bookings_pending: number;
    branches: number;
    users: number;
};

type Booking = {
    id: number;
    booking_number: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    date: string | null;
    total_price: number;
    created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function Dashboard({ stats, latest_bookings }: { stats: Stats; latest_bookings: Booking[] }) {
    const statCards = [
        {
            label: 'Total Produk',
            value: stats.products,
            sub: `${stats.products_active} aktif`,
            icon: ShoppingBag,
            gradient: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50',
            href: '/admin/products'
        },
        {
            label: 'Layanan',
            value: stats.services,
            sub: `${stats.services_active} aktif`,
            icon: Sparkles,
            gradient: 'from-purple-500 to-purple-600',
            lightBg: 'bg-purple-50',
            href: '/admin/services'
        },
        {
            label: 'Booking',
            value: stats.bookings,
            sub: `${stats.bookings_pending} pending`,
            icon: CalendarDays,
            gradient: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50',
            href: '/admin/bookings'
        },
        {
            label: 'Cabang',
            value: stats.branches,
            sub: `${stats.users} user`,
            icon: Store,
            gradient: 'from-green-500 to-green-600',
            lightBg: 'bg-green-50',
            href: '/admin/branches'
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-accent to-accent/90 rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Selamat Datang di Admin Panel</h2>
                        <p className="text-white/90 text-sm">Kelola seluruh operasional JJ Pet House dari sini</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                            <Users size={40} className="text-white/80" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -mr-8 -mt-8`}></div>
                            <div className="relative">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.lightBg} group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} className={`bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`} style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                                    </div>
                                    <ArrowUpRight size={18} className="text-gray-400 group-hover:text-accent transition-colors" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Latest bookings */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-accent" />
                        Booking Terbaru
                    </h2>
                    <Link href="/admin/bookings" className="text-sm text-accent hover:text-accent/80 font-medium flex items-center gap-1 transition-colors">
                        Lihat Semua
                        <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-6 py-3 text-left font-semibold">No. Booking</th>
                                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                                <th className="px-6 py-3 text-left font-semibold">Status</th>
                                <th className="px-6 py-3 text-left font-semibold">Tanggal</th>
                                <th className="px-6 py-3 text-right font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latest_bookings.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <CalendarDays size={32} className="text-gray-300" />
                                        <p>Belum ada booking</p>
                                    </div>
                                </td></tr>
                            )}
                            {latest_bookings.map((b) => (
                                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{b.booking_number}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900">{b.customer_name}</p>
                                        <p className="text-xs text-gray-500">{b.customer_phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[b.status] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {STATUS_LABELS[b.status] ?? b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">{b.date ?? '-'}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatRupiah(b.total_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
