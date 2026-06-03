import { Head, Link } from '@inertiajs/react';
import { Briefcase, Clock, Globe, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { Footer } from '@/Components/Footer';
import { Header } from '@/Components/Header';

type CityId = 'all' | 'jakarta' | 'bali' | 'lombok';

type City = {
  id: string;
  name: string;
  icon: string | null;
  count: number;
};

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  services: string[];
  image: string;
  coordinates: {
    lat?: number | null;
    lng?: number | null;
  };
  featured?: boolean;
};

type Props = {
  branches: Branch[];
  cities: City[];
};

export default function BranchesIndex({ branches, cities }: Props) {
  const [selectedCity, setSelectedCity] = useState<CityId>('all');

  const filteredBranches =
    selectedCity === 'all'
      ? branches
      : branches.filter((branch) => branch.city === selectedCity);

  const cityInfo = cities.find((city) => city.id === selectedCity);

  const getServiceColor = (service: string) => {
    const colors: { [key: string]: string } = {
      'Grooming': 'bg-blue-100 text-blue-800',
      'Klinik': 'bg-red-100 text-red-800',
      'Clinic': 'bg-red-100 text-red-800',
      'Klinik 24 Jam': 'bg-red-100 text-red-800',
      'Pet Hotel': 'bg-purple-100 text-purple-800',
      'Pet Boarding': 'bg-purple-100 text-purple-800',
      'Pet Shop': 'bg-green-100 text-green-800',
      'Playground': 'bg-yellow-100 text-yellow-800',
      'Pet Playground': 'bg-yellow-100 text-yellow-800',
      'Pool': 'bg-cyan-100 text-cyan-800',
    };
    return colors[service] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Head title="Our Store" />
      <Header />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary to-primary/80 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Temukan Cabang JJ Pet House</h1>
              <p className="text-lg opacity-90">
                Kami hadir di berbagai kota besar dengan fasilitas lengkap dan profesional untuk melayani hewan kesayangan Anda
              </p>
            </div>
          </div>
        </section>

        <section className="sticky top-25 md:top-32 z-40 bg-white/80 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4">

            <div className="flex gap-3 overflow-x-auto whitespace-nowrap justify-center">

              <button
                onClick={() => setSelectedCity('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                ${
                  selectedCity === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80 active:scale-95'
                }`}
              >
                <Globe size={16} />
                Semua
              </button>

              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() =>
                    setSelectedCity(city.id as CityId)
                  }
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                  ${
                    selectedCity === city.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted text-foreground hover:bg-muted/80 active:scale-95'
                  }`}
                >
                  <MapPin size={16} />
                  {city.name}
                </button>
              ))}

            </div>

          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                {selectedCity === 'all'
                  ? 'Semua Cabang JJ Pet House'
                  : `Cabang di ${cityInfo?.name}`}
              </h2>

              <p className="text-muted-foreground">
                Menampilkan {filteredBranches.length} cabang JJ Pet House
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {branch.featured && (
                      <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{branch.name}</h3>

                    <div className="flex gap-3 mb-4 text-muted-foreground">
                      <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{branch.address}</p>
                    </div>

                    <div className="flex gap-3 mb-4 text-muted-foreground">
                      <Clock size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p>
                          <span className="font-semibold">Senin-Jumat:</span> {branch.hours.weekday}
                        </p>
                        <p>
                          <span className="font-semibold">Sabtu-Minggu:</span> {branch.hours.weekend}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Briefcase size={16} />
                        Layanan
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {branch.services.map((service) => (
                          <span
                            key={service}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getServiceColor(service)}`}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                      <a href={`https://wa.me/62${branch.whatsapp.replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                          <MessageCircle size={18} />
                          WhatsApp
                        </button>
                      </a>
                      <a href={`tel:${branch.phone}`} className="flex-1">
                        <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                          <Phone size={18} />
                          Telepon
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-primary mb-12 text-center">Mengapa Banyak Cabang?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '📍',
                  title: 'Akses Mudah',
                  desc: 'Lokasi strategis di berbagai kota memudahkan Anda mengakses layanan kami kapan saja',
                },
                {
                  icon: '⭐',
                  title: 'Kualitas Konsisten',
                  desc: 'Semua cabang menggunakan standar service dan fasilitas yang sama profesionalnya',
                },
                {
                  icon: '🤝',
                  title: 'Layanan Terpadu',
                  desc: 'Network cabang memungkinkan pelayanan terpadu di berbagai lokasi dengan sistem terintegrasi',
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kunjungi Cabang Terdekat Kami Sekarang
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Hubungi cabang JJ Pet House di kota Anda untuk booking atau konsultasi gratis
            </p>
            <Link href="/services">
              <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Lihat Semua Layanan
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
