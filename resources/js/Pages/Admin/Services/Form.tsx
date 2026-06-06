import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Select, Textarea, Toggle,
    FormSection, ImagePreview, FormActions,
} from '@/Components/Admin/FormField';

type Category = { id: number; name: string };
type Service = {
    id: number;
    service_category_id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    duration: string | null;
    rating: number;
    url: string | null;
    requires_address: boolean;
    requires_pickup: boolean;
    requires_schedule: boolean;
    branch_required: boolean;
    requires_people: boolean;
    schedule_type: string;
    active: boolean;
};

const TOGGLE_SETTINGS = [
    { key: 'requires_address',  label: 'Butuh Alamat',   desc: 'Customer harus isi alamat' },
    { key: 'requires_pickup',   label: 'Butuh Pickup',   desc: 'Layanan termasuk pickup' },
    { key: 'requires_schedule', label: 'Butuh Jadwal',   desc: 'Customer memilih jadwal' },
    { key: 'branch_required',   label: 'Pilih Cabang',   desc: 'Customer memilih cabang' },
    { key: 'requires_people',   label: 'Butuh Staff',    desc: 'Assign staff ke layanan' },
] as const;

export default function ServiceForm({ categories, service }: { categories: Category[]; service: Service | null }) {
    const isEdit = !!service;
    const { data, setData, post, patch, processing, errors } = useForm({
        service_category_id: service?.service_category_id ?? '',
        name: service?.name ?? '',
        description: service?.description ?? '',
        price: service?.price ?? 0,
        image: service?.image ?? '',
        duration: service?.duration ?? '',
        rating: service?.rating ?? 0,
        url: service?.url ?? '',
        requires_address:  service?.requires_address  ?? false,
        requires_pickup:   service?.requires_pickup   ?? false,
        requires_schedule: service?.requires_schedule ?? true,
        branch_required:   service?.branch_required   ?? true,
        requires_people:   service?.requires_people   ?? false,
        schedule_type: service?.schedule_type ?? 'single',
        active: service?.active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/services/${service.id}`) : post('/admin/services');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Layanan' : 'Tambah Layanan'}>
            <Head title={isEdit ? 'Edit Layanan' : 'Tambah Layanan'} />
            <div className="mb-5">
                <Link
                    href="/admin/services"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Layanan
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Info utama */}
                <FormSection title="Informasi Layanan" description="Nama, kategori, dan deskripsi layanan">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Kategori" required error={errors.service_category_id} className="sm:col-span-2">
                            <Select
                                value={data.service_category_id}
                                onChange={e => setData('service_category_id', Number(e.target.value))}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Nama Layanan" required error={errors.name} className="sm:col-span-2">
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nama layanan..."
                            />
                        </Field>
                        <Field label="Deskripsi" className="sm:col-span-2">
                            <Textarea
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi layanan yang ditampilkan ke customer..."
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Harga & Detail */}
                <FormSection title="Harga & Detail" description="Informasi harga, durasi, dan rating">
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
                        <Field label="Durasi" hint="Contoh: 60 menit, 1-2 jam">
                            <Input
                                value={data.duration}
                                onChange={e => setData('duration', e.target.value)}
                                placeholder="60 menit"
                            />
                        </Field>
                        <Field label="Rating (0–5)">
                            <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={data.rating}
                                onChange={e => setData('rating', Number(e.target.value))}
                                placeholder="4.5"
                            />
                        </Field>
                        <Field label="Tipe Jadwal">
                            <Select
                                value={data.schedule_type}
                                onChange={e => setData('schedule_type', e.target.value)}
                            >
                                <option value="single">Single (satu hari)</option>
                                <option value="range">Range (check-in / check-out)</option>
                            </Select>
                        </Field>
                        <Field label="URL Link" hint="Opsional — halaman detail layanan" className="sm:col-span-2">
                            <Input
                                value={data.url}
                                onChange={e => setData('url', e.target.value)}
                                placeholder="https://..."
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Gambar */}
                <FormSection title="Gambar Layanan">
                    <Field label="URL Gambar">
                        <Input
                            value={data.image}
                            onChange={e => setData('image', e.target.value)}
                            placeholder="https://... atau /image/layanan.jpg"
                        />
                    </Field>
                    <ImagePreview src={data.image} />
                </FormSection>

                {/* Pengaturan */}
                <FormSection title="Pengaturan Booking" description="Tentukan apa saja yang dibutuhkan saat booking layanan ini">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TOGGLE_SETTINGS.map(item => (
                            <Toggle
                                key={item.key}
                                checked={(data as any)[item.key]}
                                onChange={v => setData(item.key as any, v)}
                                label={item.label}
                                description={item.desc}
                            />
                        ))}
                    </div>
                </FormSection>

                {/* Status */}
                <FormSection title="Status Layanan">
                    <Toggle
                        checked={data.active}
                        onChange={v => setData('active', v)}
                        label="Layanan Aktif"
                        description="Layanan yang aktif bisa di-booking oleh customer"
                    />
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/services" />
            </form>
        </AdminLayout>
    );
}
