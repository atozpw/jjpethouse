import { Link } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export type ProductCategoryShowcaseItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  benefits: string[];
  productCount: number;
};

const fallbackCategories: ProductCategoryShowcaseItem[] = [
  { id: 'pet-food', name: 'Pet Food', slug: 'pet-food', description: 'Makanan berkualitas tinggi untuk anjing dan kucing', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=1171&auto=format&fit=crop', benefits: ['Nutrisi seimbang untuk kesehatan optimal', 'Menggunakan bahan berkualitas premium', 'Formulasi khusus sesuai usia dan kondisi'], productCount: 45 },
  { id: 'pet-accessories', name: 'Pet Accessories', slug: 'pet-accessories', description: 'Aksesori dan perlengkapan untuk kenyamanan hewan peliharaan', image: 'https://images.unsplash.com/photo-1605092116196-404f5b8caa15?q=80&w=1170&auto=format&fit=crop', benefits: ['Desain modern dan stylish', 'Material aman dan tahan lama', 'Meningkatkan kenyamanan hewan'], productCount: 63 },
  { id: 'pet-essential', name: 'Pet Essential', slug: 'pet-essential', description: 'Produk perawatan dasar dan perlengkapan wajib untuk hewan', image: 'https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?q=80&w=1170&auto=format&fit=crop', benefits: ['Menjaga kebersihan harian hewan', 'Mencegah penyakit dan masalah kesehatan', 'Produk aman dan hypoallergenic'], productCount: 38 },
  { id: 'pet-healthy', name: 'Pet Healthy', slug: 'pet-healthy', description: 'Suplemen dan produk kesehatan premium untuk hewan peliharaan', image: 'https://images.unsplash.com/photo-1625321171045-1fea4ac688e9?q=80&w=1171&auto=format&fit=crop', benefits: ['Mendukung kesehatan jangka panjang', 'Formula yang telah teruji klinis', 'Meningkatkan energi dan vitalitas'], productCount: 29 },
];

export function ProductCategoriesShowcase({ categories = fallbackCategories }: { categories?: ProductCategoryShowcaseItem[] }) {
  const [active, setActive] = useState(categories[0] || fallbackCategories[0]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Kategori Produk</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Jelajahi berbagai kategori produk pet care berkualitas premium untuk memenuhi semua kebutuhan hewan peliharaan Anda</p>
          </div>
          <Link href="/pet-shop" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Lihat Semua <ArrowRight size={12} /></Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(0, 4).map((cat) => (
              <div key={cat.id} onClick={() => setActive(cat)} className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 h-[100px] flex flex-col justify-between ${active.id === cat.id ? 'bg-primary text-white shadow-md' : 'bg-white hover:shadow-sm'}`}>
                <div><h4 className="font-semibold text-sm leading-tight">{cat.name}</h4><p className="text-[11px] opacity-70 mt-1 line-clamp-1">{cat.description}</p></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 w-fit">{cat.productCount} Produk</span>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden"><img src={active.image || '/placeholder.jpg'} alt={active.name} className="w-full h-[280px] object-cover" /></div>
            <div className="absolute -bottom-8 left-4 right-4 bg-white rounded-xl shadow-xl p-5 space-y-3">
              <div><h3 className="font-bold text-base">{active.name}</h3><p className="text-xs text-muted-foreground mt-1">{active.description}</p></div>
              <div className="space-y-1">{active.benefits?.slice(0, 3).map((b, i) => <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><Check size={12} className="text-primary mt-[2px]" /><span>{b}</span></div>)}</div>
              <div className="flex items-center justify-between pt-2"><span className="text-xs font-semibold text-muted-foreground">{active.productCount} Produk tersedia</span><Link href={`/product-category/${active.slug}`}><button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Lihat <ArrowRight size={14} /></button></Link></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
