import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShoppingBag, Sparkles, CalendarDays, Store, TrendingUp } from 'lucide-react';

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
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function Dashboard({ stats, latest_bookings }: { stats: Stats; latest_bookings: Booking[] }) {
    const statCards = [
        { label: 'Total Produk', value: stats.products, sub: `${stats.products_active} aktif`, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
        { label: 'Layanan', value: stats.services, sub: `${stats.services_active} aktif`, icon: Sparkles, color: 'bg-purple-50 text-purple-600', href: '/admin/services' },
        { label: 'Booking', value: stats.bookings, sub: `${stats.bookings_pending} pending`, icon: CalendarDays, color: 'bg-yellow-50 text-yellow-600', href: '/admin/bookings' },
        { label: 'Cabang', value: stats.branches, sub: `${stats.users} user terdaftar`, icon: Store, color: 'bg-green-50 text-green-600', href: '/admin/branches' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} href={card.href} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Latest bookings */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                        <TrendingUp size={16} className="text-accent" />
                        Booking Terbaru
                    </h2>
                    <Link href="/admin/bookings" className="text-xs text-accent hover:underline font-medium">Lihat Semua</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-5 py-3 text-left">No. Booking</th>
                                <th className="px-5 py-3 text-left">Customer</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-left">Tanggal</th>
                                <th className="px-5 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latest_bookings.length === 0 && (
                                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Belum ada booking</td></tr>
                            )}
                            {latest_bookings.map((b) => (
                                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs">{b.booking_number}</td>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-gray-800">{b.customer_name}</p>
                                        <p className="text-xs text-gray-400">{b.customer_phone}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 text-xs">{b.date ?? '-'}</td>
                                    <td className="px-5 py-3 text-right font-medium text-gray-800">{formatRupiah(b.total_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
