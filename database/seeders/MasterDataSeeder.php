<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // ── CITIES ──────────────────────────────────────────────────────────
        $cities = [
            ['name' => 'Jakarta', 'slug' => 'jakarta', 'icon' => '🌆'],
            ['name' => 'Bali',    'slug' => 'bali',    'icon' => '🏝️'],
            ['name' => 'Lombok',  'slug' => 'lombok',  'icon' => '🌴'],
        ];

        foreach ($cities as $city) {
            DB::table('cities')->updateOrInsert(
                ['slug' => $city['slug']],
                [...$city, 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        $cityIds = DB::table('cities')->pluck('id', 'slug');

        // ── BRANCHES ─────────────────────────────────────────────────────────
        $branches = [
            // Jakarta
            [
                'city' => 'jakarta', 'name' => 'JJ PET HOUSE JAKARTA',
                'slug' => 'jj-pet-house-jakarta',
                'address' => 'Jl. Radio Dalam Raya Gandaria Utara, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12140',
                'phone' => '0811-346-262', 'whatsapp' => '0811-346-262',
                'image' => '/image/Pict 48.jpeg',
            ],
            // Lombok
            [
                'city' => 'lombok', 'name' => 'JJ PET HOUSE MATARAM',
                'slug' => 'jj-pet-house-mataram',
                'address' => 'Jl. Abdul Kadir Munsyi No.18, Punia, Kec. Mataram, Kota Mataram, Nusa Tenggara Barat 83125',
                'phone' => '0811-346-755', 'whatsapp' => '0811-346-755',
                'image' => '/image/Pict 32.jpeg',
            ],
            // Bali
            [
                'city' => 'bali', 'name' => 'JJ PET HOUSE',
                'slug' => 'jj-pet-house-denpasar',
                'address' => 'Jl. Tukad Batanghari No.77, Dauh Puri Klod, Kec. Denpasar Bar., Kota Denpasar, Bali 80225',
                'phone' => '0811-3999-893', 'whatsapp' => '0811-3999-893',
                'image' => '/image/Pict 48.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET SIDAKARYA',
                'slug' => 'jj-pet-sidakarya',
                'address' => 'Jl. Sidakarya No.38C, Sesetan, Denpasar Selatan, Kota Denpasar, Bali 80224',
                'phone' => '0811-3975-222', 'whatsapp' => '0811-3975-222',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET HOUSE UDAYANA',
                'slug' => 'jj-pet-house-udayana',
                'address' => 'Jl. Raya Uluwatu No.130, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80362',
                'phone' => '0857-3962-9606', 'whatsapp' => '0857-3962-9606',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET NUSA DUA',
                'slug' => 'jj-pet-nusa-dua',
                'address' => 'Jl. Siligita No.50, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali 80363',
                'phone' => '0857-3863-2180', 'whatsapp' => '0857-3863-2180',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET KEDEWATAN',
                'slug' => 'jj-pet-kedewatan',
                'address' => 'Jl. Raya Lungsiakan No.99, Kedewatan, Kecamatan Ubud, Kabupaten Gianyar, Bali 80561',
                'phone' => '0821-4566-5858', 'whatsapp' => '0821-4566-5858',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET PEMOGAN',
                'slug' => 'jj-pet-pemogan',
                'address' => 'Jl. Raya Pemogan No.240, Pemogan, Denpasar Selatan, Kota Denpasar, Bali 80221',
                'phone' => '0811-3818-988', 'whatsapp' => '0811-3818-988',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET AYANI',
                'slug' => 'jj-pet-ayani',
                'address' => 'Jl. Ahmad Yani utara No.371, panguyangan, Denpasar utara, Kota Denpasar, Bali 80115',
                'phone' => '0811-3960-5084', 'whatsapp' => '0811-3960-5084',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET JIMBARAN',
                'slug' => 'jj-pet-jimbaran',
                'address' => '654Q+93W, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80361',
                'phone' => '0811-3999-873', 'whatsapp' => '0811-3999-873',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET PELIATAN',
                'slug' => 'jj-pet-peliatan',
                'address' => 'Br. Teruna, Jl. Cok Gede Rai, Peliatan, Kecamatan Ubud, Kabupaten Gianyar, Bali 80471',
                'phone' => '0812-9677-5858', 'whatsapp' => '0812-9677-5858',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET HOUSE BALIAN',
                'slug' => 'jj-pet-house-balian',
                'address' => 'Jl. Tukad Balian No.133A, Renon, Denpasar Selatan, Kota Denpasar, Bali 80221',
                'phone' => '0811-3810-3349', 'whatsapp' => '0811-3810-3349',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET DALUNG',
                'slug' => 'jj-pet-dalung',
                'address' => 'Jl. Perum Dalung Permai Blok oo No.23, Dalung, Kec. Kuta Utara, Kabupaten Badung, Bali 80361',
                'phone' => '0813-3990-7700', 'whatsapp' => '0813-3990-7700',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET TUBAN',
                'slug' => 'jj-pet-tuban',
                'address' => 'Jl. Raya Tuban No.5, Tuban, Kec. Kuta, Kabupaten Badung, Bali 80361',
                'phone' => '0858-1724-8439', 'whatsapp' => '0858-1724-8439',
                'image' => '/image/Pict 32.jpeg',
            ],
            [
                'city' => 'bali', 'name' => 'JJ PET ULUWATU',
                'slug' => 'jj-pet-uluwatu',
                'address' => 'Jl. Raya Uluwatu, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80361',
                'phone' => '0858-5753-8381', 'whatsapp' => '0858-5753-8381',
                'image' => '/image/Pict 32.jpeg',
            ],
        ];

        foreach ($branches as $branch) {
            DB::table('branches')->updateOrInsert(
                ['slug' => $branch['slug']],
                [
                    'city_id'       => $cityIds[$branch['city']],
                    'name'          => $branch['name'],
                    'slug'          => $branch['slug'],
                    'address'       => $branch['address'],
                    'phone'         => $branch['phone'],
                    'whatsapp'      => $branch['whatsapp'],
                    'email'         => null,
                    'weekday_hours' => '08:00 - 21:00',
                    'weekend_hours' => '08:00 - 22:00',
                    'image'         => $branch['image'],
                    'featured'      => false,
                    'active'        => true,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ]
            );
        }

        $branchIds = DB::table('branches')->pluck('id', 'slug');

        // ── SERVICE CATEGORIES ───────────────────────────────────────────────
        $categories = [
            ['name' => 'Grooming',   'slug' => 'grooming'],
            ['name' => 'Pet Hotel',  'slug' => 'boarding'],
            ['name' => 'Clinic',     'slug' => 'clinic'],
            ['name' => 'Pet Shop',   'slug' => 'shop'],
            ['name' => 'Playground', 'slug' => 'playground'],
            ['name' => 'Delivery',   'slug' => 'delivery'],
            ['name' => 'Pet Love',   'slug' => 'petlove'],
            ['name' => 'Pet Sitter', 'slug' => 'petsitter'],
            ['name' => 'Training',   'slug' => 'training'],
            ['name' => 'Cremation',  'slug' => 'cremation'],
            ['name' => 'Pet Taxi',   'slug' => 'pettaxi'],
        ];

        foreach ($categories as $category) {
            DB::table('service_categories')->updateOrInsert(
                ['slug' => $category['slug']],
                [...$category, 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        $categoryIds = DB::table('service_categories')->pluck('id', 'slug');

        // ── SERVICES ─────────────────────────────────────────────────────────
        // availableModes per service (from Next booking-data.ts)
        $services = [
            [
                'category'        => 'grooming',
                'name'            => 'Pet Grooming',
                'slug'            => 'grooming',
                'description'     => 'Perawatan lengkap mulai dari mandi, potong kuku & rambut, hingga styling profesional menggunakan produk premium.',
                'price'           => 25000,
                'image'           => '/image/Pict 12.jpeg',
                'duration'        => '1.5 - 2 jam',
                'rating'          => 4.9,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => true,
                'schedule_type'     => 'single',
                'active'            => true,
                'available_modes'   => ['Home Visit', 'Walk In', 'Delivery'],
            ],
            [
                'category'        => 'boarding',
                'name'            => 'Pet Boarding',
                'slug'            => 'pet-hotel',
                'description'     => 'Layanan penitipan hewan dengan fasilitas nyaman, pemberian makan terjadwal, dan pengawasan 24 jam.',
                'price'           => 100000,
                'image'           => '/image/Pict 39.jpeg',
                'duration'        => 'Per malam',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => false,
                'schedule_type'     => 'range',
                'active'            => true,
                'available_modes'   => ['Walk In', 'Delivery'],
            ],
            [
                'category'        => 'clinic',
                'name'            => 'Pet Clinic',
                'slug'            => 'clinic',
                'description'     => 'Layanan kesehatan hewan meliputi konsultasi dokter, vaksinasi, pemeriksaan rutin, hingga penanganan darurat.',
                'price'           => 200000,
                'image'           => '/image/Pict 2.jpeg',
                'duration'        => '30 - 60 menit',
                'rating'          => 4.9,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => true,
                'schedule_type'     => 'single',
                'active'            => true,
                'available_modes'   => ['Home Visit', 'Walk In', 'Delivery'],
            ],
            [
                'category'        => 'shop',
                'name'            => 'Pet Shop',
                'slug'            => 'pet-shop',
                'description'     => 'Tersedia berbagai kebutuhan hewan seperti makanan premium, vitamin, aksesoris, dan perlengkapan berkualitas.',
                'price'           => 0,
                'image'           => '/image/Pict 30.jpeg',
                'duration'        => 'Flexible',
                'rating'          => 4.7,
                'requires_schedule' => false,
                'requires_address'  => false,
                'branch_required'   => false,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit', 'Walk In', 'Delivery'],
            ],
            [
                'category'        => 'playground',
                'name'            => 'Pet Playground',
                'slug'            => 'playground',
                'description'     => 'Area bermain aman dengan rumput sintetis dan fasilitas interaktif untuk melatih sosial dan aktivitas hewan.',
                'price'           => 80000,
                'image'           => '/image/Pict 43.jpeg',
                'duration'        => '1 - 2 jam',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit', 'Walk In', 'Delivery'],
            ],
            [
                'category'        => 'delivery',
                'name'            => 'Home Visit & Delivery',
                'slug'            => 'delivery',
                'description'     => 'Layanan kunjungan ke rumah untuk grooming ringan, perawatan, serta pengantaran kebutuhan hewan peliharaan.',
                'price'           => 50000,
                'image'           => '/image/Pict 47.jpeg',
                'duration'        => '1 - 2 jam',
                'rating'          => 4.7,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit', 'Walk In', 'Delivery'],
            ],
            [
                'category'        => 'petlove',
                'name'            => 'Pet Love Care',
                'slug'            => 'petlove',
                'description'     => 'Perawatan penuh kasih untuk hewan peliharaan Anda, memastikan kenyamanan, kebersihan, dan kesehatan optimal.',
                'price'           => 75000,
                'image'           => '/image/Pict 1.jpeg',
                'duration'        => '1 jam',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => true,
                'branch_required'   => false,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit'],
            ],
            [
                'category'        => 'petsitter',
                'name'            => 'Pet Sitter',
                'slug'            => 'petsitter',
                'description'     => 'Layanan penjagaan hewan di rumah atau lokasi tertentu dengan perhatian penuh dan perawatan profesional.',
                'price'           => 100000,
                'image'           => '/image/Pict 2.jpeg',
                'duration'        => 'Per hari',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => true,
                'branch_required'   => false,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit'],
            ],
            [
                'category'        => 'training',
                'name'            => 'Dog Trainer',
                'slug'            => 'training',
                'description'     => 'Pelatihan anjing profesional untuk kepatuhan, perilaku, dan keterampilan khusus dengan metode efektif.',
                'price'           => 150000,
                'image'           => '/image/Pict 41.jpeg',
                'duration'        => '1 jam',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => true,
                'branch_required'   => false,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit'],
            ],
            [
                'category'        => 'cremation',
                'name'            => 'Pet Cremation',
                'slug'            => 'cremation',
                'description'     => 'Layanan kremasi hewan peliharaan dengan proses yang penuh penghormatan dan kenangan yang layak.',
                'price'           => 300000,
                'image'           => '/image/Pict 3.jpeg',
                'duration'        => '2 - 4 jam',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit', 'Delivery'],
            ],
            [
                'category'        => 'pettaxi',
                'name'            => 'Pet Taxi',
                'slug'            => 'pettaxi',
                'description'     => 'Layanan antar-jemput hewan peliharaan yang aman dan nyaman untuk ke klinik, grooming, atau kebutuhan lainnya.',
                'price'           => 50000,
                'image'           => '/image/Pict 4.jpeg',
                'duration'        => 'Per trip',
                'rating'          => 4.8,
                'requires_schedule' => true,
                'requires_address'  => false,
                'branch_required'   => true,
                'requires_people'   => false,
                'schedule_type'     => 'single',
                'active'            => false,
                'available_modes'   => ['Home Visit', 'Delivery'],
            ],
        ];

        foreach ($services as $service) {
            DB::table('services')->updateOrInsert(
                ['slug' => $service['slug']],
                [
                    'service_category_id' => $categoryIds[$service['category']],
                    'name'                => $service['name'],
                    'slug'                => $service['slug'],
                    'description'         => $service['description'],
                    'price'               => $service['price'],
                    'image'               => $service['image'],
                    'duration'            => $service['duration'],
                    'rating'              => $service['rating'],
                    'requires_address'    => $service['requires_address'],
                    'requires_pickup'     => false,
                    'requires_schedule'   => $service['requires_schedule'],
                    'branch_required'     => $service['branch_required'],
                    'requires_people'     => $service['requires_people'],
                    'schedule_type'       => $service['schedule_type'],
                    'active'              => $service['active'],
                    'created_at'          => $now,
                    'updated_at'          => $now,
                ]
            );
        }

        $serviceIds = DB::table('services')->pluck('id', 'slug');

        // ── SERVICE MODES ────────────────────────────────────────────────────
        // Delete and re-seed for idempotency
        DB::table('service_modes')->whereIn('service_id', $serviceIds->values())->delete();

        foreach ($services as $service) {
            $sid = $serviceIds[$service['slug']] ?? null;
            if (!$sid) continue;
            foreach ($service['available_modes'] as $mode) {
                DB::table('service_modes')->insert([
                    'service_id' => $sid,
                    'name'       => $mode,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        // ── SERVICE ITEMS (mirror Next booking-data.ts) ─────────────────────
        DB::table('service_items')->whereIn('service_id', $serviceIds->values())->delete();
        DB::table('pet_type_service_item')->delete();

        foreach (['Anjing', 'Kucing', 'Other'] as $petType) {
            DB::table('pet_types')->updateOrInsert(
                ['slug' => Str::slug($petType)],
                ['name' => $petType, 'slug' => Str::slug($petType), 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }
        $petTypeIds = DB::table('pet_types')->pluck('id', 'name');

        $serviceItemsSeedRaw = file_get_contents(database_path('seeders/data/service_items.json'));
        $serviceItemsSeed = json_decode($serviceItemsSeedRaw, true) ?? [];

        foreach ($serviceItemsSeed as $item) {
            $sid = $serviceIds[$item['service_slug']] ?? null;
            if (!$sid) continue;

            $itemId = DB::table('service_items')->insertGetId([
                'service_id' => $sid,
                'name' => $item['name'],
                'price' => $item['price'],
                'type' => $item['type'] === 'extra' ? 'additional' : $item['type'],
                'active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach (($item['petType'] ?? []) as $petTypeName) {
                $pid = $petTypeIds[$petTypeName] ?? null;
                if (!$pid) continue;
                DB::table('pet_type_service_item')->updateOrInsert([
                    'pet_type_id' => $pid,
                    'service_item_id' => $itemId,
                ]);
            }
        }

        // ── BRANCH ↔ SERVICE (pivot) ──────────────────────────────────────
        // Map which branch slugs offer which service slugs (from bookingservices in Next)
        $branchServiceMap = [
            'jj-pet-house-jakarta'  => ['grooming', 'pet-hotel', 'clinic'],
            'jj-pet-house-mataram'  => ['grooming'],
            'jj-pet-house-denpasar' => ['grooming'],
            'jj-pet-sidakarya'      => ['grooming'],
            'jj-pet-house-udayana'  => ['grooming', 'pet-hotel', 'clinic'],
            'jj-pet-nusa-dua'       => ['grooming'],
            'jj-pet-kedewatan'      => ['grooming'],
            'jj-pet-pemogan'        => ['grooming'],
            'jj-pet-ayani'          => ['grooming', 'clinic'],
            'jj-pet-jimbaran'       => ['grooming'],
            'jj-pet-peliatan'       => ['grooming'],
            'jj-pet-house-balian'   => ['grooming', 'pet-hotel', 'clinic'],
            'jj-pet-dalung'         => ['grooming'],
            'jj-pet-tuban'          => ['grooming'],
            'jj-pet-uluwatu'        => ['grooming'],
        ];

        foreach ($branchServiceMap as $branchSlug => $serviceSlugs) {
            $bid = $branchIds[$branchSlug] ?? null;
            if (!$bid) continue;
            foreach ($serviceSlugs as $serviceSlug) {
                $sid = $serviceIds[$serviceSlug] ?? null;
                if (!$sid) continue;
                DB::table('branch_service')->updateOrInsert(
                    ['branch_id' => $bid, 'service_id' => $sid]
                );
            }
        }

        // ── PET TYPES ────────────────────────────────────────────────────────
        foreach (['Anjing', 'Kucing', 'Other'] as $petType) {
            DB::table('pet_types')->updateOrInsert(
                ['slug' => Str::slug($petType)],
                ['name' => $petType, 'slug' => Str::slug($petType), 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // ── TIME SLOTS ───────────────────────────────────────────────────────
        foreach (['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'] as $time) {
            DB::table('time_slots')->updateOrInsert(
                ['time' => $time],
                ['time' => $time, 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        // ── STAFF: DOCTORS ───────────────────────────────────────────────────
        $doctors = [
            ['branch' => 'jj-pet-house-jakarta',  'name' => 'Drh. Agung Supriyono',                         'specialty' => 'Exotic Pet, Dermatology, Surgery Expert, Stemcell Therapy, Animal Communicator', 'image' => '/doctor/Drh Agung Supriono.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Frida Ayu Salsana Billa',                 'specialty' => 'General Practitioner',                                                         'image' => '/doctor/Frida Ayu Salsana Billa.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Yunita Atok',                             'specialty' => 'General Practitioner',                                                         'image' => '/doctor/yunita atok.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Chendini Maharani',                       'specialty' => 'General Practitioner',                                                         'image' => '/doctor/Chendini Maharani.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Adinda, S.KH',                            'specialty' => 'General Veterinary Practitioner, Internal Medicine, Veterinary Dermatology, Emergency and Critical Care, Basic Surgery', 'image' => '/doctor/adinda 55.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Putu Aditya Pratama Artha Putra, S.KH',  'specialty' => 'Surgery, Internal Medicine, Vaccine, Dentistry, Urgent Care',                  'image' => '/doctor/Aditya Pratama.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Owen Fernando',                          'specialty' => 'General Practitioner',                                                         'image' => '/doctor/Owen Fernando.png'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Devi',                                   'specialty' => 'Internal Medicine',                                                            'image' => '/doctor/Drh. Devi - Internis.jpeg'],
            ['branch' => 'jj-pet-house-balian',   'name' => 'Drh. Tuis',                                   'specialty' => 'Surgery',                                                                      'image' => '/doctor/Drh Tuis - Surgeon.jpeg'],
            ['branch' => 'jj-pet-house-udayana',  'name' => 'Drh. Christiyanti Rambu Gedi',                'specialty' => 'General Practitioner',                                                         'image' => '/doctor/Christiyanti Rambu Gedi.png'],
            ['branch' => 'jj-pet-house-udayana',  'name' => 'Drh. Jessy Filomena Fernanda Bento, S.KH',   'specialty' => 'General Practitioner, Special Interest Dermatology',                           'image' => '/doctor/Jessy Filomena.png'],
            ['branch' => 'jj-pet-house-udayana',  'name' => 'Drh. Dewi Ratnasari',                         'specialty' => 'General Practitioner, Special Interest Hematology and Radiography',             'image' => '/doctor/Dewi Ratnasari.png'],
            ['branch' => 'jj-pet-house-udayana',  'name' => 'Drh. I Made Agus Wirawan',                    'specialty' => 'General Practitioner',                                                         'image' => '/doctor/I Made Agus Wirawan.png'],
            ['branch' => 'jj-pet-house-udayana',  'name' => 'Drh. Sagung Istri Wahyunin diarie, S.,kh.',  'specialty' => 'General Practitioner',                                                         'image' => '/doctor/Sagung Istri Wahyunin.png'],
            ['branch' => 'jj-pet-house-udayana',  'name' => 'Drh. Miranti Rahma Yunita',                   'specialty' => 'General Practitioner',                                                         'image' => '/doctor/Miranti Rahma Yunita.png'],
        ];

        // ── STAFF: GROOMERS ──────────────────────────────────────────────────
        $groomers = [
            // Jakarta
            ['branch' => 'jj-pet-house-jakarta', 'name' => 'Rama',              'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/rama.png'],
            ['branch' => 'jj-pet-house-jakarta', 'name' => 'Fallen',            'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/fallen.png'],
            ['branch' => 'jj-pet-house-jakarta', 'name' => 'Ama',               'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Ama-pusat.jpeg'],
            // Jimbaran
            ['branch' => 'jj-pet-jimbaran',      'name' => 'Acik',              'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/acik-jimbaran.jpeg'],
            // Udayana
            ['branch' => 'jj-pet-house-udayana', 'name' => 'Ari',               'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Ari-Udayana.jpeg'],
            ['branch' => 'jj-pet-house-udayana', 'name' => 'Bio',               'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Bio-Udayana.jpeg'],
            // Sidakarya
            ['branch' => 'jj-pet-sidakarya',     'name' => 'Crispinus M.Goa',   'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Cris-sidakarya pemogan.jpeg'],
            // Peliatan
            ['branch' => 'jj-pet-peliatan',      'name' => 'Daniel',            'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Daniel-peliatan.jpeg'],
            // Dalung
            ['branch' => 'jj-pet-dalung',        'name' => 'Kadek Heri Wantika','specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Kadek Heri Wantika-dalung.jpeg'],
            // Balian
            ['branch' => 'jj-pet-house-balian',  'name' => 'Alin Sigalingging', 'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Balian Alin Sigalingging.jpeg'],
            ['branch' => 'jj-pet-house-balian',  'name' => 'Julius Indra',      'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Kennel Balian Julius Indra.jpeg'],
            ['branch' => 'jj-pet-house-balian',  'name' => 'Supendinata',       'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Kennel Balian Supendinata.jpeg'],
            ['branch' => 'jj-pet-house-balian',  'name' => 'Robi Benu',         'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Robi Benu-Balian.jpeg'],
            // Kedewatan
            ['branch' => 'jj-pet-kedewatan',     'name' => 'Rensa',             'specialty' => 'Dog & Cat Grooming', 'image' => '/groomer/Rensa-Kedewatan.jpeg'],
        ];

        foreach ($doctors as $person) {
            $bid = $branchIds[$person['branch']] ?? null;
            DB::table('staff')->updateOrInsert(
                ['name' => $person['name']],
                [
                    'branch_id'  => $bid,
                    'type'       => 'doctor',
                    'specialty'  => $person['specialty'],
                    'image'      => $person['image'],
                    'active'     => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        foreach ($groomers as $person) {
            $bid = $branchIds[$person['branch']] ?? null;
            DB::table('staff')->updateOrInsert(
                ['name' => $person['name']],
                [
                    'branch_id'  => $bid,
                    'type'       => 'groomer',
                    'specialty'  => $person['specialty'],
                    'image'      => $person['image'],
                    'active'     => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // ── PRODUCT CATEGORIES ───────────────────────────────────────────────
        $productCategories = [
            ['name' => 'Pet Food',        'slug' => 'pet-food',        'description' => 'Makanan berkualitas tinggi untuk anjing dan kucing',                     'image' => 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=1171&auto=format&fit=crop'],
            ['name' => 'Pet Accessories', 'slug' => 'pet-accessories', 'description' => 'Aksesori dan perlengkapan untuk kenyamanan hewan peliharaan',             'image' => 'https://images.unsplash.com/photo-1605092116196-404f5b8caa15?q=80&w=1170&auto=format&fit=crop'],
            ['name' => 'Pet Essential',   'slug' => 'pet-essential',   'description' => 'Produk perawatan dasar dan perlengkapan wajib untuk hewan',               'image' => 'https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?q=80&w=1170&auto=format&fit=crop'],
            ['name' => 'Pet Healthy',     'slug' => 'pet-healthy',     'description' => 'Suplemen dan produk kesehatan premium untuk hewan peliharaan',            'image' => 'https://images.unsplash.com/photo-1625321171045-1fea4ac688e9?q=80&w=1171&auto=format&fit=crop'],
        ];

        foreach ($productCategories as $category) {
            DB::table('product_categories')->updateOrInsert(
                ['slug' => $category['slug']],
                [...$category, 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }

        $productCategoryIds = DB::table('product_categories')->pluck('id', 'slug');

        $products = [
            [
                'category' => 'pet-food',
                'name' => 'Royal Canin Mini Adult 2kg',
                'slug' => 'royal-canin-mini-adult-2kg',
                'description' => 'Makanan kering premium untuk anjing ras kecil usia dewasa. Membantu menjaga berat badan ideal, kesehatan pencernaan, dan kualitas bulu.',
                'brand' => 'Royal Canin',
                'pet_type' => 'Anjing',
                'price' => 235000,
                'sku' => 'RC-MINI-ADULT-2KG',
                'stock' => 42,
                'weight' => 2000,
                'image' => '/image/Pict 29.jpeg',
                'variants' => [
                    ['name' => '2kg', 'price' => 235000, 'sku' => 'RC-MINI-2KG', 'stock' => 42],
                    ['name' => '4kg', 'price' => 430000, 'sku' => 'RC-MINI-4KG', 'stock' => 18],
                ],
            ],
            [
                'category' => 'pet-food',
                'name' => 'Whiskas Tuna Adult 1.2kg',
                'slug' => 'whiskas-tuna-adult-12kg',
                'description' => 'Makanan kucing dewasa rasa tuna dengan nutrisi lengkap untuk energi harian, bulu sehat, dan pencernaan yang baik.',
                'brand' => 'Whiskas',
                'pet_type' => 'Kucing',
                'price' => 78000,
                'sku' => 'WH-TUNA-ADULT-12KG',
                'stock' => 65,
                'weight' => 1200,
                'image' => '/image/Pict 30.jpeg',
                'variants' => [
                    ['name' => '1.2kg', 'price' => 78000, 'sku' => 'WH-TUNA-12KG', 'stock' => 65],
                    ['name' => '3kg', 'price' => 180000, 'sku' => 'WH-TUNA-3KG', 'stock' => 24],
                ],
            ],
            [
                'category' => 'pet-accessories',
                'name' => 'Adjustable Pet Harness Blue',
                'slug' => 'adjustable-pet-harness-blue',
                'description' => 'Harness nyaman dan kuat untuk jalan santai. Dilengkapi strap yang mudah disesuaikan dan bahan breathable.',
                'brand' => 'JJ Pet House',
                'pet_type' => 'Anjing',
                'price' => 125000,
                'sku' => 'JJ-HARNESS-BLUE',
                'stock' => 30,
                'weight' => 250,
                'image' => '/image/Pict 32.jpeg',
                'variants' => [
                    ['name' => 'Small', 'price' => 125000, 'sku' => 'JJ-HARNESS-S', 'stock' => 12],
                    ['name' => 'Medium', 'price' => 135000, 'sku' => 'JJ-HARNESS-M', 'stock' => 10],
                    ['name' => 'Large', 'price' => 145000, 'sku' => 'JJ-HARNESS-L', 'stock' => 8],
                ],
            ],
            [
                'category' => 'pet-essential',
                'name' => 'Pet Grooming Brush Premium',
                'slug' => 'pet-grooming-brush-premium',
                'description' => 'Sisir grooming premium untuk membantu mengurangi bulu rontok dan menjaga bulu hewan tetap rapi.',
                'brand' => 'JJ Pet House',
                'pet_type' => 'Anjing & Kucing',
                'price' => 89000,
                'sku' => 'JJ-BRUSH-PREMIUM',
                'stock' => 55,
                'weight' => 180,
                'image' => '/image/Pict 39.jpeg',
                'variants' => [
                    ['name' => 'Regular', 'price' => 89000, 'sku' => 'JJ-BRUSH-REG', 'stock' => 55],
                ],
            ],
            [
                'category' => 'pet-healthy',
                'name' => 'Vitamin Bulu Sehat 60 Tablet',
                'slug' => 'vitamin-bulu-sehat-60-tablet',
                'description' => 'Suplemen harian untuk membantu menjaga kesehatan kulit, kilau bulu, dan daya tahan tubuh hewan peliharaan.',
                'brand' => 'Pet Healthy',
                'pet_type' => 'Anjing & Kucing',
                'price' => 99000,
                'sku' => 'PH-VIT-FUR-60',
                'stock' => 38,
                'weight' => 120,
                'image' => '/image/Pict 44.jpeg',
                'variants' => [
                    ['name' => '60 Tablet', 'price' => 99000, 'sku' => 'PH-VIT-60', 'stock' => 38],
                    ['name' => '120 Tablet', 'price' => 180000, 'sku' => 'PH-VIT-120', 'stock' => 16],
                ],
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['slug' => $product['slug']],
                [
                    'product_category_id' => $productCategoryIds[$product['category']] ?? null,
                    'name' => $product['name'],
                    'slug' => $product['slug'],
                    'description' => $product['description'],
                    'brand' => $product['brand'],
                    'pet_type' => $product['pet_type'],
                    'price' => $product['price'],
                    'sku' => $product['sku'],
                    'stock' => $product['stock'],
                    'weight' => $product['weight'],
                    'image' => $product['image'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $productIds = DB::table('products')->pluck('id', 'slug');

        foreach ($products as $product) {
            $productId = $productIds[$product['slug']];
            $categoryId = $productCategoryIds[$product['category']] ?? null;

            if ($categoryId) {
                DB::table('product_category_product')->updateOrInsert([
                    'product_id' => $productId,
                    'product_category_id' => $categoryId,
                ]);
            }

            DB::table('product_images')->updateOrInsert(
                ['product_id' => $productId, 'url' => $product['image']],
                ['position' => 0, 'created_at' => $now, 'updated_at' => $now]
            );

            foreach ($product['variants'] as $variant) {
                DB::table('product_variants')->updateOrInsert(
                    ['sku' => $variant['sku']],
                    [
                        'product_id' => $productId,
                        'name' => $variant['name'],
                        'price' => $variant['price'],
                        'sku' => $variant['sku'],
                        'stock' => $variant['stock'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }

        // ── FORUM CATEGORIES ─────────────────────────────────────────────────
        $forumCategories = [
            ['name' => 'General Chat',    'slug' => 'general-chat',    'icon' => '💬', 'color' => 'bg-blue-50'],
            ['name' => 'Pet Stories',     'slug' => 'pet-stories',     'icon' => '📖', 'color' => 'bg-pink-50'],
            ['name' => 'Tips & Tricks',   'slug' => 'tips-tricks',     'icon' => '💡', 'color' => 'bg-green-50'],
            ['name' => 'Recommendations', 'slug' => 'recommendations', 'icon' => '⭐', 'color' => 'bg-yellow-50'],
        ];

        foreach ($forumCategories as $category) {
            DB::table('forum_categories')->updateOrInsert(
                ['slug' => $category['slug']],
                [...$category, 'description' => null, 'active' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }
    }
}
