<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that guests (unauthenticated users) cannot access admin routes.
     */
    public function test_guests_cannot_access_admin_routes(): void
    {
        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(401);
    }

    /**
     * Test that normal users (role = user) cannot access admin routes.
     */
    public function test_normal_users_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/admin/users');

        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Unauthorized. Admin Access Only.'
        ]);
    }

    /**
     * Test that admin users (role = admin) can access admin routes.
     */
    public function test_admin_users_can_access_admin_routes(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/users');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data'); // The admin itself
    }
}
