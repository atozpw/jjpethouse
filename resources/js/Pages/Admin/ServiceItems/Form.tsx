import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Select, Toggle,
    FormSection, FormActions,
} from '@/Components/Admin/FormField';

type Service = { id: number; name: string };
type PetType = { id: number; name: string };
type ServiceItem = {
    id: number;
    service_id: number;
    name: string;
    price: number;
    type: string;
    active: boolean;
};

export default function ServiceItemForm({
    services,
    petTypes,
    serviceItem,
    selectedPetTypes
}: {
    services: Service[];
    petTypes: PetType[];
    serviceItem: ServiceItem | null;
    selectedPetTypes: number[];
}) {
    const isEdit = !!serviceItem;
    const { data, setData, post, patch, processing, errors } = useForm({
        service_id: serviceItem?.service_id ?? '',
        name: serviceItem?.name ?? '',
        price: serviceItem?.price ?? 0,
        type: serviceItem?.type ?? 'main',
        active: serviceItem?.active ?? true,
        pet_types: selectedPetTypes ?? [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? patch(`/admin/service-items/${serviceItem.id}`) : post('/admin/service-items');
    };

    const togglePetType = (petTypeId: number) => {
        const current = data.pet_types as number[];
        if (current.includes(petTypeId)) {
            setData('pet_types', current.filter(id => id !== petTypeId));
        } else {
            setData('pet_types', [...current, petTypeId]);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Item Layanan' : 'Tambah Item Layanan'}>
            <Head title={isEdit ? 'Edit Item Layanan' : 'Tambah Item Layanan'} />
            <div className="mb-5">
                <Link
                    href="/admin/service-items"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Item Layanan
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Info utama */}
                <FormSection title="Informasi Item" description="Detail item layanan yang akan ditambahkan">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Layanan" required error={errors.service_id} className="sm:col-span-2">
                            <Select
                                value={data.service_id}
                                onChange={e => setData('service_id', Number(e.target.value))}
                            >
                                <option value="">-- Pilih Layanan --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Nama Item" required error={errors.name} className="sm:col-span-2">
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Kucing Kecil, Anjing Besar, dll"
                            />
                        </Field>
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
                        <Field label="Tipe Item" required error={errors.type}>
                            <Select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                            >
                                <option value="main">Utama</option>
                                <option value="additional">Tambahan</option>
                            </Select>
                        </Field>
                    </div>
                </FormSection>

                {/* Status */}
                <FormSection title="Status Item">
                    <Toggle
                        checked={data.active}
                        onChange={v => setData('active', v)}
                        label="Item Aktif"
                        description="Item yang aktif bisa dipilih saat booking"
                    />
                </FormSection>

                {/* Jenis Hewan */}
                <FormSection title="Jenis Hewan" description="Pilih jenis hewan yang sesuai dengan item layanan ini">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {petTypes.map(petType => (
                            <label
                                key={petType.id}
                                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-accent cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={(data.pet_types as number[]).includes(petType.id)}
                                    onChange={() => togglePetType(petType.id)}
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">{petType.name}</span>
                            </label>
                        ))}
                    </div>
                    {petTypes.length === 0 && (
                        <p className="text-sm text-gray-500">Belum ada data jenis hewan.</p>
                    )}
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/service-items" />
            </form>
        </AdminLayout>
    );
}
