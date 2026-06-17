<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = DB::table('staff')
            ->leftJoin('branches', 'branches.id', '=', 'staff.branch_id')
            ->orderBy('staff.name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('staff.name', 'like', "%{$search}%")
                  ->orWhere('branches.name', 'like', "%{$search}%");
            });
        }

        $staff = $query->paginate(15, [
            'staff.id',
            'staff.branch_id',
            'staff.type',
            'staff.name',
            'staff.specialty',
            'staff.image',
            'staff.active',
            'staff.created_at',
            'branches.name as branch_name',
        ]);

        return Inertia::render('Admin/Staff/Index', [
            'staff'   => $staff,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        $branches = DB::table('branches')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Staff/Form', [
            'branches' => $branches,
            'staff'    => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'branch_id' => 'nullable|integer|exists:branches,id',
            'type'      => 'required|string|in:doctor,groomer,staff',
            'name'      => 'required|string|max:255',
            'specialty' => 'nullable|string',
            'image'     => 'nullable|string|max:255',
            'active'    => 'boolean',
        ]);

        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table('staff')->insert($data);

        return redirect()->route('admin.staff.index')->with('success', 'Staff berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $staff = DB::table('staff')->where('id', $id)->first();
        abort_if(! $staff, 404);

        $branches = DB::table('branches')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Staff/Form', [
            'branches' => $branches,
            'staff'    => $staff,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'branch_id' => 'nullable|integer|exists:branches,id',
            'type'      => 'required|string|in:doctor,groomer,staff',
            'name'      => 'required|string|max:255',
            'specialty' => 'nullable|string',
            'image'     => 'nullable|string|max:255',
            'active'    => 'boolean',
        ]);

        $data['updated_at'] = now();

        DB::table('staff')->where('id', $id)->update($data);

        return redirect()->route('admin.staff.index')->with('success', 'Staff berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('staff')->where('id', $id)->delete();

        return redirect()->route('admin.staff.index')->with('success', 'Staff berhasil dihapus.');
    }
}
