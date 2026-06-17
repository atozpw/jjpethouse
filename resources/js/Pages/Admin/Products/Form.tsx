import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
    Field, Input, Textarea, Toggle,
    FormSection, FormActions,
} from '@/Components/Admin/FormField';
import ImageUpload from '@/Components/Admin/ImageUpload';

type Category = { id: number; name: string };
type Variant = { name: string; price: number; sku: string | null; stock: number };
type Product = {
    id: number;
    name: string;
    category_ids: number[];
    description: string | null;
    brand: string | null;
    pet_type: string | null;
    price: number;
    sku: string | null;
    stock: number;
    weight: number | null;
    images: string[];
    variants: Variant[];
    is_active: boolean;
};

export default function ProductForm({
    categories,
    product,
}: {
    categories: Category[];
    product: Product | null;
}) {
    const isEdit = !!product;
    const { data, setData, post, patch, processing, errors } = useForm({
        name: product?.name ?? '',
        category_ids: product?.category_ids ?? [],
        description: product?.description ?? '',
        brand: product?.brand ?? '',
        pet_type: product?.pet_type ?? '',
        price: product?.price ?? 0,
        sku: product?.sku ?? '',
        stock: product?.stock ?? 0,
        weight: product?.weight ?? 0,
        images: product?.images?.length ? product.images : [''],
        variants: product?.variants ?? [],
        is_active: product?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/products/${product.id}`) : post('/admin/products');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Produk' : 'Tambah Produk'}>
            <Head title={isEdit ? 'Edit Produk' : 'Tambah Produk'} />

            <div className="mb-5">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Produk
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Informasi Utama */}
                <FormSection title="Informasi Produk" description="Nama, kategori, dan identifikasi produk">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Nama Produk" required error={errors.name} className="sm:col-span-2">
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Masukkan nama produk..."
                            />
                        </Field>
                        <Field label="Kategori / Tag" className="sm:col-span-2" hint="Produk dapat memiliki lebih dari satu kategori">
                            <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                                {categories.map((category) => {
                                    const checked = data.category_ids.includes(category.id);
                                    return (
                                        <label
                                            key={category.id}
                                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                                checked
                                                    ? 'border-accent bg-accent text-white'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-accent/50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={checked}
                                                onChange={() => setData(
                                                    'category_ids',
                                                    checked
                                                        ? data.category_ids.filter(id => id !== category.id)
                                                        : [...data.category_ids, category.id],
                                                )}
                                            />
                                            {category.name}
                                        </label>
                                    );
                                })}
                            </div>
                        </Field>
                        <Field label="Brand">
                            <Input
                                value={data.brand}
                                onChange={e => setData('brand', e.target.value)}
                                placeholder="Nama brand..."
                            />
                        </Field>
                        <Field label="Jenis Hewan">
                            <Input
                                value={data.pet_type}
                                onChange={e => setData('pet_type', e.target.value)}
                                placeholder="Anjing, Kucing, Burung..."
                            />
                        </Field>
                        <Field label="SKU">
                            <Input
                                value={data.sku}
                                onChange={e => setData('sku', e.target.value)}
                                placeholder="Kode unik produk"
                            />
                        </Field>
                        <Field label="Deskripsi" className="sm:col-span-2">
                            <Textarea
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi lengkap produk..."
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Harga & Stok */}
                <FormSection title="Harga & Stok" description="Informasi harga, stok, dan berat">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field label="Harga (Rp)" required error={errors.price}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">Rp</span>
                                <Input
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={e => setData('price', Number(e.target.value))}
                                    className="pl-8"
                                />
                            </div>
                        </Field>
                        <Field label="Stok" required>
                            <Input
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={e => setData('stock', Number(e.target.value))}
                                placeholder="0"
                            />
                        </Field>
                        <Field label="Berat (gram)">
                            <Input
                                type="number"
                                min="0"
                                value={data.weight}
                                onChange={e => setData('weight', Number(e.target.value))}
                                placeholder="0"
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Gambar */}
                <FormSection title="Galeri Produk" description="Gambar pertama digunakan sebagai gambar utama">
                    <div className="space-y-3">
                        {data.images.map((image, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="flex-1">
                                    <Field label={`Gambar ${index + 1}`}>
                                        <ImageUpload
                                            value={image}
                                            onChange={url => {
                                                const images = [...data.images];
                                                images[index] = url;
                                                setData('images', images);
                                            }}
                                            folder="products"
                                        />
                                    </Field>
                                </div>
                                {data.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setData('images', data.images.filter((_, imageIndex) => imageIndex !== index))}
                                        className="mt-5 rounded-md p-2 text-red-500 hover:bg-red-50"
                                        aria-label="Hapus gambar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setData('images', [...data.images, ''])}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                            <Plus size={14} /> Tambah Gambar
                        </button>
                    </div>
                </FormSection>

                <FormSection title="Varian Produk" description="Opsional, misalnya ukuran, rasa, atau warna">
                    <div className="space-y-3">
                        {data.variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-4">
                                <Field label="Nama Varian">
                                    <Input
                                        value={variant.name}
                                        onChange={e => {
                                            const variants = [...data.variants];
                                            variants[index] = { ...variant, name: e.target.value };
                                            setData('variants', variants);
                                        }}
                                        placeholder="Ukuran: M"
                                    />
                                </Field>
                                <Field label="Harga">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={variant.price}
                                        onChange={e => {
                                            const variants = [...data.variants];
                                            variants[index] = { ...variant, price: Number(e.target.value) };
                                            setData('variants', variants);
                                        }}
                                    />
                                </Field>
                                <Field label="SKU">
                                    <Input
                                        value={variant.sku ?? ''}
                                        onChange={e => {
                                            const variants = [...data.variants];
                                            variants[index] = { ...variant, sku: e.target.value };
                                            setData('variants', variants);
                                        }}
                                    />
                                </Field>
                                <div className="flex items-end gap-2">
                                    <Field label="Stok" className="flex-1">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={variant.stock}
                                            onChange={e => {
                                                const variants = [...data.variants];
                                                variants[index] = { ...variant, stock: Number(e.target.value) };
                                                setData('variants', variants);
                                            }}
                                        />
                                    </Field>
                                    <button
                                        type="button"
                                        onClick={() => setData('variants', data.variants.filter((_, variantIndex) => variantIndex !== index))}
                                        className="mb-0.5 rounded-md p-2 text-red-500 hover:bg-red-50"
                                        aria-label="Hapus varian"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setData('variants', [
                                ...data.variants,
                                { name: '', price: Number(data.price), sku: '', stock: Number(data.stock) },
                            ])}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                            <Plus size={14} /> Tambah Varian
                        </button>
                    </div>
                </FormSection>

                {/* Status */}
                <FormSection title="Status Produk">
                    <Toggle
                        checked={data.is_active}
                        onChange={v => setData('is_active', v)}
                        label="Produk Aktif"
                        description="Produk akan tampil di halaman Pet Shop"
                    />
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/products" />
            </form>
        </AdminLayout>
    );
}
