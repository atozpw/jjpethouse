import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Upload, X, Loader2 } from 'lucide-react';

type ImageUploadProps = {
    value: string;
    onChange: (url: string) => void;
    folder: 'products' | 'services' | 'branches' | 'staff' | 'categories';
    label?: string;
    hint?: string;
};

export default function ImageUpload({ value, onChange, folder, label, hint }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);

        try {
            const response = await fetch('/admin/upload-image', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                setPreview(data.url);
                onChange(data.url);
            } else {
                alert(data.message || 'Upload gagal');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat upload');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <div className="flex items-start gap-3">
                {/* Preview */}
                {preview ? (
                    <div className="relative w-32 h-32 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0">
                        <Upload size={24} className="text-gray-400" />
                    </div>
                )}

                {/* Upload Button */}
                <div className="flex-1">
                    <label className="cursor-pointer inline-block">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                        />
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            uploading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-accent text-white hover:bg-accent/90'
                        }`}>
                            {uploading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    {preview ? 'Ganti Gambar' : 'Upload Gambar'}
                                </>
                            )}
                        </span>
                    </label>
                    {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
                    <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG, GIF, WebP. Maks: 2MB</p>
                </div>
            </div>
        </div>
    );
}
