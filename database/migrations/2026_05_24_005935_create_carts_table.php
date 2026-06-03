<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        // Carts table is created with cart_items to preserve migration order.
    }

    public function down(): void
    {
        // Carts table is dropped with cart_items.
    }
};
