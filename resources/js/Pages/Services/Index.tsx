import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { Footer } from '@/Components/Footer';
import { Header } from '@/Components/Header';
import { ServiceCard } from '@/Components/ServiceCard';

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  duration: string | null;
  rating: number;
  active: boolean;
};

type Props = {
  services: Service[];
};

export default function ServicesIndex({ services }: Props) {
  return (
    <>
      <Head title="Services" />
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 py-16 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Semua Layanan JJ Pet House</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Kami menyediakan layanan lengkap dan profesional untuk semua kebutuhan hewan peliharaan Anda dengan fasilitas modern dan tim berpengalaman
            </p>
          </div>
        </section>


        {/* All Services Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-3 text-center">Paket Layanan Kami</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Pilih layanan yang sesuai dengan kebutuhan hewan peliharaan Anda. Semua layanan tersedia dengan harga terjangkau dan kualitas terbaik
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="py-16 bg-white border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Mengapa Memilih Kami?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Tim Profesional', description: 'Dokter hewan bersertifikat dan groomer berpengalaman siap melayani Anda' },
                { title: 'Fasilitas Modern', description: 'Menggunakan peralatan terkini dan standar internasional untuk kenyamanan hewan Anda' },
                { title: 'Perawatan 24 Jam', description: 'Layanan non-stop sepanjang waktu untuk kebutuhan mendesak hewan peliharaan Anda' },
                { title: 'Harga Kompetitif', description: 'Harga terjangkau tanpa mengorbankan kualitas pelayanan dan fasilitas' },
                { title: 'Lokasi Strategis', description: 'Mudah diakses dengan lokasi di area Jakarta Selatan yang strategis' },
                { title: 'Customer Service Ramah', description: 'Tim customer service kami siap membantu Anda dengan senyuman dan profesional' },
              ].map((feature, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '1000+', label: 'Pelanggan Puas' },
                { number: '15+', label: 'Tahun Pengalaman' },
                { number: '24', label: 'Jam Pelayanan' },
                { number: '4.8', label: 'Rating Kepuasan' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mempercayakan Hewan Kesayangan Anda?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk mendapatkan konsultasi gratis dan penawaran khusus untuk member baru
            </p>
            <Link href="/booking">
              <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Pesan Sekarang
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
