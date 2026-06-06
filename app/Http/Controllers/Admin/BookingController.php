<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $status = $request->get('status', '');

        $query = DB::table('bookings')
            ->leftJoin('services', 'services.id', '=', 'bookings.service_id')
            ->leftJoin('branches', 'branches.id', '=', 'bookings.branch_id')
            ->orderByDesc('bookings.created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('bookings.booking_number', 'like', "%{$search}%")
                  ->orWhere('bookings.customer_name', 'like', "%{$search}%")
                  ->orWhere('bookings.customer_phone', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('bookings.status', $status);
        }

        $bookings = $query->paginate(15, [
            'bookings.id',
            'bookings.booking_number',
            'bookings.customer_name',
            'bookings.customer_phone',
            'bookings.customer_email',
            'bookings.status',
            'bookings.date',
            'bookings.total_price',
            'bookings.created_at',
            'services.name as service_name',
            'branches.name as branch_name',
        ]);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters'  => ['search' => $search, 'status' => $status],
        ]);
    }

    public function edit(int $id): Response
    {
        $booking = DB::table('bookings')->where('id', $id)->first();
        abort_if(! $booking, 404);

        $services = DB::table('services')->orderBy('name')->get(['id', 'name']);
        $branches = DB::table('branches')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Bookings/Form', [
            'booking'  => $booking,
            'services' => $services,
            'branches' => $branches,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'service_id'     => 'nullable|integer',
            'branch_id'      => 'nullable|integer',
            'booking_number' => 'required|string|max:255',
            'status'         => 'required|in:pending,confirmed,completed,cancelled',
            'date'           => 'nullable|date',
            'time'           => 'nullable|string',
            'check_in'       => 'nullable|date',
            'check_out'      => 'nullable|date',
            'customer_name'  => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:255',
            'city'           => 'nullable|string|max:255',
            'address'        => 'nullable|string',
            'notes'          => 'nullable|string',
            'total_price'    => 'nullable|numeric|min:0',
        ]);

        $data['updated_at'] = now();

        DB::table('bookings')->where('id', $id)->update($data);

        return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('bookings')->where('id', $id)->delete();

        return redirect()->route('admin.bookings.index')->with('success', 'Booking berhasil dihapus.');
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        DB::table('bookings')->where('id', $id)->update([
            'status'     => $data['status'],
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Status booking diperbarui.');
    }
}
