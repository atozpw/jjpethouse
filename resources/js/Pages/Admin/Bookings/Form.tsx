import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';
import {
    Field, Input, Select, Textarea,
    FormSection, FormActions,
} from '@/Components/Admin/FormField';

type Booking = {
    id: number;
    service_id: number | null;
    branch_id: number | null;
    booking_number: string;
    status: string;
    date: string | null;
    time: string | null;
    check_in: string | null;
    check_out: string | null;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    city: string | null;
    address: string | null;
    notes: string | null;
    total_price: number;
};

const STATUS_OPTIONS = [
    { value: 'pending',   label: 'Pending',   color: 'text-yellow-600' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
];

const STATUS_BADGE: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function BookingForm({
    booking,
    services,
    branches,
}: {
    booking: Booking;
    services: { id: number; name: string }[];
    branches: { id: number; name: string }[];
}) {
    const { data, setData, patch, processing, errors } = useForm({
        service_id:      booking.service_id ?? '',
        branch_id:       booking.branch_id ?? '',
        booking_number:  booking.booking_number,
        status:          booking.status,
        date:            booking.date ?? '',
        time:            booking.time ?? '',
        check_in:        booking.check_in ?? '',
        check_out:       booking.check_out ?? '',
        customer_name:   booking.customer_name,
        customer_email:  booking.customer_email ?? '',
        customer_phone:  booking.customer_phone ?? '',
        city:            booking.city ?? '',
        address:         booking.address ?? '',
        notes:           booking.notes ?? '',
        total_price:     booking.total_price,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/bookings/${booking.id}`);
    };

    return (
        <AdminLayout title="Edit Booking">
            <Head title="Edit Booking" />

            <div className="mb-5 flex items-center justify-between">
                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Booking
                </Link>
                {/* Status badge di header */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_BADGE[data.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {data.status}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Status & Identitas */}
                <FormSection title="Status Booking" description="Nomor booking dan status saat ini">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="No. Booking" required>
                            <Input
                                value={data.booking_number}
                                onChange={e => setData('booking_number', e.target.value)}
                            />
                        </Field>
                        <Field label="Status" required>
                            <Select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                </FormSection>

                {/* Layanan & Jadwal */}
                <FormSection title="Layanan & Jadwal" description="Layanan yang dipesan dan waktu pelaksanaan">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Layanan">
                            <Select
                                value={data.service_id}
                                onChange={e => setData('service_id', e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">-- Pilih Layanan --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Cabang">
                            <Select
                                value={data.branch_id}
                                onChange={e => setData('branch_id', e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">-- Pilih Cabang --</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Tanggal">
                            <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                        </Field>
                        <Field label="Jam">
                            <Input type="time" value={data.time} onChange={e => setData('time', e.target.value)} />
                        </Field>
                        <Field label="Check In" hint="Untuk layanan boarding / range">
                            <Input type="date" value={data.check_in} onChange={e => setData('check_in', e.target.value)} />
                        </Field>
                        <Field label="Check Out">
                            <Input type="date" value={data.check_out} onChange={e => setData('check_out', e.target.value)} />
                        </Field>
                    </div>
                </FormSection>

                {/* Data Customer */}
                <FormSection title="Data Customer" description="Informasi pemesan layanan">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Nama Lengkap" required>
                            <Input
                                value={data.customer_name}
                                onChange={e => setData('customer_name', e.target.value)}
                                placeholder="Nama customer..."
                            />
                        </Field>
                        <Field label="No. Telepon">
                            <Input
                                value={data.customer_phone}
                                onChange={e => setData('customer_phone', e.target.value)}
                                placeholder="08xx-xxxx-xxxx"
                            />
                        </Field>
                        <Field label="Email">
                            <Input
                                type="email"
                                value={data.customer_email}
                                onChange={e => setData('customer_email', e.target.value)}
                                placeholder="customer@email.com"
                            />
                        </Field>
                        <Field label="Kota">
                            <Input
                                value={data.city}
                                onChange={e => setData('city', e.target.value)}
                                placeholder="Jakarta, Bali..."
                            />
                        </Field>
                        <Field label="Total Pembayaran (Rp)">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">Rp</span>
                                <Input
                                    type="number"
                                    min="0"
                                    value={data.total_price}
                                    onChange={e => setData('total_price', Number(e.target.value))}
                                    className="pl-8"
                                />
                            </div>
                        </Field>
                        <Field label="Alamat" className="sm:col-span-2">
                            <Textarea
                                rows={2}
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                placeholder="Alamat lengkap customer..."
                            />
                        </Field>
                        <Field label="Catatan" hint="Permintaan khusus dari customer" className="sm:col-span-2">
                            <Textarea
                                rows={3}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Catatan atau permintaan khusus..."
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormActions processing={processing} cancelHref="/admin/bookings" />
            </form>
        </AdminLayout>
    );
}
