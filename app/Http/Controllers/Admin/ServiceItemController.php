<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ServiceItemController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = DB::table('service_items')
            ->leftJoin('services', 'services.id', '=', 'service_items.service_id')
            ->orderBy('services.name')
            ->orderBy('service_items.type')
            ->orderBy('service_items.name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('service_items.name', 'like', "%{$search}%")
                  ->orWhere('services.name', 'like', "%{$search}%");
            });
        }

        $serviceItems = $query->paginate(15, [
            'service_items.id',
            'service_items.service_id',
            'service_items.name',
            'service_items.price',
            'service_items.type',
            'service_items.active',
            'service_items.created_at',
            'services.name as service_name',
        ]);

        return Inertia::render('Admin/ServiceItems/Index', [
            'serviceItems' => $serviceItems,
            'filters'      => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $services = DB::table('services')->orderBy('name')->get(['id', 'name']);
        $petTypes = DB::table('pet_types')->where('active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/ServiceItems/Form', [
            'services'        => $services,
            'petTypes'        => $petTypes,
            'serviceItem'     => null,
            'selectedPetTypes' => [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'service_id' => 'required|integer|exists:services,id',
            'name'       => 'required|string|max:255',
            'price'      => 'required|numeric|min:0',
            'type'       => 'required|string|in:main,additional',
            'active'     => 'boolean',
            'pet_types'  => 'nullable|array',
            'pet_types.*' => 'integer|exists:pet_types,id',
        ]);

        $petTypes = $data['pet_types'] ?? [];
        unset($data['pet_types']);

        $data['created_at'] = now();
        $data['updated_at'] = now();

        $itemId = DB::table('service_items')->insertGetId($data);

        // Sync pet types
        if (!empty($petTypes)) {
            $syncData = array_map(fn($petTypeId) => [
                'service_item_id' => $itemId,
                'pet_type_id' => $petTypeId,
            ], $petTypes);
            DB::table('pet_type_service_item')->insert($syncData);
        }

        return redirect()->route('admin.service-items.index')->with('success', 'Item layanan berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $serviceItem = DB::table('service_items')->where('id', $id)->first();
        abort_if(! $serviceItem, 404);

        $services = DB::table('services')->orderBy('name')->get(['id', 'name']);
        $petTypes = DB::table('pet_types')->where('active', true)->orderBy('name')->get(['id', 'name']);
        $selectedPetTypes = DB::table('pet_type_service_item')
            ->where('service_item_id', $id)
            ->pluck('pet_type_id')
            ->toArray();

        return Inertia::render('Admin/ServiceItems/Form', [
            'services'         => $services,
            'petTypes'         => $petTypes,
            'serviceItem'      => $serviceItem,
            'selectedPetTypes' => $selectedPetTypes,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'service_id' => 'required|integer|exists:services,id',
            'name'       => 'required|string|max:255',
            'price'      => 'required|numeric|min:0',
            'type'       => 'required|string|in:main,additional',
            'active'     => 'boolean',
            'pet_types'  => 'nullable|array',
            'pet_types.*' => 'integer|exists:pet_types,id',
        ]);

        $petTypes = $data['pet_types'] ?? [];
        unset($data['pet_types']);

        $data['updated_at'] = now();

        DB::table('service_items')->where('id', $id)->update($data);

        // Sync pet types - delete old and insert new
        DB::table('pet_type_service_item')->where('service_item_id', $id)->delete();
        if (!empty($petTypes)) {
            $syncData = array_map(fn($petTypeId) => [
                'service_item_id' => $id,
                'pet_type_id' => $petTypeId,
            ], $petTypes);
            DB::table('pet_type_service_item')->insert($syncData);
        }

        return redirect()->route('admin.service-items.index')->with('success', 'Item layanan berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('service_items')->where('id', $id)->delete();

        return redirect()->route('admin.service-items.index')->with('success', 'Item layanan berhasil dihapus.');
    }
}
