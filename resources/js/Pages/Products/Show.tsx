import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Footer } from '@/Components/Footer';
import { Header } from '@/Components/Header';

type ProductVariant = {
  id: number;
  name: string;
  price: number;
  sku: string | null;
  stock: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  pet_type: string | null;
  price: number;
  sku: string | null;
  stock: number;
  weight: number;
  image: string;
  product_category: {
    id: number | null;
    name: string;
    slug: string | null;
  };
  variants: ProductVariant[];
};

type Props = {
  product: Product;
};

export default function ProductShow({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedVariantId) ?? null,
    [product.variants, selectedVariantId],
  );

  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;
  const subtotal = price * quantity;

  const handleAddToCart = () => {
    if (product.variants.length && !selectedVariant) {
      alert('Pilih varian dulu');
      return;
    }

    router.post('/cart/items', {
      product_id: product.id,
      variant_id: selectedVariant?.id ?? null,
      quantity,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setAdded(true);
        setQuantity(1);
        setSelectedVariantId(null);
        window.setTimeout(() => setAdded(false), 1800);
      },
    });
  };

  return (
    <>
      <Header />

      {added && (
        <div className="fixed right-4 top-28 z-50 animate-bounce rounded-xl border bg-white px-4 py-3 text-sm font-semibold text-primary shadow-lg">
          Produk masuk ke keranjang
        </div>
      )}

      <main className="min-h-screen bg-background pb-24 lg:pb-12">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-10">
            <div className="space-y-3">
              <div className="relative h-[260px] sm:h-[300px] lg:aspect-square lg:h-auto rounded-xl overflow-hidden border bg-white">
                <img
                  src={product.image ?? '/no-image.png'}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 lg:p-6"
                />
              </div>

              <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg border bg-muted/40"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:space-y-5">
              <nav className="text-xs text-muted-foreground">
                Home / {product.product_category.name}
              </nav>

              <h1 className="text-xl lg:text-3xl font-bold">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-sm">
                <Star size={14} className="text-amber-500" fill="currentColor" />
                <span className="font-medium">4.9</span>
                <span className="text-muted-foreground">• 1.431 ulasan</span>
              </div>

              <div className="text-2xl lg:text-3xl font-bold text-primary">
                Rp {Number(price).toLocaleString('id-ID')}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Varian:
                  <span className="ml-2 text-primary">
                    {selectedVariant?.name ?? '—'}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariantId;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`
                          px-3 py-1.5 text-xs lg:text-sm rounded-full border
                          ${active
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'hover:border-primary/40'}
                        `}
                      >
                        {variant.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:block pt-4 space-y-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-2"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="px-4 text-sm font-medium">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity((current) => current + 1)}
                      className="px-3 py-2"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Stok {stock.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.variants.length > 0 && !selectedVariant}
                  className="w-full h-12 text-base gap-2 bg-primary text-white inline-flex items-center justify-center rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} />
                  Masukkan Keranjang
                </button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">
                  Deskripsi Produk
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          <div className="h-24 lg:hidden" />
        </div>
      </main>

      <div className="
        lg:hidden
        fixed inset-x-0 bottom-0 z-20
        bg-card border-t
        p-4 space-y-4
      ">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2"
            >
              <Minus size={14} />
            </button>

            <span className="px-4 text-sm font-medium">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((current) => current + 1)}
              className="px-3 py-2"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            Stok {stock.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between text-sm font-semibold">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.variants.length > 0 && !selectedVariant}
          className="w-full h-11 gap-2 bg-primary text-white inline-flex items-center justify-center rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          Masukkan Keranjang
        </button>
      </div>

      <Footer />
    </>
  );
}
