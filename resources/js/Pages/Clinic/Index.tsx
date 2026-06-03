import { Head } from '@inertiajs/react';
import { Award, Clock, MessageCircle, PhoneCall, Users } from 'lucide-react';
import { useState } from 'react';
import { Footer } from '@/Components/Footer';
import { Header } from '@/Components/Header';

type Doctor = {
  name: string;
  specialty: string;
  experience: string;
  image: string;
  lokasi: string;
};

type Props = {
  doctors: Doctor[];
};

export default function ClinicIndex({ doctors }: Props) {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const filteredDoctors =
    selectedLocation === 'All'
      ? doctors
      : doctors.filter((doc) => doc.lokasi === selectedLocation);

  const services = [
    { icon: '🩺', title: 'Konsultasi Umum', desc: 'Pemeriksaan kesehatan komprehensif dengan dokter berpengalaman' },
    { icon: '💉', title: 'Vaksinasi Lengkap', desc: 'Program vaksinasi rabies, distemper, dan vaksin lengkap lainnya' },
    { icon: '🔬', title: 'Lab Test Canggih', desc: 'Tes laboratorium dengan teknologi analyzer modern dan hasil akurat' },
    { icon: '⚕️', title: 'Operasi Bedah', desc: 'Tindakan bedah dengan peralatan steril dan profesional bersertifikat' },
    { icon: '🦷', title: 'Dental Care', desc: 'Pembersihan gigi, scaling, dan perawatan oral modern' },
    { icon: '🚨', title: 'Layanan Darurat', desc: 'Penanganan emergency 24 jam untuk kasus gawat darurat' },
  ];

  const facilities = [
    { title: 'Ruang Konsultasi', image: '/image/Pict 4.jpeg', desc: 'Ruang konsultasi yang nyaman dan steril' },
    { title: 'Peralatan Medis', image: '/image/Pict 7.jpeg', desc: 'Analyzer dan peralatan medis modern' },
    { title: 'Ruang Pemulihan', image: '/image/Pict 44.jpeg', desc: 'Fasilitas pemulihan pasien post operasi' },
  ];

  return (
    <>
      <Head title="Clinic" />
      <Header />

      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Klinik Hewan 24 Jam JJ Pet House</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Pelayanan kesehatan hewan peliharaan terbaik dengan dokter hewan berpengalaman dan fasilitas medis modern berstandar internasional
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Fasilitas Klinik Modern</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {facilities.map((facility, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-foreground mb-2">{facility.title}</h3>
                    <p className="text-sm text-muted-foreground">{facility.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Layanan Klinik Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Tim Dokter Hewan Profesional</h2>
            <div className="flex justify-center gap-3 mb-10">
              {['All', 'Jakarta', 'Bali'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition
                    ${selectedLocation === loc
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-primary/20'
                    }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredDoctors.map((doctor, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow bg-white"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-contain p-2 bg-muted"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-foreground mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-primary font-semibold mb-2">
                      {doctor.specialty}
                    </p>


                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Mengapa Memilih Klinik Kami?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Clock className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Buka 24 Jam</h3>
                <p className="text-muted-foreground text-sm">Layanan darurat veteriner siap melayani Anda kapan saja, sepanjang tahun tanpa libur</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Users className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Tim Profesional</h3>
                <p className="text-muted-foreground text-sm">Dokter hewan bersertifikat internasional dengan pengalaman lebih dari 10 tahun praktik</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Award className="text-primary" size={28} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Fasilitas Modern</h3>
                <p className="text-muted-foreground text-sm">Dilengkapi analyzer dan peralatan kesehatan terkini dengan standar internasional</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Informasi Penting</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Clock className="text-primary" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Jam Operasional</h3>
                <p className="text-muted-foreground">Buka 24 Jam</p>
                <p className="text-muted-foreground">Setiap Hari Tanpa Libur</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <PhoneCall className="text-primary" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Telepon</h3>
                <p className="text-muted-foreground">Jakarta: <a href="tel:081912982996">0819-1298-2996</a></p>
                <p className="text-muted-foreground">Bali: <a href="tel:08113999893">0811-3999-893</a></p>
                <p className="text-muted-foreground">Untuk keperluan mendesak</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <MessageCircle className="text-primary" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">WhatsApp</h3>
                <p className="text-muted-foreground">Jakarta: <a href="https://wa.me/6281912982996">0819-1298-2996</a></p>
                <p className="text-muted-foreground">Bali: <a href="https://wa.me/628113999893">0811-3999-893</a></p>
                <p className="text-muted-foreground">Chat cepat untuk konsultasi</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Butuh Konsultasi Veteriner Sekarang?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk jadwal konsultasi atau untuk kasus darurat. Tim dokter hewan kami siap membantu kapan saja
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/6281912982996" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Jakarta
                </button>
              </a>
              <a href="https://wa.me/628113999893" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Bali
                </button>
              </a>
              <a href="tel:+6281912982996">
                <button className="px-8 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 border border-white transition-colors flex items-center justify-center gap-2">
                  <PhoneCall size={20} />
                  Jakarta
                </button>
              </a>
              <a href="tel:+628113999893">
                <button className="px-8 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 border border-white transition-colors flex items-center justify-center gap-2">
                  <PhoneCall size={20} />
                  Bali
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
