<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = DB::table('product_categories')->orderBy('name');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->paginate(15);

        return Inertia::render('Admin/ProductCategories/Index', [
            'categories' => $categories,
            'filters'    => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/ProductCategories/Form', ['category' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|string|max:255',
            'active'      => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table('product_categories')->insert($data);

        return redirect()->route('admin.product-categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $category = DB::table('product_categories')->where('id', $id)->first();
        abort_if(! $category, 404);

        return Inertia::render('Admin/ProductCategories/Form', ['category' => $category]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|string|max:255',
            'active'      => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['updated_at'] = now();

        DB::table('product_categories')->where('id', $id)->update($data);

        return redirect()->route('admin.product-categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('product_categories')->where('id', $id)->delete();

        return redirect()->route('admin.product-categories.index')->with('success', 'Kategori berhasil dihapus.');
    }
}
