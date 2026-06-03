<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pet_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('pet_type_service_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_item_id')->constrained()->cascadeOnDelete();
            $table->unique(['pet_type_id', 'service_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_type_service_item');
        Schema::dropIfExists('pet_types');
    }
};
