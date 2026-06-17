<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\PetShopController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProductImportController as AdminProductImportController;
use App\Http\Controllers\Admin\ProductCategoryController as AdminProductCategoryController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\ServiceItemController as AdminServiceItemController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\BranchController as AdminBranchController;
use App\Http\Controllers\Admin\StaffController as AdminStaffController;
use App\Http\Controllers\Admin\PetTypeController as AdminPetTypeController;
use App\Http\Controllers\Admin\ImageUploadController as AdminImageUploadController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'services' => DB::table('services')
            ->orderBy('id')
            ->get(),
    ]);
})->name('home');

Route::get('/booking', [BookingController::class, 'index'])->name('booking.index');
Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');

Route::get('/pet-shop', [PetShopController::class, 'index'])->name('pet-shop.index');
Route::get('/products/{slug}', [PetShopController::class, 'show'])->name('products.show');
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/clinic', [ClinicController::class, 'index'])->name('clinic.index');
Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/items', [CartController::class, 'add'])->name('cart.items.add');
Route::post('/cart/items/{index}', [CartController::class, 'update'])->whereNumber('index')->name('cart.items.update');
Route::delete('/cart/items/{index}', [CartController::class, 'remove'])->whereNumber('index')->name('cart.items.remove');
Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Admin Panel
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/import', [AdminProductImportController::class, 'index'])->name('products.import');
    Route::post('/products/import/upload', [AdminProductImportController::class, 'upload'])->name('products.import.upload');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{id}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::patch('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    // Product Categories
    Route::get('/product-categories', [AdminProductCategoryController::class, 'index'])->name('product-categories.index');
    Route::get('/product-categories/create', [AdminProductCategoryController::class, 'create'])->name('product-categories.create');
    Route::post('/product-categories', [AdminProductCategoryController::class, 'store'])->name('product-categories.store');
    Route::get('/product-categories/{id}/edit', [AdminProductCategoryController::class, 'edit'])->name('product-categories.edit');
    Route::patch('/product-categories/{id}', [AdminProductCategoryController::class, 'update'])->name('product-categories.update');
    Route::delete('/product-categories/{id}', [AdminProductCategoryController::class, 'destroy'])->name('product-categories.destroy');

    // Services
    Route::get('/services', [AdminServiceController::class, 'index'])->name('services.index');
    Route::get('/services/create', [AdminServiceController::class, 'create'])->name('services.create');
    Route::post('/services', [AdminServiceController::class, 'store'])->name('services.store');
    Route::get('/services/{id}/edit', [AdminServiceController::class, 'edit'])->name('services.edit');
    Route::patch('/services/{id}', [AdminServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{id}', [AdminServiceController::class, 'destroy'])->name('services.destroy');

    // Service Items
    Route::get('/service-items', [AdminServiceItemController::class, 'index'])->name('service-items.index');
    Route::get('/service-items/create', [AdminServiceItemController::class, 'create'])->name('service-items.create');
    Route::post('/service-items', [AdminServiceItemController::class, 'store'])->name('service-items.store');
    Route::get('/service-items/{id}/edit', [AdminServiceItemController::class, 'edit'])->name('service-items.edit');
    Route::patch('/service-items/{id}', [AdminServiceItemController::class, 'update'])->name('service-items.update');
    Route::delete('/service-items/{id}', [AdminServiceItemController::class, 'destroy'])->name('service-items.destroy');

    // Bookings
    Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{id}/edit', [AdminBookingController::class, 'edit'])->name('bookings.edit');
    Route::patch('/bookings/{id}', [AdminBookingController::class, 'update'])->name('bookings.update');
    Route::patch('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus'])->name('bookings.update-status');
    Route::delete('/bookings/{id}', [AdminBookingController::class, 'destroy'])->name('bookings.destroy');

    // Branches
    Route::get('/branches', [AdminBranchController::class, 'index'])->name('branches.index');
    Route::get('/branches/create', [AdminBranchController::class, 'create'])->name('branches.create');
    Route::post('/branches', [AdminBranchController::class, 'store'])->name('branches.store');
    Route::get('/branches/{id}/edit', [AdminBranchController::class, 'edit'])->name('branches.edit');
    Route::patch('/branches/{id}', [AdminBranchController::class, 'update'])->name('branches.update');
    Route::delete('/branches/{id}', [AdminBranchController::class, 'destroy'])->name('branches.destroy');

    // Staff
    Route::get('/staff', [AdminStaffController::class, 'index'])->name('staff.index');
    Route::get('/staff/create', [AdminStaffController::class, 'create'])->name('staff.create');
    Route::post('/staff', [AdminStaffController::class, 'store'])->name('staff.store');
    Route::get('/staff/{id}/edit', [AdminStaffController::class, 'edit'])->name('staff.edit');
    Route::patch('/staff/{id}', [AdminStaffController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{id}', [AdminStaffController::class, 'destroy'])->name('staff.destroy');

    // Pet Types
    Route::get('/pet-types', [AdminPetTypeController::class, 'index'])->name('pet-types.index');
    Route::get('/pet-types/create', [AdminPetTypeController::class, 'create'])->name('pet-types.create');
    Route::post('/pet-types', [AdminPetTypeController::class, 'store'])->name('pet-types.store');
    Route::get('/pet-types/{id}/edit', [AdminPetTypeController::class, 'edit'])->name('pet-types.edit');
    Route::patch('/pet-types/{id}', [AdminPetTypeController::class, 'update'])->name('pet-types.update');
    Route::delete('/pet-types/{id}', [AdminPetTypeController::class, 'destroy'])->name('pet-types.destroy');

    // Image Upload
    Route::post('/upload-image', [AdminImageUploadController::class, 'upload'])->name('upload-image');
    Route::post('/delete-image', [AdminImageUploadController::class, 'delete'])->name('delete-image');
});
