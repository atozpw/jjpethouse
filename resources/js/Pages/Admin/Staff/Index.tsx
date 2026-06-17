import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

type Staff = {
    id: number;
    branch_id: number | null;
    branch_name: string | null;
    type: string;
    name: string;
    specialty: string | null;
    image: string | null;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

export default function StaffIndex({
    staff,
    filters,
}: {
    staff: Paginated<Staff>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/staff', { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus staff "${name}"?`)) {
            router.delete(`/admin/staff/${id}`);
        }
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            doctor: 'Dokter',
            groomer: 'Groomer',
            staff: 'Staff',
        };
        return types[type] || type;
    };

    return (
        <AdminLayout title="Staff">
            <Head title="Admin - Staff" />

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari staff..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">Cari</button>
                </form>
                <Link href="/admin/staff/create" className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90">
                    <Plus size={16} />Tambah Staff
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <th className="px-4 py-3 text-left">Foto</th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">Tipe</th>
                                <th className="px-4 py-3 text-left">Cabang</th>
                                <th className="px-4 py-3 text-left">Spesialisasi</th>
                                <th className="px-4 py-3 text-center">Aktif</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Tidak ada staff</td></tr>
                            )}
                            {staff.data.map((s) => (
                                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <img src={s.image ?? '/placeholder-user.jpg'} alt={s.name} className="w-10 h-10 object-cover rounded-full border border-gray-100" />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            s.type === 'doctor' ? 'bg-blue-50 text-blue-600' :
                                            s.type === 'groomer' ? 'bg-purple-50 text-purple-600' :
                                            'bg-gray-50 text-gray-600'
                                        }`}>
                                            {getTypeLabel(s.type)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{s.branch_name ?? '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.specialty ?? '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        {s.active ? <CheckCircle size={16} className="text-green-500 mx-auto" /> : <XCircle size={16} className="text-red-400 mx-auto" />}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/admin/staff/${s.id}/edit`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></Link>
                                            <button onClick={() => handleDelete(s.id, s.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {staff.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Total {staff.total} staff</p>
                        <div className="flex gap-1">
                            {staff.links.map((link, i) => (
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
