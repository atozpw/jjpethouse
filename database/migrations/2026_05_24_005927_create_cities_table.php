<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        // Cities table is created in 2026_05_24_005926_create_cities_table.php to preserve FK order.
    }

    public function down(): void
    {
        // Cities table is dropped by 2026_05_24_005926_create_cities_table.php.
    }
};
