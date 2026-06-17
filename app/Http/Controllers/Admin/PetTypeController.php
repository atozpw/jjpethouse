<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PetTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = DB::table('pet_types')->orderBy('name');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $petTypes = $query->paginate(15, [
            'id',
            'name',
            'slug',
            'active',
            'created_at',
        ]);

        return Inertia::render('Admin/PetTypes/Index', [
            'petTypes' => $petTypes,
            'filters'  => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PetTypes/Form', [
            'petType' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table('pet_types')->insert($data);

        return redirect()->route('admin.pet-types.index')->with('success', 'Jenis hewan berhasil ditambahkan.');
    }

    public function edit(int $id): Response
    {
        $petType = DB::table('pet_types')->where('id', $id)->first();
        abort_if(! $petType, 404);

        return Inertia::render('Admin/PetTypes/Form', [
            'petType' => $petType,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $data['updated_at'] = now();

        DB::table('pet_types')->where('id', $id)->update($data);

        return redirect()->route('admin.pet-types.index')->with('success', 'Jenis hewan berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        DB::table('pet_types')->where('id', $id)->delete();

        return redirect()->route('admin.pet-types.index')->with('success', 'Jenis hewan berhasil dihapus.');
    }
}
