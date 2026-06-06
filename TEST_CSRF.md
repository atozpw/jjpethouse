# Testing CSRF Token Import

## Langkah 1: Clear Cache & Restart Server
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan serve
```

## Langkah 2: Buka Browser DevTools
1. Buka aplikasi di browser (misalnya http://localhost:8000)
2. Tekan F12 untuk buka DevTools
3. Login sebagai admin
4. Buka halaman Import: http://localhost:8000/admin/products/import

## Langkah 3: Cek CSRF Token di Console
Paste di Console:
```javascript
console.log('CSRF Token:', document.querySelector('meta[name="csrf-token"]')?.content);
console.log('Cookies:', document.cookie);
```

Hasilnya harus:
- CSRF Token: ada string panjang (bukan null/undefined)
- Cookies: harus ada cookie dengan nama seperti `pethouse_session`

## Langkah 4: Monitor Network Request
1. Buka tab Network di DevTools
2. Upload file JSON
3. Lihat request `upload` 
4. Cek:
   - Request Headers: harus ada `X-CSRF-TOKEN`
   - Response: lihat status code dan error message

## Langkah 5: Cek Laravel Logs
Jika masih error, lihat log di:
```
storage/logs/laravel.log
```

## Troubleshooting

### Jika CSRF token null/undefined:
- app.blade.php tidak di-load dengan benar
- Clear view cache: `php artisan view:clear`
- Restart dev server

### Jika cookie tidak ada:
- Browser blocking cookies
- SESSION_DOMAIN salah di .env
- Coba ganti SESSION_DOMAIN=null di .env

### Jika request tidak ada X-CSRF-TOKEN header:
- JavaScript error di frontend
- Cek Console untuk error

### Jika status 419 (CSRF Token Mismatch):
- Session cookie tidak match
- Clear browser cookies
- Pastikan APP_URL sesuai dengan URL akses
