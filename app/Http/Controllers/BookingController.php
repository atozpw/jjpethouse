<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        // Services with category slug
        $services = DB::table('services')
            ->join('service_categories', 'services.service_category_id', '=', 'service_categories.id')
            ->select('services.*', 'service_categories.slug as category_slug')
            ->where('services.active', true)
            ->orderBy('services.id')
            ->get();

        // Attach available_modes array to each service
        $serviceIds = $services->pluck('id');
        $modesGrouped = DB::table('service_modes')
            ->whereIn('service_id', $serviceIds)
            ->get()
            ->groupBy('service_id');

        $serviceItemsGrouped = DB::table('service_items')
            ->whereIn('service_id', $serviceIds)
            ->orderBy('id')
            ->get()
            ->groupBy('service_id');

        $itemIds = $serviceItemsGrouped->flatten(1)->pluck('id');
        $petTypeMap = DB::table('pet_type_service_item')
            ->join('pet_types', 'pet_type_service_item.pet_type_id', '=', 'pet_types.id')
            ->whereIn('pet_type_service_item.service_item_id', $itemIds)
            ->select('pet_type_service_item.service_item_id', 'pet_types.name')
            ->get()
            ->groupBy('service_item_id');

        $services = $services->map(function ($service) use ($modesGrouped, $serviceItemsGrouped, $petTypeMap) {
            $service->available_modes = $modesGrouped->get($service->id, collect())
                ->pluck('name')
                ->values()
                ->all();

            $service->items = $serviceItemsGrouped->get($service->id, collect())
                ->map(function ($item) use ($petTypeMap) {
                    $petTypes = $petTypeMap->get($item->id, collect())->pluck('name')->values()->all();
                    return [
                        'id' => (string) $item->id,
                        'name' => $item->name,
                        'price' => (float) $item->price,
                        'type' => $item->type,
                        'petType' => count($petTypes) ? $petTypes : null,
                        'specialties' => null,
                    ];
                })
                ->values()
                ->all();

            return $service;
        });

        // Branches with city info
        $rawBranches = DB::table('branches')
            ->join('cities', 'branches.city_id', '=', 'cities.id')
            ->select('branches.*', 'cities.name as city_name', 'cities.slug as city_slug')
            ->where('branches.active', true)
            ->orderBy('branches.name')
            ->get();

        // Build branch_id => [service_category_slugs] map from pivot
        $branchIds = $rawBranches->pluck('id');

        // Join branch_service with services and service_categories to get category slugs per branch
        $branchServiceCategories = DB::table('branch_service')
            ->join('services', 'branch_service.service_id', '=', 'services.id')
            ->join('service_categories', 'services.service_category_id', '=', 'service_categories.id')
            ->whereIn('branch_service.branch_id', $branchIds)
            ->select('branch_service.branch_id', 'service_categories.slug as cat_slug')
            ->get()
            ->groupBy('branch_id');

        // Embed services array into each branch object (UI reads branch.services)
        $branches = $rawBranches->map(function ($branch) use ($branchServiceCategories) {
            $branch->services = $branchServiceCategories->get($branch->id, collect())
                ->pluck('cat_slug')
                ->unique()
                ->values()
                ->all();
            return $branch;
        });

        // Staff with branch slug
        $staff = DB::table('staff')
            ->leftJoin('branches', 'staff.branch_id', '=', 'branches.id')
            ->select('staff.*', 'branches.slug as branch_slug')
            ->where('staff.active', true)
            ->orderBy('staff.name')
            ->get();

        return Inertia::render('Booking/Index', [
            'services'  => $services,
            'branches'  => $branches,
            'staff'     => $staff,
            'petTypes'  => DB::table('pet_types')->where('active', true)->orderBy('id')->get(),
            'timeSlots' => DB::table('time_slots')->where('active', true)->orderBy('time')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id'     => ['required', 'exists:services,id'],
            'branch_id'      => ['nullable', 'exists:branches,id'],
            'staff_id'       => ['nullable', 'exists:staff,id'],
            'customer_name'  => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'address'        => ['nullable', 'string'],
            'date'           => ['nullable', 'date'],
            'time'           => ['nullable', 'date_format:H:i'],
            'pet_name'       => ['required', 'string', 'max:255'],
            'pet_type_id'    => ['nullable', 'exists:pet_types,id'],
            'notes'          => ['nullable', 'string'],
        ]);

        $service = DB::table('services')->find($validated['service_id']);
        $bookingNumber = 'BK-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4));

        DB::transaction(function () use ($validated, $service, $bookingNumber) {
            $bookingId = DB::table('bookings')->insertGetId([
                'user_id'        => auth()->id(),
                'service_id'     => $validated['service_id'],
                'branch_id'      => $validated['branch_id'] ?? null,
                'staff_id'       => $validated['staff_id'] ?? null,
                'booking_number' => $bookingNumber,
                'customer_name'  => $validated['customer_name'],
                'customer_email' => $validated['customer_email'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'address'        => $validated['address'] ?? null,
                'date'           => $validated['date'] ?? null,
                'time'           => $validated['time'] ?? null,
                'status'         => 'pending',
                'total_price'    => $service?->price ?? 0,
                'notes'          => $validated['notes'] ?? null,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            DB::table('booking_pets')->insert([
                'booking_id'  => $bookingId,
                'pet_type_id' => $validated['pet_type_id'] ?? null,
                'name'        => $validated['pet_name'],
                'notes'       => $validated['notes'] ?? null,
                'price'       => $service?->price ?? 0,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        });

        return redirect()->route('booking.index')->with('success', "Booking {$bookingNumber} berhasil dibuat.");
    }
}
