<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = collect($request->session()->get('cart', []));

        $productIds = $cart->pluck('product_id')->filter()->unique()->values();
        $variantIds = $cart->pluck('variant_id')->filter()->unique()->values();

        $products = DB::table('products')
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        $variants = DB::table('product_variants')
            ->whereIn('id', $variantIds)
            ->get()
            ->keyBy('id');

        $items = $cart->values()->map(function (array $raw, int $idx) use ($products, $variants) {
            $product = $products->get((int) ($raw['product_id'] ?? 0));
            $variant = isset($raw['variant_id']) && $raw['variant_id'] !== null
                ? $variants->get((int) $raw['variant_id'])
                : null;

            $quantity = max(1, (int) ($raw['quantity'] ?? 1));

            $name = $variant?->name ?: $product?->name ?: 'Produk tidak tersedia';
            $image = $product?->image ?: '/no-image.png';
            $price = (float) ($variant?->price ?? $product?->price ?? 0);

            $available = (bool) ($product?->is_active ?? false);

            if ($variant) {
                $available = $available && ((int) $variant->stock > 0);
            } elseif ($product) {
                $available = $available && ((int) $product->stock > 0);
            }

            return [
                'key' => (string) $idx,
                'productId' => (int) ($raw['product_id'] ?? 0),
                'variantId' => isset($raw['variant_id']) ? (int) $raw['variant_id'] : null,
                'quantity' => $quantity,
                'name' => $name,
                'image' => $image,
                'price' => $price,
                'subtotal' => $price * $quantity,
                'available' => $available,
            ];
        })->values();

        $total = (float) $items->sum('subtotal');
        $hasUnavailable = $items->contains(fn (array $item) => !$item['available']);

        return Inertia::render('Cart/Index', [
            'items' => $items,
            'total' => $total,
            'hasUnavailable' => $hasUnavailable,
        ]);
    }

    public function add(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:999'],
        ]);

        if (isset($validated['variant_id']) && $validated['variant_id'] !== null) {
            $ownsVariant = DB::table('product_variants')
                ->where('id', $validated['variant_id'])
                ->where('product_id', $validated['product_id'])
                ->exists();

            if (!$ownsVariant) {
                return back()->with('error', 'Variant tidak sesuai produk.');
            }
        }

        $cart = collect($request->session()->get('cart', []));
        $quantity = (int) ($validated['quantity'] ?? 1);

        $sameIndex = $cart->search(function (array $row) use ($validated) {
            $variantA = $row['variant_id'] ?? null;
            $variantB = $validated['variant_id'] ?? null;

            return (int) $row['product_id'] === (int) $validated['product_id']
                && $variantA === $variantB;
        });

        if ($sameIndex !== false) {
            $existing = $cart->get($sameIndex);
            $existing['quantity'] = min(999, (int) $existing['quantity'] + $quantity);
            $cart->put($sameIndex, $existing);
        } else {
            $cart->push([
                'product_id' => (int) $validated['product_id'],
                'variant_id' => $validated['variant_id'] ?? null,
                'quantity' => $quantity,
            ]);
        }

        $request->session()->put('cart', $cart->values()->all());

        return back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    public function update(Request $request, int $index): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:999'],
        ]);

        $cart = collect($request->session()->get('cart', []))->values();

        if (!$cart->has($index)) {
            return back();
        }

        $quantity = (int) $validated['quantity'];

        if ($quantity < 1) {
            $cart->forget($index);
        } else {
            $row = $cart->get($index);
            $row['quantity'] = $quantity;
            $cart->put($index, $row);
        }

        $request->session()->put('cart', $cart->values()->all());

        return back();
    }

    public function remove(Request $request, int $index): RedirectResponse
    {
        $cart = collect($request->session()->get('cart', []))->values();

        if ($cart->has($index)) {
            $cart->forget($index);
            $request->session()->put('cart', $cart->values()->all());
        }

        return back();
    }

    public function clear(Request $request): RedirectResponse
    {
        $request->session()->forget('cart');

        return back();
    }
}
