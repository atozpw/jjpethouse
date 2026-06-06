<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = DB::table('services')
            ->leftJoin('service_categories', 'service_categories.id', '=', 'services.service_category_id')
            ->orderBy('services.name');

        if ($search) {
            $query->where('services.name', 'like', "%{$search}%");
        }

        $services = $query->paginate(15, [
            'services.id',
            'services.name',
            'services.slug',
            'services.price',
            'services.image',
            'services.duration',
            'services.rating',
            'services.active',
            'services.created_at',
            'service_categories.name as category_name',
        ]);

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'filters'  => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $categories = DB::table('service_categories')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Services/Form', [
            'categories' => $categories,
            'service'    => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'service_category_id' => 'required|integer',
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'price'               => 'required|numeric|min:0',
            'image'               => 'nullable|string|max:255',
            'duration'            => 'nullable|string|max:255',
            'rating'              => 'nullable|numeric|min:0|max:5',
            'url'                 => 'nullable|string|max:255',
            'requires_address'    => 'boolean',
            'requires_pickup'     => 'boolean',
            'requires_schedule'   => 'boolean',
            'branch_required'     => 'boolean',
            'requires_people'     => 'boolean',
            'schedule_type'       => 'nullable|string|in:single,range',
            'active'              => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(5);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table('services')->insert($data);

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $service = DB::table('services')->where('id', $id)->first();
        abort_if(! $service, 404);

        $categories = DB::table('service_categories')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Services/Form', [
            'categories' => $categories,
            'service'    => $service,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'service_category_id' => 'required|integer',
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'price'               => 'required|numeric|min:0',
            'image'               => 'nullable|string|max:255',
            'duration'            => 'nullable|string|max:255',
            'rating'              => 'nullable|numeric|min:0|max:5',
            'url'                 => 'nullable|string|max:255',
            'requires_address'    => 'boolean',
            'requires_pickup'     => 'boolean',
            'requires_schedule'   => 'boolean',
            'branch_required'     => 'boolean',
            'requires_people'     => 'boolean',
            'schedule_type'       => 'nullable|string|in:single,range',
            'active'              => 'boolean',
        ]);

        $data['updated_at'] = now();

        DB::table('services')->where('id', $id)->update($data);

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('services')->where('id', $id)->delete();

        return redirect()->route('admin.services.index')->with('success', 'Layanan berhasil dihapus.');
    }
}
