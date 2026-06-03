<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        // Orders table is created with order_items to preserve migration order.
    }

    public function down(): void
    {
        // Orders table is dropped with order_items.
    }
};
