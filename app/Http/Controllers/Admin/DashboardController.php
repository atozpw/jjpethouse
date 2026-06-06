<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Branch;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'products'  => Product::count(),
            'products_active' => Product::where('is_active', true)->count(),
            'services'  => Service::count(),
            'services_active' => Service::where('active', true)->count(),
            'bookings'  => Booking::count(),
            'bookings_pending' => Booking::where('status', 'pending')->count(),
            'branches'  => Branch::count(),
            'users'     => User::count(),
        ];

        $latest_bookings = DB::table('bookings')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get([
                'id', 'booking_number', 'customer_name', 'customer_phone',
                'status', 'date', 'total_price', 'created_at',
            ])
            ->map(fn ($b) => [
                'id'             => $b->id,
                'booking_number' => $b->booking_number,
                'customer_name'  => $b->customer_name,
                'customer_phone' => $b->customer_phone,
                'status'         => $b->status,
                'date'           => $b->date,
                'total_price'    => (float) $b->total_price,
                'created_at'     => $b->created_at,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats'           => $stats,
            'latest_bookings' => $latest_bookings,
        ]);
    }
}
