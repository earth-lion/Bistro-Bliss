<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Restaurant Admin',
            'email' => 'admin@restaurant.com',
            'password' => Hash::make('admin12345'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Regular Customer',
            'email' => 'user@restaurant.com',
            'password' => Hash::make('user12345'),
            'role' => 'user',
        ]);

        $categories = ['Pizza', 'Burgers', 'Pasta', 'Desserts', 'Drinks', 'Others'];
        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
        }

        $this->call(MenuItemSeeder::class);
    }
}