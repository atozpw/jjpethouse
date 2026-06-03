import { Head, Link } from '@inertiajs/react';
import { ArrowRight, MapPin, Phone, Star } from 'lucide-react';
import { Footer } from '@/Components/Footer';
import { Header } from '@/Components/Header';
import { HeroSection } from '@/Components/HeroSection';
import { ProductCategoriesShowcase } from '@/Components/ProductCategoriesShowcase';

type Service = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  image: string | null;
  duration: string | null;
  rating: string | number;
  active: boolean;
};

type Props = { services: Service[] };

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        <img src={service.image || '/placeholder.svg'} alt={service.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
            <Star size={14} className="fill-accent text-accent" />
            <span className="text-xs font-semibold text-accent">{service.rating}</span>
          </div>
        </div>
        <p className="text-sm text-default-500 line-clamp-2">{service.description}</p>
        {service.active ? (
          <Link href={`/booking?service=${service.slug}`} className="w-full block">
            <button className="w-full bg-primary hover:bg-primary/90 text-white inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors">Pesan Sekarang</button>
          </Link>
        ) : (
          <button disabled className="w-full bg-primary/50 text-white inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 cursor-not-allowed opacity-50">Pesan Sekarang</button>
        )}
      </div>
    </div>
  );
}

export default function Home({ services }: Props) {
  return (
    <>
      <Head title="JJ Pet House" />
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <ProductCategoriesShowcase />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Layanan Unggulan</h2>
              <p className="text-lg text-muted-foreground">Pilih layanan terbaik untuk hewan peliharaan Anda</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
            <div className="text-center mt-10"><Link href="/services"><button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">Lihat Semua Layanan</button></Link></div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-3">Testimoni Pelanggan</h2><p className="text-lg text-muted-foreground">Kepuasan pelanggan adalah prioritas kami</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{name:'Budi Santoso',text:'Layanan grooming sangat memuaskan! Hewan peliharaan saya terlihat lebih segar dan sehat. Tim profesional dan ramah.',avatar:'👨'},{name:'Siti Nurhaliza',text:'Beberapa kali menggunakan pet hotel dan konsultasi vet. Sangat recommended! Staff-nya peduli dengan hewan peliharaan.',avatar:'👩'},{name:'Ahmad Hidayat',text:'Pelayanan 24 jam sangat membantu saat hewan peliharaan saya sakit di malam hari. Dokter hewan kompeten dan cepat.',avatar:'👨'}].map((testimonial) => <div key={testimonial.name} className="bg-white p-6 rounded-lg border border-border"><div className="flex gap-1 mb-3">{Array(5).fill(0).map((_, i) => <Star key={i} size={16} className="fill-accent text-accent" />)}</div><p className="text-foreground/80 mb-4 italic">{testimonial.text}</p><div className="flex items-center gap-3"><div className="text-2xl">{testimonial.avatar}</div><div><p className="font-semibold text-foreground">{testimonial.name}</p><p className="text-xs text-muted-foreground">Pelanggan Setia</p></div></div></div>)}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-border">
          <div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="text-center"><div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4"><Phone className="text-primary" size={24}/></div><h3 className="font-semibold text-foreground mb-2">Hubungi Kami</h3><p className="text-sm font-semibold text-muted-foreground">Jakarta: 0819-1298-2996</p><p className="text-sm font-semibold text-muted-foreground">Bali: 0811-3999-893</p></div><div className="text-center"><div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4"><MapPin className="text-primary" size={24}/></div><h3 className="font-semibold text-foreground mb-2">Lokasi JJ Pet House</h3><p className="text-sm font-semibold text-muted-foreground">Jakarta: Jl. Radio Dalam Raya Gandaria Utara</p><p className="text-sm font-semibold text-muted-foreground">Bali: Jl. Tukad Batanghari No 77</p></div><div className="text-center"><div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4"><span className="text-xl">⏰</span></div><h3 className="font-semibold text-foreground mb-2">Jam Operasional</h3><p className="font-semibold text-muted-foreground">Buka 24 Jam</p><p className="text-sm font-semibold text-muted-foreground">Setiap Hari Tanpa Libur</p></div></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
