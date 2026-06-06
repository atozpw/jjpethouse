<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $perPage = 15;

        $query = DB::table('products')
            ->orderByDesc('products.created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.brand', 'like', "%{$search}%")
                  ->orWhere('products.sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate($perPage, [
            'products.id',
            'products.name',
            'products.slug',
            'products.brand',
            'products.pet_type',
            'products.price',
            'products.stock',
            'products.image',
            'products.is_active',
            'products.created_at',
        ]);

        $categoryNames = DB::table('product_categories')
            ->join('product_category_product', 'product_categories.id', '=', 'product_category_product.product_category_id')
            ->whereIn('product_category_product.product_id', collect($products->items())->pluck('id'))
            ->orderBy('product_categories.name')
            ->get(['product_category_product.product_id', 'product_categories.name'])
            ->groupBy('product_id');

        $products->getCollection()->transform(function ($product) use ($categoryNames) {
            $product->category_names = collect($categoryNames->get($product->id, []))->pluck('name')->values();
            return $product;
        });

        $categories = DB::table('product_categories')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Index', [
            'products'   => $products,
            'categories' => $categories,
            'filters'    => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $categories = DB::table('product_categories')->where('active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Form', [
            'categories' => $categories,
            'product'    => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);
        $relations = $this->relationData($data);
        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(5);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::transaction(function () use ($data, $relations) {
            $productId = DB::table('products')->insertGetId($data);
            $this->syncRelations($productId, $relations);
        });

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $product = DB::table('products')->where('id', $id)->first();
        abort_if(! $product, 404);

        $product->category_ids = DB::table('product_category_product')
            ->where('product_id', $id)
            ->pluck('product_category_id')
            ->map(fn ($categoryId) => (int) $categoryId)
            ->values();
        $product->images = DB::table('product_images')
            ->where('product_id', $id)
            ->orderBy('position')
            ->pluck('url')
            ->values();
        $product->variants = DB::table('product_variants')
            ->where('product_id', $id)
            ->orderBy('id')
            ->get(['name', 'price', 'sku', 'stock']);

        $categories = DB::table('product_categories')->where('active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Products/Form', [
            'categories' => $categories,
            'product'    => $product,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $this->validatedData($request);
        $relations = $this->relationData($data);
        $data['updated_at'] = now();

        DB::transaction(function () use ($id, $data, $relations) {
            DB::table('products')->where('id', $id)->update($data);
            $this->syncRelations($id, $relations);
        });

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('products')->where('id', $id)->delete();

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'category_ids' => 'array',
            'category_ids.*' => 'integer|exists:product_categories,id',
            'description' => 'nullable|string',
            'brand' => 'nullable|string|max:255',
            'pet_type' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'sku' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'weight' => 'nullable|integer|min:0',
            'images' => 'array',
            'images.*' => 'nullable|string|max:255',
            'variants' => 'array',
            'variants.*.name' => 'required|string|max:255',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);
    }

    private function relationData(array &$data): array
    {
        $categoryIds = collect($data['category_ids'] ?? [])->map(fn ($id) => (int) $id)->unique()->values()->all();
        $images = collect($data['images'] ?? [])->filter(fn ($url) => is_string($url) && trim($url) !== '')->map(fn ($url) => trim($url))->unique()->values()->all();
        $variants = collect($data['variants'] ?? [])->values()->all();

        unset($data['category_ids'], $data['images'], $data['variants']);
        $data['product_category_id'] = $categoryIds[0] ?? null;
        $data['image'] = $images[0] ?? null;

        return compact('categoryIds', 'images', 'variants');
    }

    private function syncRelations(int $productId, array $relations): void
    {
        DB::table('product_category_product')->where('product_id', $productId)->delete();
        foreach ($relations['categoryIds'] as $categoryId) {
            DB::table('product_category_product')->insert([
                'product_id' => $productId,
                'product_category_id' => $categoryId,
            ]);
        }

        DB::table('product_images')->where('product_id', $productId)->delete();
        foreach ($relations['images'] as $position => $url) {
            DB::table('product_images')->insert([
                'product_id' => $productId,
                'url' => $url,
                'position' => $position,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('product_variants')->where('product_id', $productId)->delete();
        foreach ($relations['variants'] as $variant) {
            DB::table('product_variants')->insert([
                'product_id' => $productId,
                'name' => $variant['name'],
                'price' => $variant['price'],
                'sku' => $variant['sku'] ?: null,
                'stock' => $variant['stock'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
