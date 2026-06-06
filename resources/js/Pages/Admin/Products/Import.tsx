import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Download } from 'lucide-react';

type ImportResult = {
    success: boolean;
    summary?: {
        total: number;
        success: number;
        failed: number;
        percent: number;
    };
    errors?: string[];
    imported?: { itemid: string; name: string; price: number }[];
    message?: string;
};

export default function ProductImport() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        if (!file.name.endsWith('.json')) {
            alert('Hanya file JSON yang didukung');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            if (!csrfToken) {
                throw new Error('Token keamanan tidak tersedia. Muat ulang halaman lalu coba lagi.');
            }

            const response = await fetch('/admin/products/import/upload', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error(`Server mengembalikan respons tidak valid (HTTP ${response.status})`);
            }

            const data = await response.json();
            if (response.status === 419) {
                data.success = false;
                data.message = 'Sesi login telah berubah atau kedaluwarsa. Muat ulang halaman dan login kembali.';
            }
            if (!response.ok && !data.message) {
                data.message = `Upload gagal (HTTP ${response.status})`;
            }
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                message: error instanceof Error ? error.message : 'Upload gagal',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const template = {
            shop: {
                shopid: 62631190,
                username: 'jjpethouse1212',
                name: 'JJ PETHOUSE',
            },
            products: [
                {
                    itemid: 15846541125,
                    name: 'RAW FOOD MAI CHICKEN PUMPKIN 1KG',
                    price: 40000,
                    stock: 116,
                    image: 'https://...',
                    images: ['https://.../utama.jpg', 'https://.../detail.jpg'],
                    description: 'Makanan Beku...',
                    brand: 'MAI',
                    pet_type: 'Anjing',
                    categories: ['Makanan Hewan'],
                    variations: [
                        {
                            name: 'Ukuran',
                            options: ['500 gram', '1 kg'],
                        },
                    ],
                },
            ],
        };

        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2)));
        element.setAttribute('download', 'template-produk.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <AdminLayout title="Import Produk dari JSON">
            <Head title="Import Produk" />

            <div className="mb-5">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke Daftar Produk
                </Link>
            </div>

            <div className="space-y-5">
                {/* Upload Section */}
                {!result || !result.success ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Upload File JSON</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Drag & drop atau klik untuk memilih file JSON dari Shopee</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Drag & Drop Area */}
                            <label
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                                    isDragging
                                        ? 'border-accent bg-accent/5'
                                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <Upload className={`${isDragging ? 'text-accent' : 'text-gray-400'} transition-colors`} size={32} />
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-800">Drag file JSON ke sini atau klik</p>
                                    <p className="text-xs text-gray-500 mt-1">Maksimal 10 MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileSelect}
                                    disabled={isUploading}
                                    className="sr-only"
                                />
                            </label>

                            {isUploading && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="animate-spin">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" opacity="0.25" strokeWidth="2" />
                                            <path d="M4 12a8 8 0 018-8v4" fill="none" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    Mengupload dan memproses...
                                </div>
                            )}

                            {/* Help & Template */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-2">
                                <p className="font-medium">Format JSON yang didukung:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-600">
                                    <li>Field wajib: itemid, name, price, stock</li>
                                    <li>Itemid yang sudah ada akan diperbarui</li>
                                    <li>Categories disimpan sebagai beberapa tag</li>
                                    <li>Images disimpan sebagai galeri halaman detail</li>
                                    <li>Variation options yang tidak kosong dibuat sebagai varian</li>
                                    <li>URL gambar akan disimpan jika valid</li>
                                </ul>
                                <button
                                    onClick={downloadTemplate}
                                    className="mt-2 flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs"
                                >
                                    <Download size={14} />
                                    Download Template JSON
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Result Section */}
                {result && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className={`px-4 py-3 border-b ${result.success ? 'border-green-100 bg-green-50/60' : 'border-red-100 bg-red-50/60'}`}>
                            <div className="flex items-center gap-2">
                                {result.success ? (
                                    <CheckCircle size={18} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={18} className="text-red-600" />
                                )}
                                <h3 className={`text-sm font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                                    {result.success ? 'Import Berhasil' : 'Import Gagal'}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {result.message && (
                                <p className="text-sm text-red-600">{result.message}</p>
                            )}

                            {result.summary && (
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-gray-800">{result.summary.total}</p>
                                        <p className="text-xs text-gray-500 mt-1">Total</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-green-600">{result.summary.success}</p>
                                        <p className="text-xs text-green-600 mt-1">Berhasil</p>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-red-600">{result.summary.failed}</p>
                                        <p className="text-xs text-red-600 mt-1">Gagal</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{result.summary.percent}%</p>
                                        <p className="text-xs text-blue-600 mt-1">Persentase</p>
                                    </div>
                                </div>
                            )}

                            {result.errors && result.errors.length > 0 && (
                                <div className="bg-red-50 rounded-lg p-3 space-y-1 max-h-40 overflow-y-auto">
                                    <p className="text-xs font-semibold text-red-700 mb-2">Error ({result.errors.length}):</p>
                                    {result.errors.map((err, i) => (
                                        <p key={i} className="text-xs text-red-600">
                                            {err}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {result.imported && result.imported.length > 0 && (
                                <div className="bg-green-50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                                    <p className="text-xs font-semibold text-green-700 mb-2">Produk Berhasil Diimpor ({result.imported.length}):</p>
                                    {result.imported.slice(0, 10).map((prod, i) => (
                                        <div key={i} className="flex justify-between text-xs text-green-600">
                                            <span>{prod.name}</span>
                                            <span className="font-medium">Rp{prod.price.toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                    {result.imported.length > 10 && (
                                        <p className="text-xs text-green-500 italic">+{result.imported.length - 10} produk lainnya...</p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setResult(null)}
                                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                                >
                                    Upload File Baru
                                </button>
                                <Link
                                    href="/admin/products"
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                                >
                                    Lihat Daftar Produk
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
