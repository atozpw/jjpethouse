<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = DB::table('services')
            ->join('service_categories', 'services.service_category_id', '=', 'service_categories.id')
            ->orderBy('services.id')
            ->get([
                'services.id',
                'services.name',
                'service_categories.slug as category',
                'services.description',
                'services.price',
                'services.image',
                'services.duration',
                'services.rating',
                'services.active',
            ])
            ->map(fn ($service) => [
                'id' => (string) $service->id,
                'name' => $service->name,
                'category' => $service->category,
                'description' => $service->description,
                'price' => (float) $service->price,
                'image' => $service->image ?: '/placeholder.svg',
                'duration' => $service->duration,
                'rating' => (float) $service->rating,
                'active' => (bool) $service->active,
            ]);

        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }
}
