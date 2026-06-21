<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('address');
            $table->string('phone');
            $table->text('notes')->nullable();
            $table->enum('payment_method', ['cod', 'card']);
            $table->enum('status', ['pending', 'accepted', 'in_progress', 'delivered', 'rejected'])->default('pending');
            $table->decimal('total_price', 8, 2);
            $table->timestamps();
        });

        // جدول الوسيط لتفاصيل عناصر كل طلب
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};