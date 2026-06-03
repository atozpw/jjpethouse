<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use App\Models\Branch;
use App\Models\Product;
use App\Models\Service;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Layanan', Service::count())
                ->description(Service::where('active', true)->count() . ' layanan aktif')
                ->color('primary')
                ->icon('heroicon-o-sparkles'),
            Stat::make('Total Produk', Product::count())
                ->description(Product::where('is_active', true)->count() . ' produk aktif')
                ->color('primary')
                ->icon('heroicon-o-shopping-bag'),
            Stat::make('Booking', Booking::count())
                ->description(Booking::where('status', 'pending')->count() . ' menunggu konfirmasi')
                ->color('warning')
                ->icon('heroicon-o-calendar-days'),
            Stat::make('Cabang', Branch::count())
                ->description(User::count() . ' user terdaftar')
                ->color('success')
                ->icon('heroicon-o-building-storefront'),
        ];
    }
}
