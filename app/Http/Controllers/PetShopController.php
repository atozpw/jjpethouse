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

        $categories = DB::table('product_categories')
            ->join('product_category_product', 'product_categories.id', '=', 'product_category_product.product_category_id')
            ->where('product_category_product.product_id', $product->id)
            ->orderBy('product_categories.name')
            ->get(['product_categories.id', 'product_categories.name', 'product_categories.slug'])
            ->map(fn ($category) => [
                'id' => (int) $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ]);

        $images = DB::table('product_images')
            ->where('product_id', $product->id)
            ->orderBy('position')
            ->orderBy('id')
            ->pluck('url');

        if ($images->isEmpty() && $product->image) {
            $images->push($product->image);
        }

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
                'images' => $images->values(),
                'categories' => $categories,
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
            ->where('products.is_active', true)
            ->orderByDesc('products.created_at')
            ->orderBy('products.id')
            ->get([
                'products.id',
                'products.name',
                'products.slug',
                'products.description',
                'products.brand',
                'products.pet_type as petType',
                'products.price',
                'products.stock',
                'products.image',
            ]);

        $categoriesByProduct = DB::table('product_categories')
            ->join('product_category_product', 'product_categories.id', '=', 'product_category_product.product_category_id')
            ->whereIn('product_category_product.product_id', $products->pluck('id'))
            ->orderBy('product_categories.name')
            ->get([
                'product_category_product.product_id',
                'product_categories.id',
                'product_categories.name',
                'product_categories.slug',
            ])
            ->groupBy('product_id');

        $products = $products->map(function ($product) use ($categoriesByProduct) {
                $productCategories = collect($categoriesByProduct->get($product->id, []))
                    ->map(fn ($category) => [
                        'id' => (int) $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                    ])
                    ->values();

                return [
                    'id' => (int) $product->id,
                    'categories' => $productCategories,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'brand' => $product->brand,
                    'petType' => $product->petType,
                    'price' => (float) $product->price,
                    'stock' => (int) $product->stock,
                    'image' => $product->image ?: '/no-image.png',
                ];
            });

        return Inertia::render('PetShop/Index', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
