import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Toggle,
    FormSection, FormActions,
} from '@/Components/Admin/FormField';

type PetType = {
    id: number;
    name: string;
    slug: string;
    active: boolean;
};

export default function PetTypeForm({
    petType
}: {
    petType: PetType | null
}) {
    const isEdit = !!petType;
    const { data, setData, post, patch, processing, errors } = useForm({
        name: petType?.name ?? '',
        active: petType?.active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/pet-types/${petType.id}`) : post('/admin/pet-types');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Jenis Hewan' : 'Tambah Jenis Hewan'}>
            <Head title={isEdit ? 'Edit Jenis Hewan' : 'Tambah Jenis Hewan'} />
            <div className="mb-5">
                <Link
                    href="/admin/pet-types"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Jenis Hewan
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Info utama */}
                <FormSection title="Informasi Jenis Hewan" description="Nama dan status jenis hewan">
                    <Field label="Nama Jenis Hewan" required error={errors.name}>
                        <Input
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Contoh: Anjing, Kucing, Burung, Hamster"
                        />
                    </Field>
                    {isEdit && petType && (
                        <Field label="Slug" hint="Otomatis generate dari nama">
                            <Input
                                value={petType.slug}
                                disabled
                                className="bg-gray-50"
                            />
                        </Field>
                    )}
                </FormSection>

                {/* Status */}
                <FormSection title="Status">
                    <Toggle
                        checked={data.active}
                        onChange={v => setData('active', v)}
                        label="Jenis Hewan Aktif"
                        description="Jenis hewan yang aktif akan muncul di form booking dan service items"
                    />
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/pet-types" />
            </form>
        </AdminLayout>
    );
}
