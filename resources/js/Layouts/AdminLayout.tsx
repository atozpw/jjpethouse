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
    PackagePlus,
    Users,
    Bell,
    Settings,
    PawPrint,
} from 'lucide-react';

const navGroups = [
    {
        label: 'Main',
        items: [
            { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, name: 'admin.dashboard' },
        ]
    },
    {
        label: 'E-Commerce',
        items: [
            { label: 'Produk', href: '/admin/products', icon: ShoppingBag, name: 'admin.products' },
            { label: 'Kategori Produk', href: '/admin/product-categories', icon: Tag, name: 'admin.product-categories' },
        ]
    },
    {
        label: 'Services',
        items: [
            { label: 'Layanan', href: '/admin/services', icon: Sparkles, name: 'admin.services' },
            { label: 'Item Layanan', href: '/admin/service-items', icon: PackagePlus, name: 'admin.service-items' },
            { label: 'Booking', href: '/admin/bookings', icon: CalendarDays, name: 'admin.bookings' },
        ]
    },
    {
        label: 'Management',
        items: [
            { label: 'Cabang', href: '/admin/branches', icon: Store, name: 'admin.branches' },
            { label: 'Staff', href: '/admin/staff', icon: Users, name: 'admin.staff' },
            { label: 'Jenis Hewan', href: '/admin/pet-types', icon: PawPrint, name: 'admin.pet-types' },
        ]
    }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link href="/admin" className="flex items-center gap-3">
                            <img src="/logo.png" alt="JJ Pet House" className="h-10 w-auto" />
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-gray-900">JJ Pet House</span>
                                <span className="block text-xs text-gray-500">Admin Panel</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{auth?.user?.name}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
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
                    className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <nav className="flex-1 py-6 px-3 overflow-y-auto">
                        <div className="space-y-6">
                            {navGroups.map((group) => (
                                <div key={group.label}>
                                    <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {group.label}
                                    </h3>
                                    <div className="space-y-1">
                                        {group.items.map((item) => {
                                            const Icon = item.icon;
                                            const active = isActive(item.href);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                        active
                                                            ? 'bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg shadow-accent/30'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <Icon size={20} className="flex-shrink-0" />
                                                    <span className="flex-1">{item.label}</span>
                                                    {active && <ChevronRight size={16} />}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>
                    <div className="p-4 border-t border-gray-100 flex-shrink-0">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                            <Settings size={20} className="text-blue-600" />
                            <div>
                                <p className="text-xs font-medium text-gray-900">System</p>
                                <p className="text-xs text-gray-500">v1.0.0</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 lg:p-8 min-w-0 lg:ml-64">
                    {title && (
                        <div className="mb-6">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
                            <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent/50 rounded-full mt-2"></div>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
