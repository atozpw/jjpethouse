import { Link } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div><Link href="/" className="flex items-center gap-3 font-bold flex-shrink-0"><img src="/logo.png" alt="JJ Pet House Logo" width={50} height={50}/><span className="hidden sm:block text-white">JJ PET HOUSE</span></Link><p className="text-sm font-semibold opacity-90 pt-4">Care Like a Mom Love Like Family</p></div>
          <div><h4 className="font-semibold mb-4">Menu Utama</h4><ul className="space-y-2 text-sm"><li><Link href="/pet-shop" className="hover:opacity-75">Pet Shop</Link></li><li><Link href="/services" className="hover:opacity-75">Services</Link></li><li><Link href="/booking" className="hover:opacity-75">Booking</Link></li><li><Link href="/clinic" className="hover:opacity-75">Clinic</Link></li></ul></div>
          <div><h4 className="font-semibold mb-4">Layanan</h4><ul className="space-y-2 text-sm"><li>Pet Grooming</li><li>Pet Boarding</li><li>Pet Playground</li><li>Delivery</li></ul></div>
          <div><h4 className="font-semibold mb-4">Hubungi Kami</h4><ul className="space-y-3 text-sm"><li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 flex-shrink-0"/><span>Jakarta: 0819-1298-2996 <br/> Bali: 0811-3999-893</span></li><li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 flex-shrink-0"/><span>Jakarta: Jl. Radio Dalam Raya Gandaria Utara <br/> Bali: Jl. Tukad Batanghari No 77</span></li><li className="flex items-start gap-2"><Mail size={16}/><span>info@jjpethouse.id</span></li><li className="flex items-start gap-2"><span className="text-base leading-none">◎</span><span>@jjpethouse</span></li><li className="flex items-start gap-2"><Clock size={16}/><span>24 Jam / Buka Setiap Hari</span></li></ul></div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75"><p>&copy; 2026 JJ Pet House. All rights reserved.</p></div>
      </div>
    </footer>
  );
}
