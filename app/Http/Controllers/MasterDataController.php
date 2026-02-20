<?php

namespace App\Http\Controllers;

use App\Models\MasterData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterDataController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category', 'discipline');

        $items = MasterData::where('category', $category)
            ->orderBy('sort_order')
            ->orderBy('label')
            ->get();

        return Inertia::render('master-data/index', [
            'category' => $category,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'key' => 'required|string',
            'label' => 'required|string',
            'sort_order' => 'integer',
        ]);

        MasterData::create($validated);

        return back();
    }

    public function update(Request $request, MasterData $masterData)
    {
        $validated = $request->validate([
            'label' => 'sometimes|string',
            'sort_order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $masterData->update($validated);

        return back();
    }

    public function destroy(MasterData $masterData)
    {
        $masterData->delete();

        return back();
    }
}
