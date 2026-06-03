<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClinicController extends Controller
{
    public function index(): Response
    {
        $doctors = DB::table('staff')
            ->leftJoin('branches', 'staff.branch_id', '=', 'branches.id')
            ->leftJoin('cities', 'branches.city_id', '=', 'cities.id')
            ->where('staff.type', 'doctor')
            ->where('staff.active', true)
            ->orderBy('staff.id')
            ->get([
                'staff.name',
                'staff.specialty',
                'staff.image',
                'cities.name as lokasi',
            ])
            ->map(fn ($doctor) => [
                'name' => $doctor->name,
                'specialty' => $doctor->specialty ?: '-',
                'experience' => '',
                'image' => $doctor->image ?: '/placeholder.svg',
                'lokasi' => $doctor->lokasi ?: 'Bali',
            ]);

        return Inertia::render('Clinic/Index', [
            'doctors' => $doctors,
        ]);
    }
}
