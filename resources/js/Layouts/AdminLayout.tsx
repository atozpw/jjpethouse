import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Tag,
    Sparkles,
    CalendarDays,
    Store,
    Menu,
    X,
    LogOut,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, name: 'admin.dashboard' },
    { label: 'Produk', href: '/admin/products', icon: ShoppingBag, name: 'admin.products' },
    { label: 'Kategori Produk', href: '/admin/product-categories', icon: Tag, name: 'admin.product-categories' },
    { label: 'Layanan', href: '/admin/services', icon: Sparkles, name: 'admin.services' },
    { label: 'Booking', href: '/admin/bookings', icon: CalendarDays, name: 'admin.bookings' },
    { label: 'Cabang', href: '/admin/branches', icon: Store, name: 'admin.branches' },
];

type Props = {
    children: React.ReactNode;
    title?: string;
};

export default function AdminLayout({ children, title }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();
    const { auth } = usePage().props as any;

    const isActive = (href: string) => {
        if (href === '/admin') return url === '/admin';
        return url.startsWith(href);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-accent shadow-sm">
                <div className="flex items-center justify-between px-4 h-14">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden text-white p-1.5 rounded hover:bg-white/10"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link href="/admin" className="flex items-center gap-2">
                            <img src="/logo.png" alt="JJ Pet House" className="h-8 w-auto" />
                            <span className="text-white font-bold text-sm hidden sm:block">Admin Panel</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 text-white text-sm">
                        <span className="hidden sm:block opacity-80">{auth?.user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium"
                        >
                            <LogOut size={14} />
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar overlay (mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:h-auto ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-accent text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon size={16} className="flex-shrink-0" />
                                    {item.label}
                                    {active && <ChevronRight size={14} className="ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-3 border-t border-gray-100 text-xs text-gray-400 text-center">
                        JJ Pet House © 2025
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6 min-w-0 lg:ml-0">
                    {title && (
                        <h1 className="text-xl font-bold text-gray-800 mb-5">{title}</h1>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
