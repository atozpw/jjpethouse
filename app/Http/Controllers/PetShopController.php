<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PetShopController extends Controller
{
    public function show(string $slug): Response
    {
        $product = DB::table('products')
            ->leftJoin('product_categories', 'product_categories.id', '=', 'products.product_category_id')
            ->where('products.slug', $slug)
            ->where('products.is_active', true)
            ->first([
                'products.id',
                'products.name',
                'products.slug',
                'products.description',
                'products.brand',
                'products.pet_type',
                'products.price',
                'products.sku',
                'products.stock',
                'products.weight',
                'products.image',
                'product_categories.id as category_id',
                'product_categories.name as category_name',
                'product_categories.slug as category_slug',
            ]);

        abort_if(! $product, 404);

        $variants = DB::table('product_variants')
            ->where('product_id', $product->id)
            ->orderBy('id')
            ->get(['id', 'name', 'price', 'sku', 'stock'])
            ->map(fn ($variant) => [
                'id' => (int) $variant->id,
                'name' => $variant->name,
                'price' => (float) $variant->price,
                'sku' => $variant->sku,
                'stock' => (int) $variant->stock,
            ]);

        return Inertia::render('Products/Show', [
            'product' => [
                'id' => (int) $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'brand' => $product->brand,
                'pet_type' => $product->pet_type,
                'price' => (float) $product->price,
                'sku' => $product->sku,
                'stock' => (int) $product->stock,
                'weight' => (int) $product->weight,
                'image' => $product->image ?: '/no-image.png',
                'product_category' => [
                    'id' => $product->category_id ? (int) $product->category_id : null,
                    'name' => $product->category_name ?: 'Pet Shop',
                    'slug' => $product->category_slug,
                ],
                'variants' => $variants,
            ],
        ]);
    }

    public function index(): Response
    {
        $categories = DB::table('product_categories')
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'image']);

        $products = DB::table('products')
            ->leftJoin('product_categories', 'product_categories.id', '=', 'products.product_category_id')
            ->where('products.is_active', true)
            ->orderByDesc('products.created_at')
            ->orderBy('products.id')
            ->get([
                'products.id',
                'products.product_category_id as categoryId',
                'product_categories.name as categoryName',
                'product_categories.slug as categorySlug',
                'products.name',
                'products.slug',
                'products.description',
                'products.brand',
                'products.pet_type as petType',
                'products.price',
                'products.stock',
                'products.image',
            ])
            ->map(fn ($product) => [
                'id' => (int) $product->id,
                'categoryId' => $product->categoryId ? (int) $product->categoryId : null,
                'categoryName' => $product->categoryName,
                'categorySlug' => $product->categorySlug,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'brand' => $product->brand,
                'petType' => $product->petType,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'image' => $product->image ?: '/no-image.png',
            ]);

        return Inertia::render('PetShop/Index', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
