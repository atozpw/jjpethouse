<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(): Response
    {
        $branches = DB::table('branches')
            ->join('cities', 'branches.city_id', '=', 'cities.id')
            ->where('branches.active', true)
            ->orderBy('cities.id')
            ->orderBy('branches.id')
            ->get([
                'branches.id',
                'branches.slug',
                'branches.name',
                'cities.slug as city',
                'branches.address',
                'branches.phone',
                'branches.whatsapp',
                'branches.email',
                'branches.weekday_hours',
                'branches.weekend_hours',
                'branches.image',
                'branches.lat',
                'branches.lng',
                'branches.featured',
            ]);

        $branchIds = $branches->pluck('id');
        $servicesByBranch = DB::table('branch_service')
            ->join('services', 'branch_service.service_id', '=', 'services.id')
            ->whereIn('branch_service.branch_id', $branchIds)
            ->select('branch_service.branch_id', 'services.name')
            ->get()
            ->groupBy('branch_id');

        $branches = $branches->map(function ($branch) use ($servicesByBranch) {
            $services = $servicesByBranch->get($branch->id, collect())
                ->pluck('name')
                ->map(fn (string $name) => Str::of($name)->replace('Pet Clinic', 'Clinic')->toString())
                ->values()
                ->all();

            return [
                'id' => $branch->slug,
                'name' => $branch->name,
                'city' => $branch->city,
                'address' => $branch->address,
                'phone' => $branch->phone ?: '',
                'whatsapp' => $branch->whatsapp ?: $branch->phone ?: '',
                'email' => $branch->email ?: '',
                'hours' => [
                    'weekday' => $branch->weekday_hours ?: '08:00 - 21:00',
                    'weekend' => $branch->weekend_hours ?: '08:00 - 22:00',
                ],
                'services' => count($services) ? $services : ['Pet Shop'],
                'image' => $branch->image ?: '/image/Pict 32.jpeg',
                'coordinates' => [
                    'lat' => $branch->lat ? (float) $branch->lat : null,
                    'lng' => $branch->lng ? (float) $branch->lng : null,
                ],
                'featured' => (bool) $branch->featured,
            ];
        });

        $cities = DB::table('cities')
            ->where('active', true)
            ->orderBy('id')
            ->get(['slug as id', 'name', 'icon'])
            ->map(function ($city) use ($branches) {
                return [
                    'id' => $city->id,
                    'name' => $city->name,
                    'icon' => $city->icon,
                    'count' => $branches->where('city', $city->id)->count(),
                ];
            });

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
            'cities' => $cities,
        ]);
    }
}
