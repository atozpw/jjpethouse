<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->string('image')->nullable();
            $table->string('duration')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->string('url')->nullable();
            $table->boolean('requires_address')->default(false);
            $table->boolean('requires_pickup')->default(false);
            $table->boolean('requires_schedule')->default(true);
            $table->boolean('branch_required')->default(true);
            $table->boolean('requires_people')->default(false);
            $table->string('schedule_type')->default('single');
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('branch_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->unique(['branch_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_service');
        Schema::dropIfExists('services');
    }
};
