<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('booking_pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pet_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('main_service_item_id')->nullable()->constrained('service_items')->nullOnDelete();
            $table->foreignId('additional_service_item_id')->nullable()->constrained('service_items')->nullOnDelete();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_pets');
    }
};
