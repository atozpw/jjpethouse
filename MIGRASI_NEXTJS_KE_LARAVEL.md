# Migrasi Next.js Mock -> Laravel/Inertia (`c:/dev/pethouse`)

## Ringkasan

Dokumen ini list fitur/page/component dari `C:\dev\pet-shop-mockup` yang **sudah** dipindah ke project Laravel/Inertia.

## Yang Sudah Dimigrasikan

### 1) Routing + Page utama

- [x] `/` -> `resources/js/Pages/Home.tsx`
- [x] `/booking` -> `resources/js/Pages/Booking/Index.tsx`
- [x] `/cart` -> `resources/js/Pages/Cart/Index.tsx`
- [x] `/pet-shop` -> `resources/js/Pages/PetShop/Index.tsx`
- [x] `/products/{slug}` -> `resources/js/Pages/Products/Show.tsx`
- [x] `/services` -> `resources/js/Pages/Services/Index.tsx`
- [x] `/clinic` -> `resources/js/Pages/Clinic/Index.tsx`
- [x] `/branches` -> `resources/js/Pages/Branches/Index.tsx`

### 2) Backend route Laravel untuk cart

- [x] `GET /cart` -> `CartController@index`
- [x] `POST /cart/items` -> `CartController@add`
- [x] `POST /cart/items/{index}` -> `CartController@update`
- [x] `DELETE /cart/items/{index}` -> `CartController@remove`
- [x] `POST /cart/clear` -> `CartController@clear`

File terkait:

- `routes/web.php`
- `app/Http/Controllers/CartController.php`

### 3) Komponen UI utama (adaptasi dari mock)

- [x] `Header` -> `resources/js/Components/Header.tsx`
- [x] `Footer` -> `resources/js/Components/Footer.tsx`
- [x] `HeroSection` -> `resources/js/Components/HeroSection.tsx`
- [x] `ProductCategoriesShowcase` -> `resources/js/Components/ProductCategoriesShowcase.tsx`
- [x] `ServiceCard` -> `resources/js/Components/ServiceCard.tsx`

### 4) Auth dasar

- [x] Login/Register/Forgot/Reset/Verify (Breeze + Inertia)
- [x] Profile edit/update/delete (Breeze)

### 5) Data flow service (versi saat ini)

- [x] `/services` pakai data dari tabel `services` + `service_categories`
- [x] Service aktif dan nonaktif tetap tampil di Home dan Services
- [x] Button booking disabled untuk service nonaktif
- [x] UI mengikuti Next.js mockup `app/services/page.tsx` + `components/service-card.tsx`

### 6) Data flow clinic (versi saat ini)

- [x] `/clinic` pakai data dokter dari tabel `staff` + `branches` + `cities`
- [x] UI mengikuti Next.js mockup `app/clinic/page.tsx`

### 7) Data flow branches / Our Store (versi saat ini)

- [x] `/branches` pakai data cabang dari tabel `branches` + `cities` + `branch_service`
- [x] UI mengikuti Next.js mockup `app/branches/page.tsx`

### 8) Data flow cart (versi saat ini)

- [x] Cart pakai **session Laravel** (minimal working)
- [x] Hitung subtotal/total/pajak di page cart
- [x] Update qty, remove item, clear cart
- [x] Cek ketersediaan sederhana dari `products`/`product_variants`

## Catatan Scope

- Fokus migrasi tahap ini: **cart bisa jalan dulu**.
- Checkout product, pet-shop listing, product detail, API parity Next.js belum penuh.

## Referensi File Migrasi Cart

- `app/Http/Controllers/CartController.php`
- `resources/js/Pages/Cart/Index.tsx`
- `routes/web.php`
