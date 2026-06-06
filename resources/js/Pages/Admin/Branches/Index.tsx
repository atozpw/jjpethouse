import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle, Star } from 'lucide-react';

type Branch = {
    id: number;
    name: string;
    phone: string | null;
    whatsapp: string | null;
    weekday_hours: string | null;
    weekend_hours: string | null;
    featured: boolean;
    active: boolean;
    image: string | null;
    city_name: string | null;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

export default function BranchesIndex({
    branches,
    filters,
}: {
    branches: Paginated<Branch>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/branches', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus cabang "${name}"?`)) {
            router.delete(`/admin/branches/${id}`);
        }
    };

    return (
        <AdminLayout title="Cabang">
            <Head title="Admin - Cabang" />

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari cabang..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">Cari</button>
                </form>
                <Link href="/admin/branches/create" className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">
                    <Plus size={16} />Tambah Cabang
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-4 py-3 text-left">Gambar</th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">Kota</th>
                                <th className="px-4 py-3 text-left">Telepon</th>
                                <th className="px-4 py-3 text-left">Jam Buka</th>
                                <th className="px-4 py-3 text-center">Featured</th>
                                <th className="px-4 py-3 text-center">Aktif</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.data.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Tidak ada cabang</td></tr>
                            )}
                            {branches.data.map((b) => (
                                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <img src={b.image ?? '/no-image.png'} alt={b.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{b.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{b.city_name ?? '-'}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{b.phone ?? '-'}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{b.weekday_hours ?? '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        {b.featured ? <Star size={16} className="text-yellow-400 fill-yellow-400 mx-auto" /> : <span className="text-gray-300">-</span>}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {b.active ? <CheckCircle size={16} className="text-green-500 mx-auto" /> : <XCircle size={16} className="text-red-400 mx-auto" />}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/admin/branches/${b.id}/edit`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></Link>
                                            <button onClick={() => handleDelete(b.id, b.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {branches.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total {branches.total} cabang</p>
                        <div className="flex gap-1">
                            {branches.links.map((link, i) => (
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
