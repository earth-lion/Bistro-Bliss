<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_booking(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/bookings', [
            'num_of_people' => 4,
            'booking_date' => now()->addDay()->toDateString(),
            'booking_time' => '20:00',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('booking.num_of_people', 4);
        $response->assertJsonPath('booking.status', 'pending');
    }

    public function test_user_can_place_an_order_with_items(): void
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Main Course']);
        $item = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Sample Dish',
            'description' => 'A test menu item',
            'price' => 25.50,
            'image' => 'test.png',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/orders', [
            'address' => '123 Test Street',
            'phone' => '0123456789',
            'payment_method' => 'cod',
            'notes' => 'Leave at the door',
            'items' => [
                [
                    'menu_item_id' => $item->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('order.total_price', 51);
        $response->assertJsonPath('order.status', 'pending');
        $response->assertJsonPath('order.items.0.pivot.quantity', 2);
    }

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create();
        $category = Category::create(['name' => 'Beverages']);
        $item = MenuItem::create([
            'category_id' => $category->id,
            'name' => 'Test Drink',
            'description' => 'Test drink item',
            'price' => 10.00,
            'image' => 'drink.png',
        ]);

        $orderResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/orders', [
            'address' => '456 Test Ave',
            'phone' => '0987654321',
            'payment_method' => 'card',
            'notes' => null,
            'items' => [
                [
                    'menu_item_id' => $item->id,
                    'quantity' => 1,
                ],
            ],
        ]);

        $orderResponse->assertStatus(201);
        $orderId = $orderResponse->json('order.id');

        $statusResponse = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/orders/{$orderId}/status", [
            'status' => 'accepted',
        ]);

        $statusResponse->assertStatus(200);
        $statusResponse->assertJsonPath('order.status', 'accepted');
    }
}


