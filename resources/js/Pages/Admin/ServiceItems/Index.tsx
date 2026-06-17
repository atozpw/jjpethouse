import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

type ServiceItem = {
    id: number;
    service_id: number;
    service_name: string;
    name: string;
    price: number;
    type: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function ServiceItemsIndex({
    serviceItems,
    filters,
}: {
    serviceItems: Paginated<ServiceItem>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/service-items', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus item layanan "${name}"?`)) {
            router.delete(`/admin/service-items/${id}`);
        }
    };

    return (
        <AdminLayout title="Item Layanan">
            <Head title="Admin - Item Layanan" />

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari item layanan..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">Cari</button>
                </form>
                <Link href="/admin/service-items/create" className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">
                    <Plus size={16} />Tambah Item
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-4 py-3 text-left">Layanan</th>
                                <th className="px-4 py-3 text-left">Nama Item</th>
                                <th className="px-4 py-3 text-left">Tipe</th>
                                <th className="px-4 py-3 text-right">Harga</th>
                                <th className="px-4 py-3 text-center">Aktif</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceItems.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Tidak ada item layanan</td></tr>
                            )}
                            {serviceItems.data.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-600">{item.service_name}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            item.type === 'main' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                            {item.type === 'main' ? 'Utama' : 'Tambahan'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">{formatRupiah(item.price)}</td>
                                    <td className="px-4 py-3 text-center">
                                        {item.active ? <CheckCircle size={16} className="text-green-500 mx-auto" /> : <XCircle size={16} className="text-red-400 mx-auto" />}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/admin/service-items/${item.id}/edit`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></Link>
                                            <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {serviceItems.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total {serviceItems.total} item layanan</p>
                        <div className="flex gap-1">
                            {serviceItems.links.map((link, i) => (
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
