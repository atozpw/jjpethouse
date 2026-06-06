import React from 'react';

// ─── Field wrapper ────────────────────────────────────────────────────────────
export function Field({
    label,
    required,
    error,
    hint,
    children,
    className = '',
}: {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-0.5 ${className}`}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                </p>
            )}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

const inputBase =
    'w-full rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-accent focus:bg-white focus:ring-1 focus:ring-accent/10';

// ─── Text / Number input ──────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`${inputBase} ${props.className ?? ''}`} />;
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={`${inputBase} resize-none ${props.className ?? ''}`}
        />
    );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className={`${inputBase} cursor-pointer ${props.className ?? ''}`}
        />
    );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({
    checked,
    onChange,
    label,
    description,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
}) {
    return (
        <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                />
                <div
                    className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                        checked ? 'bg-accent' : 'bg-gray-200'
                    }`}
                />
                <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-tight">{label}</p>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
        </label>
    );
}

// ─── Section card ─────────────────────────────────────────────────────────────
export function FormSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
                {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}

// ─── Image preview ────────────────────────────────────────────────────────────
export function ImagePreview({ src, alt = 'preview' }: { src: string; alt?: string }) {
    if (!src) return null;
    return (
        <div className="mt-2 relative w-fit">
            <img
                src={src}
                alt={alt}
                className="h-28 w-28 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
        </div>
    );
}

// ─── Form action bar ──────────────────────────────────────────────────────────
export function FormActions({
    processing,
    cancelHref,
    submitLabel = 'Simpan',
}: {
    processing: boolean;
    cancelHref: string;
    submitLabel?: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="submit"
                disabled={processing}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
                {processing ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                        </svg>
                        {submitLabel}
                    </>
                )}
            </button>
            <a
                href={cancelHref}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
                Batal
            </a>
        </div>
    );
}
