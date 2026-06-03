import { Link, usePage } from '@inertiajs/react';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const { auth, cart } = usePage().props as unknown as {
    auth?: { user?: { name: string } | null };
    cart?: { count?: number };
  };
  const user = auth?.user;
  const cartCount = cart?.count ?? 0;

  useEffect(() => {
    if (cartCount < 1) return;

    setCartPulse(true);
    const timeout = window.setTimeout(() => setCartPulse(false), 700);

    return () => window.clearTimeout(timeout);
  }, [cartCount]);
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Pet Shop', href: '/pet-shop' },
    { label: 'Clinic', href: '/clinic' },
    { label: 'Services', href: '/services' },
    { label: 'Pet Room', href: '/discussion' },
    { label: 'Our Store', href: '/branches' },
    { label: 'Pet Store', href: '/adopt' },
    { label: 'Event', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-accent/100 backdrop-blur shadow-sm">
      <div className="bg-accent/90 text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-white/80">
          <div />
          <div className="flex gap-4">
            <span>Notifikasi</span><span>Bantuan</span><span>Bahasa Indonesia</span>
            {user ? <span>Halo, {user.name}</span> : <><Link href="/login"><span>Masuk</span></Link><Link href="/register"><span>Daftar</span></Link></>}
          </div>
        </div>
      </div>
      <nav>
        <div className="container mx-auto px-4 pt-2 flex items-center gap-2 pb-4 lg:pb-0">
          <Link href="/" className="flex items-center gap-1 font-bold flex-shrink-0">
            <img src="/logo.png" alt="JJ Pet House Logo" width={110} height={110} />
          </Link>
          <div className="flex-1 lg:hidden">
            <div className="relative w-full">
              <input type="text" placeholder="Cari produk..." className="w-full rounded-xl bg-white py-2.5 pl-4 pr-10 text-sm outline-none shadow-sm" />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="hidden lg:flex flex-1 mx-8">
            <div className="relative w-full">
              <input type="text" placeholder="Cari produk..." className="w-full rounded-xl bg-white py-2.5 pl-4 pr-10 text-sm outline-none shadow-sm" />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Link href="/cart" className={`relative p-2 rounded-lg transition-colors hover:bg-white/10 ${cartPulse ? 'scale-110' : ''}`}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className={`absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white shadow ${cartPulse ? 'animate-bounce' : ''}`}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            {user && <Link href="/dashboard" className="hidden md:flex p-2 rounded-lg hover:bg-white/10"><User className="h-5 w-5" /></Link>}
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu className="h-6 w-6" /></button>
          </div>
        </div>
      </nav>
      <div className="hidden lg:flex border-b border-white/10 text-white pb-3 items-center">
        <div className="container mx-auto px-4"><div className="flex justify-center gap-8 font-bold text-xs">{navItems.map(item => <Link key={item.href} href={item.href} className="hover:text-white/60 transition-colors">{item.label}</Link>)}</div></div>
      </div>
      {mobileOpen && <div className="lg:hidden bg-accent text-white px-4 pb-4 space-y-2">{navItems.map(item => <Link key={item.href} href={item.href} className="block py-2 font-bold text-sm">{item.label}</Link>)}</div>}
    </header>
  );
}
