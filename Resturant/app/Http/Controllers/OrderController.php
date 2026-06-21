<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | [ SECTION 1 ] : STORE NEW ORDER
    |--------------------------------------------------------------------------
    | Validates order data, calculates totals, and creates order records
    | wrapped in a database transaction.
    */
    public function store(Request $request) {
        $data = $request->validate([
            'address' => 'required|string',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
            'payment_method' => 'required|in:cod,card',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();
        try {
            $totalPrice = 0;
            $itemsToAttach = [];

            $ids = array_column($data['items'], 'menu_item_id');
            $menuItems = MenuItem::whereIn('id', $ids)->get()->keyBy('id');

            foreach ($data['items'] as $item) {
                if (!isset($menuItems[$item['menu_item_id']])) {
                    throw new \Exception('Menu item not found: ' . $item['menu_item_id']);
                }
                $menuItem = $menuItems[$item['menu_item_id']];
                $subtotal = $menuItem->price * $item['quantity'];
                $totalPrice += $subtotal;

                $itemsToAttach[$item['menu_item_id']] = [
                    'quantity' => $item['quantity'],
                    'price' => $menuItem->price
                ];
            }

            $order = $request->user()->orders()->create([
                'address' => $data['address'],
                'phone' => $data['phone'],
                'notes' => $data['notes'],
                'payment_method' => $data['payment_method'],
                'total_price' => $totalPrice,
                'status' => 'pending'
            ]);

            $order->items()->attach($itemsToAttach);
            DB::commit();

            return response()->json(['message' => 'Order placed successfully', 'order' => $order->load('items')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | [ SECTION 2 ] : USER ORDERS HISTORY
    |--------------------------------------------------------------------------
    | Retrieve paginated orders specifically belonging to the logged-in user.
    */
    public function myOrders(Request $request) {
        return response()->json($request->user()->orders()->with('items')->latest()->paginate(15));
    }


    /*
    |--------------------------------------------------------------------------
    | [ SECTION 3 ] : ADMIN - ALL ORDERS
    |--------------------------------------------------------------------------
    | Retrieve a paginated list of all orders across the restaurant.
    | Restricted to admin access.
    */
    public function index() {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin Access Only.'], 403);
        }

        return response()->json(Order::with(['user', 'items'])->latest()->paginate(15));
    }


    /*
    |--------------------------------------------------------------------------
    | [ SECTION 4 ] : ADMIN - UPDATE ORDER STATUS
    |--------------------------------------------------------------------------
    | Allows admins to change the status of a given order (e.g., accepted, delivered).
    */
    public function updateStatus(Request $request, Order $order) {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin Access Only.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,accepted,in_progress,delivered,rejected'
        ]);

        $current = $order->status;
        $new = $data['status'];

        // Enforce sequential status progression: pending -> accepted -> in_progress -> delivered
        // Allow backward transitions for admin correction/mistakes.
        if ($new === 'delivered' && !in_array($current, ['in_progress', 'delivered'])) {
            return response()->json(['message' => 'Order must be In Progress before marking as Delivered.'], 400);
        }
        if ($new === 'in_progress' && !in_array($current, ['accepted', 'in_progress', 'delivered'])) {
            return response()->json(['message' => 'Order must be Accepted before marking as In Progress.'], 400);
        }
        if ($new === 'accepted' && !in_array($current, ['pending', 'accepted', 'in_progress'])) {
            return response()->json(['message' => 'Order must be Pending or In Progress to change to Accepted.'], 400);
        }

        $order->update(['status' => $new]);

        return response()->json(['message' => 'Order status updated successfully', 'order' => $order]);
    }
}