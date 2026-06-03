import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Footer } from '@/Components/Footer';
import { Header } from '@/Components/Header';

type CartItem = {
  key: string;
  productId: number;
  variantId: number | null;
  quantity: number;
  name: string;
  image: string;
  price: number;
  subtotal: number;
  available: boolean;
};

type Props = {
  items: CartItem[];
  total: number;
  hasUnavailable: boolean;
};

export default function CartIndex({ items, total, hasUnavailable }: Props) {
  const [removingKeys, setRemovingKeys] = useState<string[]>([]);
  const tax = total * 0.1;
  const grandTotal = total + tax;

  const updateQty = (index: string, quantity: number) => {
    router.post(`/cart/items/${index}`, { quantity }, { preserveScroll: true });
  };

  const removeItem = (index: string) => {
    setRemovingKeys((current) => [...current, index]);
    window.setTimeout(() => {
      router.delete(`/cart/items/${index}`, { preserveScroll: true });
    }, 220);
  };

  const clearCart = () => {
    setRemovingKeys(items.map((item) => item.key));
    window.setTimeout(() => {
      router.post('/cart/clear', {}, { preserveScroll: true });
    }, 220);
  };

  if (items.length === 0) {
    return (
      <>
        <Head title="Cart" />
        <Header />
        <main className="min-h-screen bg-background flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center bg-card rounded-2xl border p-8 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingCart size={36} className="text-muted-foreground" />
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-2">Keranjang kamu masih kosong</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Yuk, cari produk favorit kamu dan mulai belanja
              </p>

              <Link
                href="/"
                className="w-full h-12 text-base font-semibold inline-flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90"
              >
                Kembali ke Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head title="Cart" />
      <Header />

      <main className="min-h-screen bg-background py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Keranjang</h1>
              <p className="text-sm text-muted-foreground">{items.length} produk</p>
            </div>

            <button
              onClick={clearCart}
              className="hidden sm:block text-sm text-red-600 hover:underline"
            >
              Kosongkan keranjang
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`bg-card rounded-xl border p-4 sm:p-6 space-y-4 transition-all duration-200 ${
                    removingKeys.includes(item.key) ? 'scale-95 opacity-0 -translate-x-4' : 'scale-100 opacity-100 translate-x-0'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border bg-muted">
                      <img src={item.image || '/no-image.png'} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold leading-snug">{item.name}</h3>

                      {!item.available && (
                        <p className="mt-1 text-xs text-red-500">Produk tidak tersedia</p>
                      )}

                      <p className="mt-2 text-primary font-bold">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border overflow-hidden">
                      <button
                        disabled={!item.available}
                        onClick={() => updateQty(item.key, item.quantity - 1)}
                        className="px-3 py-1 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="px-4 text-sm font-semibold">{item.quantity}</span>

                      <button
                        disabled={!item.available}
                        onClick={() => updateQty(item.key, item.quantity + 1)}
                        className="px-3 py-1 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        Rp {Number(item.subtotal).toLocaleString('id-ID')}
                      </span>

                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border p-6 space-y-6 sticky top-24">
                <h2 className="text-lg font-bold">Ringkasan Belanja</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pajak (10%)</span>
                    <span className="font-medium">Rp {tax.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pengiriman</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between items-center rounded-xl bg-primary/10 px-4 py-3">
                  <span className="font-semibold text-primary">Total Pembayaran</span>
                  <span className="text-xl font-extrabold text-primary">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  disabled={hasUnavailable}
                  className="w-full h-12 text-base font-semibold rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  Checkout (belum aktif)
                </button>

                {hasUnavailable && (
                  <p className="text-xs text-red-500 text-center">
                    Hapus produk yang tidak tersedia untuk lanjut.
                  </p>
                )}

                <Link
                  href="/"
                  className="w-full h-11 border rounded-md inline-flex items-center justify-center text-sm hover:bg-muted"
                >
                  ← Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
