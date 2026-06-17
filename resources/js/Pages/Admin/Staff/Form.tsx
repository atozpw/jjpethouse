import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Select, Textarea, Toggle,
    FormSection, FormActions,
} from '@/Components/Admin/FormField';
import ImageUpload from '@/Components/Admin/ImageUpload';

type Branch = { id: number; name: string };
type Staff = {
    id: number;
    branch_id: number | null;
    type: string;
    name: string;
    specialty: string | null;
    image: string | null;
    active: boolean;
};

const STAFF_TYPES = [
    { value: 'doctor', label: 'Dokter' },
    { value: 'groomer', label: 'Groomer' },
    { value: 'staff', label: 'Staff' },
];

export default function StaffForm({
    branches,
    staff
}: {
    branches: Branch[];
    staff: Staff | null
}) {
    const isEdit = !!staff;
    const { data, setData, post, patch, processing, errors } = useForm({
        branch_id: staff?.branch_id ?? '',
        type: staff?.type ?? 'staff',
        name: staff?.name ?? '',
        specialty: staff?.specialty ?? '',
        image: staff?.image ?? '',
        active: staff?.active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/staff/${staff.id}`) : post('/admin/staff');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Staff' : 'Tambah Staff'}>
            <Head title={isEdit ? 'Edit Staff' : 'Tambah Staff'} />
            <div className="mb-5">
                <Link
                    href="/admin/staff"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Staff
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Info utama */}
                <FormSection title="Informasi Staff" description="Data personal staff">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Nama Staff" required error={errors.name} className="sm:col-span-2">
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nama lengkap staff"
                            />
                        </Field>
                        <Field label="Tipe Staff" required error={errors.type}>
                            <Select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                            >
                                {STAFF_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </Select>
                        </Field>
                        <Field label="Cabang" error={errors.branch_id}>
                            <Select
                                value={data.branch_id}
                                onChange={e => setData('branch_id', e.target.value ? Number(e.target.value) : null as any)}
                            >
                                <option value="">-- Pilih Cabang --</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Spesialisasi" hint="Untuk dokter atau groomer" className="sm:col-span-2">
                            <Textarea
                                rows={3}
                                value={data.specialty}
                                onChange={e => setData('specialty', e.target.value)}
                                placeholder="Contoh: Spesialis Bedah, Grooming Kucing, dll"
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Foto */}
                <FormSection title="Foto Staff">
                    <Field label="Foto Staff">
                        <ImageUpload
                            value={data.image}
                            onChange={url => setData('image', url)}
                            folder="staff"
                        />
                    </Field>
                </FormSection>

                {/* Status */}
                <FormSection title="Status Staff">
                    <Toggle
                        checked={data.active}
                        onChange={v => setData('active', v)}
                        label="Staff Aktif"
                        description="Staff yang aktif bisa ditampilkan dan dipilih saat booking"
                    />
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/staff" />
            </form>
        </AdminLayout>
    );
}
