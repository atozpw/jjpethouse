<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_category_product', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['product_id', 'product_category_id']);
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('url');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
            $table->unique(['product_id', 'url']);
        });

        DB::table('products')
            ->whereNotNull('product_category_id')
            ->orderBy('id')
            ->each(function ($product) {
                DB::table('product_category_product')->insertOrIgnore([
                    'product_id' => $product->id,
                    'product_category_id' => $product->product_category_id,
                ]);
            });

        DB::table('products')
            ->whereNotNull('image')
            ->where('image', '<>', '')
            ->orderBy('id')
            ->each(function ($product) {
                DB::table('product_images')->insertOrIgnore([
                    'product_id' => $product->id,
                    'url' => $product->image,
                    'position' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_category_product');
    }
};
