<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductImportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Products/Import');
    }

    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:json|max:10240',
            ]);

            $file = $request->file('file');
            $content = file_get_contents($file->getRealPath());
            $data = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format JSON tidak valid: ' . json_last_error_msg(),
                ], 422);
            }

            if (!isset($data['products']) || !is_array($data['products'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'JSON harus memiliki field "products" berupa array',
                ], 422);
            }

            $products = $data['products'];
            $total = count($products);
            $success = 0;
            $failed = 0;
            $errors = [];
            $imported = [];

            foreach ($products as $index => $product) {
                try {
                    $result = $this->importProduct($product);
                    if ($result['success']) {
                        $success++;
                        $imported[] = $result['data'];
                    } else {
                        $failed++;
                        $errors[] = "Produk #" . ($index + 1) . ": " . $result['message'];
                    }
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = "Produk #" . ($index + 1) . ": " . $e->getMessage();
                }
            }

            return response()->json([
                'success' => $success > 0,
                'summary' => [
                    'total' => $total,
                    'success' => $success,
                    'failed' => $failed,
                    'percent' => $total > 0 ? round(($success / $total) * 100, 1) : 0,
                ],
                'errors' => array_slice($errors, 0, 50),
                'imported' => $imported,
                'message' => $success === 0 && $failed > 0
                    ? 'Tidak ada produk yang berhasil diimpor.'
                    : null,
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function importProduct($product)
    {
        if (!is_array($product)) {
            return [
                'success' => false,
                'message' => 'Data produk harus berupa object JSON',
            ];
        }

        $required = ['itemid', 'name', 'price', 'stock'];
        foreach ($required as $field) {
            if (!array_key_exists($field, $product) || $product[$field] === null || $product[$field] === '') {
                return [
                    'success' => false,
                    'message' => "Field '{$field}' harus ada dan tidak boleh kosong",
                ];
            }
        }

        if (!is_numeric($product['price']) || (float) $product['price'] < 0) {
            return [
                'success' => false,
                'message' => "Field 'price' harus berupa angka nol atau lebih",
            ];
        }

        if (!is_numeric($product['stock']) || (int) $product['stock'] < 0) {
            return [
                'success' => false,
                'message' => "Field 'stock' harus berupa angka nol atau lebih",
            ];
        }

        $itemid = (string) $product['itemid'];

        $existing = DB::table('products')->where('itemid', $itemid)->first();

        $categoryIds = $this->categoryIds($product['categories'] ?? []);
        $imageUrls = $this->imageUrls($product);

        $data = [
            'itemid' => $itemid,
            'name' => substr($product['name'], 0, 255),
            'slug' => Str::limit(Str::slug($product['name']), 220, '') . '-' . $itemid,
            'description' => $product['description'] ?? null,
            'price' => (float) $product['price'],
            'stock' => (int) $product['stock'],
            'brand' => $product['brand'] ?? null,
            'pet_type' => $product['pet_type'] ?? 'Umum',
            'image' => $imageUrls[0] ?? null,
            'product_category_id' => $categoryIds[0] ?? null,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::transaction(function () use ($data, $categoryIds, $imageUrls, $product, $existing) {
            if ($existing) {
                $productId = (int) $existing->id;
                $updateData = $data;
                unset($updateData['created_at']);
                DB::table('products')->where('id', $productId)->update($updateData);
                DB::table('product_category_product')->where('product_id', $productId)->delete();
                DB::table('product_images')->where('product_id', $productId)->delete();
                DB::table('product_variants')->where('product_id', $productId)->delete();
            } else {
                $productId = DB::table('products')->insertGetId($data);
            }

            foreach ($categoryIds as $categoryId) {
                DB::table('product_category_product')->insertOrIgnore([
                    'product_id' => $productId,
                    'product_category_id' => $categoryId,
                ]);
            }

            foreach ($imageUrls as $position => $url) {
                DB::table('product_images')->insert([
                    'product_id' => $productId,
                    'url' => $url,
                    'position' => $position,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($this->variants($product) as $variant) {
                DB::table('product_variants')->insert([
                    'product_id' => $productId,
                    'name' => $variant,
                    'price' => (float) $product['price'],
                    'sku' => null,
                    'stock' => (int) $product['stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        return [
            'success' => true,
            'data' => [
                'itemid' => $itemid,
                'name' => $data['name'],
                'price' => $data['price'],
            ],
        ];
    }

    private function validImageUrl($imageUrl)
    {
        return is_string($imageUrl) && filter_var($imageUrl, FILTER_VALIDATE_URL)
            ? $imageUrl
            : null;
    }

    private function categoryIds($categories): array
    {
        if (!is_array($categories)) {
            return [];
        }

        return collect($categories)
            ->filter(fn ($name) => is_string($name) && trim($name) !== '')
            ->map(function ($name) {
                $name = trim($name);
                $slug = Str::slug($name);

                $category = DB::table('product_categories')->where('slug', $slug)->first();
                if ($category) {
                    return (int) $category->id;
                }

                return DB::table('product_categories')->insertGetId([
                    'name' => substr($name, 0, 255),
                    'slug' => $slug ?: 'kategori-' . Str::lower(Str::random(8)),
                    'active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            })
            ->unique()
            ->values()
            ->all();
    }

    private function imageUrls(array $product): array
    {
        $images = is_array($product['images'] ?? null) ? $product['images'] : [];
        array_unshift($images, $product['image'] ?? null);

        return collect($images)
            ->map(fn ($url) => $this->validImageUrl($url))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function variants(array $product): array
    {
        if (!is_array($product['variations'] ?? null)) {
            return [];
        }

        return collect($product['variations'])
            ->filter(fn ($variation) => is_array($variation) && is_array($variation['options'] ?? null))
            ->flatMap(function ($variation) {
                $group = is_string($variation['name'] ?? null) ? trim($variation['name']) : '';

                return collect($variation['options'])
                    ->filter(fn ($option) => is_string($option) && trim($option) !== '')
                    ->map(function ($option) use ($group) {
                        $option = trim($option);
                        return $group !== '' ? "{$group}: {$option}" : $option;
                    });
            })
            ->unique()
            ->values()
            ->all();
    }
}
