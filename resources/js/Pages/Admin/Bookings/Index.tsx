import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Pencil, Trash2 } from 'lucide-react';

type Booking = {
    id: number;
    booking_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    status: string;
    date: string | null;
    total_price: number;
    created_at: string;
    service_name: string | null;
    branch_name: string | null;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function BookingsIndex({
    bookings,
    filters,
}: {
    bookings: Paginated<Booking>;
    filters: { search: string; status: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/bookings', { search, status }, { preserveState: true });
    };

    const handleStatusFilter = (val: string) => {
        setStatus(val);
        router.get('/admin/bookings', { search, status: val }, { preserveState: true });
    };

    const handleStatusChange = (id: number, newStatus: string) => {
        router.patch(`/admin/bookings/${id}/status`, { status: newStatus });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus booking ini?')) {
            router.delete(`/admin/bookings/${id}`);
        }
    };

    return (
        <AdminLayout title="Booking">
            <Head title="Admin - Booking" />

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari no. booking / nama..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">Cari</button>
                </form>
                <div className="flex gap-1.5 flex-wrap">
                    {STATUSES.map(s => (
                        <button
                            key={s || 'all'}
                            onClick={() => handleStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${
                                status === s ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {s || 'Semua'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-4 py-3 text-left">No. Booking</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left">Layanan</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Tanggal</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Tidak ada booking</td></tr>
                            )}
                            {bookings.data.map((b) => (
                                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs">{b.booking_number}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{b.customer_name}</p>
                                        <p className="text-xs text-gray-400">{b.customer_phone}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{b.service_name ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={b.status}
                                            onChange={e => handleStatusChange(b.id, e.target.value)}
                                            className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{b.date ?? '-'}</td>
                                    <td className="px-4 py-3 text-right font-medium">{formatRupiah(b.total_price)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/admin/bookings/${b.id}/edit`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></Link>
                                            <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {bookings.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total {bookings.total} booking</p>
                        <div className="flex gap-1">
                            {bookings.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url} className={`px-2.5 py-1 rounded text-xs font-medium ${link.active ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={i} className="px-2.5 py-1 rounded text-xs text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
