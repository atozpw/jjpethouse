import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Textarea, Toggle,
    FormSection, ImagePreview, FormActions,
} from '@/Components/Admin/FormField';

type Category = {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    active: boolean;
};

export default function ProductCategoryForm({ category }: { category: Category | null }) {
    const isEdit = !!category;
    const { data, setData, post, patch, processing, errors } = useForm({
        name: category?.name ?? '',
        description: category?.description ?? '',
        image: category?.image ?? '',
        active: category?.active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/product-categories/${category.id}`) : post('/admin/product-categories');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Kategori Produk' : 'Tambah Kategori Produk'}>
            <Head title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />
            <div className="mb-5">
                <Link
                    href="/admin/product-categories"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Kategori
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <FormSection title="Informasi Kategori" description="Data utama kategori produk">
                    <div className="space-y-3">
                        <Field label="Nama Kategori" required error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Masukkan nama kategori..."
                            />
                        </Field>
                        <Field label="Deskripsi">
                            <Textarea
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi singkat kategori..."
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection title="Gambar Kategori" description="URL gambar representasi kategori">
                    <Field label="URL Gambar">
                        <Input
                            value={data.image}
                            onChange={e => setData('image', e.target.value)}
                            placeholder="https://... atau /image/kategori.jpg"
                        />
                    </Field>
                    <ImagePreview src={data.image} />
                </FormSection>

                <FormSection title="Status">
                    <Toggle
                        checked={data.active}
                        onChange={v => setData('active', v)}
                        label="Kategori Aktif"
                        description="Kategori yang aktif akan tampil di halaman Pet Shop"
                    />
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/product-categories" />
            </form>
        </AdminLayout>
    );
}
