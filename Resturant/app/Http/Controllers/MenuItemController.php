<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        
        $items = MenuItem::with('category')
            ->whereNotNull('image')
            ->where('image', '!=', '')
            ->paginate($perPage);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_ar' => 'nullable|string',
            'price' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('menu', 'public');
        }

        $item = MenuItem::create($data);
        return response()->json(['message' => 'Item added successfully', 'item' => $item], 201);
    }

    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);
        $data = $request->validate([
            'category_id' => 'exists:categories,id',
            'name' => 'string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'description' => 'string',
            'description_ar' => 'nullable|string',
            'price' => 'numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($item->image) { 
                Storage::disk('public')->delete($item->image); 
            }
            $data['image'] = $request->file('image')->store('menu', 'public');
        }

        $item->update($data);
        return response()->json(['message' => 'Item updated successfully', 'item' => $item]);
    }

    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        if ($item->image) { 
            Storage::disk('public')->delete($item->image); 
        }
        $item->delete();
        return response()->json(['message' => 'Item deleted successfully']);
    }
}