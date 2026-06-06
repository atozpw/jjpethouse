import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Select, Textarea, Toggle,
    FormSection, ImagePreview, FormActions,
} from '@/Components/Admin/FormField';

type City = { id: number; name: string };
type Branch = {
    id: number;
    city_id: number;
    name: string;
    address: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    weekday_hours: string | null;
    weekend_hours: string | null;
    image: string | null;
    lat: number | null;
    lng: number | null;
    featured: boolean;
    active: boolean;
};

export default function BranchForm({ cities, branch }: { cities: City[]; branch: Branch | null }) {
    const isEdit = !!branch;
    const { data, setData, post, patch, processing, errors } = useForm({
        city_id:       branch?.city_id       ?? '',
        name:          branch?.name          ?? '',
        address:       branch?.address       ?? '',
        phone:         branch?.phone         ?? '',
        whatsapp:      branch?.whatsapp      ?? '',
        email:         branch?.email         ?? '',
        weekday_hours: branch?.weekday_hours ?? '',
        weekend_hours: branch?.weekend_hours ?? '',
        image:         branch?.image         ?? '',
        lat:           branch?.lat           ?? '',
        lng:           branch?.lng           ?? '',
        featured:      branch?.featured      ?? false,
        active:        branch?.active        ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/branches/${branch.id}`) : post('/admin/branches');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Cabang' : 'Tambah Cabang'}>
            <Head title={isEdit ? 'Edit Cabang' : 'Tambah Cabang'} />
            <div className="mb-5">
                <Link
                    href="/admin/branches"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Cabang
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Info Utama */}
                <FormSection title="Informasi Cabang" description="Nama, kota, dan detail cabang">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Kota" required error={errors.city_id}>
                            <Select
                                value={data.city_id}
                                onChange={e => setData('city_id', Number(e.target.value))}
                            >
                                <option value="">-- Pilih Kota --</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Nama Cabang" required error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="JJ Pet House Jakarta Selatan"
                            />
                        </Field>
                        <Field label="Alamat Lengkap" required error={errors.address} className="sm:col-span-2">
                            <Textarea
                                rows={3}
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                placeholder="Jl. Nama Jalan No. 00, Kelurahan, Kecamatan, Kota"
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Kontak */}
                <FormSection title="Kontak" description="Nomor telepon, WhatsApp, dan email cabang">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Telepon" hint="Format: 021-xxxx-xxxx">
                            <Input
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                placeholder="021-xxxx-xxxx"
                            />
                        </Field>
                        <Field label="WhatsApp" hint="Format: 08xx-xxxx-xxxx">
                            <Input
                                value={data.whatsapp}
                                onChange={e => setData('whatsapp', e.target.value)}
                                placeholder="0812-xxxx-xxxx"
                            />
                        </Field>
                        <Field label="Email" className="sm:col-span-2">
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="cabang@jjpethouse.com"
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Jam Operasional */}
                <FormSection title="Jam Operasional" description="Jam buka cabang di hari kerja dan akhir pekan">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Jam Weekday" hint="Contoh: 08:00 – 21:00">
                            <Input
                                value={data.weekday_hours}
                                onChange={e => setData('weekday_hours', e.target.value)}
                                placeholder="08:00 – 21:00"
                            />
                        </Field>
                        <Field label="Jam Weekend" hint="Contoh: 09:00 – 20:00">
                            <Input
                                value={data.weekend_hours}
                                onChange={e => setData('weekend_hours', e.target.value)}
                                placeholder="09:00 – 20:00"
                            />
                        </Field>
                    </div>
                </FormSection>

                {/* Lokasi & Gambar */}
                <FormSection title="Lokasi & Gambar" description="Koordinat peta dan foto cabang">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Latitude" hint="Contoh: -6.2615">
                            <Input
                                type="number"
                                step="any"
                                value={data.lat}
                                onChange={e => setData('lat', e.target.value)}
                                placeholder="-6.2615"
                            />
                        </Field>
                        <Field label="Longitude" hint="Contoh: 106.7807">
                            <Input
                                type="number"
                                step="any"
                                value={data.lng}
                                onChange={e => setData('lng', e.target.value)}
                                placeholder="106.7807"
                            />
                        </Field>
                        <Field label="URL Gambar" className="sm:col-span-2">
                            <Input
                                value={data.image}
                                onChange={e => setData('image', e.target.value)}
                                placeholder="https://... atau /image/cabang.jpg"
                            />
                        </Field>
                    </div>
                    <ImagePreview src={data.image} />
                </FormSection>

                {/* Status */}
                <FormSection title="Status Cabang">
                    <div className="space-y-3">
                        <Toggle
                            checked={data.active}
                            onChange={v => setData('active', v)}
                            label="Cabang Aktif"
                            description="Cabang aktif akan tampil di halaman Our Store"
                        />
                        <Toggle
                            checked={data.featured}
                            onChange={v => setData('featured', v)}
                            label="Featured"
                            description="Tampilkan cabang ini di posisi utama / highlight"
                        />
                    </div>
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/branches" />
            </form>
        </AdminLayout>
    );
}
