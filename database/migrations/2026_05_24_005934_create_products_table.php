<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        // Products table is created with product_variants to preserve migration order.
    }

    public function down(): void
    {
        // Products table is dropped with product_variants.
    }
};
