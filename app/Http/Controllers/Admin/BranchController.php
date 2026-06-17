<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = DB::table('branches')
            ->leftJoin('cities', 'cities.id', '=', 'branches.city_id')
            ->orderBy('branches.name');

        if ($search) {
            $query->where('branches.name', 'like', "%{$search}%");
        }

        $branches = $query->paginate(15, [
            'branches.id',
            'branches.name',
            'branches.phone',
            'branches.whatsapp',
            'branches.weekday_hours',
            'branches.weekend_hours',
            'branches.featured',
            'branches.active',
            'branches.image',
            'branches.created_at',
            'cities.name as city_name',
        ]);

        return Inertia::render('Admin/Branches/Index', [
            'branches' => $branches,
            'filters'  => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $cities = DB::table('cities')->orderBy('name')->get(['id', 'name']);
        $services = DB::table('services')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Branches/Form', [
            'cities' => $cities,
            'services' => $services,
            'branch' => null,
            'selectedServices' => [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'city_id'       => 'required|integer',
            'name'          => 'required|string|max:255',
            'address'       => 'required|string',
            'phone'         => 'nullable|string|max:255',
            'whatsapp'      => 'nullable|string|max:255',
            'email'         => 'nullable|email|max:255',
            'weekday_hours' => 'nullable|string|max:255',
            'weekend_hours' => 'nullable|string|max:255',
            'image'         => 'nullable|string|max:255',
            'lat'           => 'nullable|numeric',
            'lng'           => 'nullable|numeric',
            'featured'      => 'boolean',
            'active'        => 'boolean',
            'services'      => 'nullable|array',
            'services.*'    => 'integer|exists:services,id',
        ]);

        $services = $data['services'] ?? [];
        unset($data['services']);

        $data['slug'] = Str::slug($data['name']);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        $branchId = DB::table('branches')->insertGetId($data);

        // Sync services
        if (!empty($services)) {
            $syncData = array_map(fn($serviceId) => [
                'branch_id' => $branchId,
                'service_id' => $serviceId,
            ], $services);
            DB::table('branch_service')->insert($syncData);
        }

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $branch = DB::table('branches')->where('id', $id)->first();
        abort_if(! $branch, 404);

        $cities = DB::table('cities')->orderBy('name')->get(['id', 'name']);
        $services = DB::table('services')->orderBy('name')->get(['id', 'name']);
        $selectedServices = DB::table('branch_service')
            ->where('branch_id', $id)
            ->pluck('service_id')
            ->toArray();

        return Inertia::render('Admin/Branches/Form', [
            'cities' => $cities,
            'services' => $services,
            'branch' => $branch,
            'selectedServices' => $selectedServices,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'city_id'       => 'required|integer',
            'name'          => 'required|string|max:255',
            'address'       => 'required|string',
            'phone'         => 'nullable|string|max:255',
            'whatsapp'      => 'nullable|string|max:255',
            'email'         => 'nullable|email|max:255',
            'weekday_hours' => 'nullable|string|max:255',
            'weekend_hours' => 'nullable|string|max:255',
            'image'         => 'nullable|string|max:255',
            'lat'           => 'nullable|numeric',
            'lng'           => 'nullable|numeric',
            'featured'      => 'boolean',
            'active'        => 'boolean',
            'services'      => 'nullable|array',
            'services.*'    => 'integer|exists:services,id',
        ]);

        $services = $data['services'] ?? [];
        unset($data['services']);

        $data['slug'] = Str::slug($data['name']);
        $data['updated_at'] = now();

        DB::table('branches')->where('id', $id)->update($data);

        // Sync services - delete old and insert new
        DB::table('branch_service')->where('branch_id', $id)->delete();
        if (!empty($services)) {
            $syncData = array_map(fn($serviceId) => [
                'branch_id' => $id,
                'service_id' => $serviceId,
            ], $services);
            DB::table('branch_service')->insert($syncData);
        }

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('branches')->where('id', $id)->delete();

        return redirect()->route('admin.branches.index')->with('success', 'Cabang berhasil dihapus.');
    }
}
