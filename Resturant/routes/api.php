<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ContactController;


Route::get('/test-token', function (Request $request) {
    return response()->json([
        'message' => 'API is working!',
        'bearer_token' => $request->bearerToken(),
        'has_token' => $request->hasHeader('Authorization'),
    ]);
});

// ==========================================================================
// [1] PUBLIC ROUTES
// ==========================================================================
// Accessible without authentication.
Route::get('/menu', [MenuItemController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/contact', [ContactController::class, 'store']); // public — auth optional

// ==========================================================================
// [2] PROTECTED ROUTES (SANCTUM)
// ==========================================================================
// Require a valid authentication token.
Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::post('/logout', [UserController::class, 'logout']);


    Route::get('/profile', [UserController::class, 'showProfile']);
    Route::put('/profile/update', [UserController::class, 'updateProfile']);
    
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/my-messages', [ContactController::class, 'myMessages']); // user sees own contact messages + replies
    
    // ======================================================================
    // [3] ADMIN ROUTES
    // ======================================================================
    // Restricted to users with the 'admin' role.
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/menu', [MenuItemController::class, 'store']);
        Route::patch('/menu/{id}', [MenuItemController::class, 'update']); 
        Route::delete('/menu/{id}', [MenuItemController::class, 'destroy']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        // Contact Messages
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::post('/contacts/{contactMessage}/reply', [ContactController::class, 'reply']);
    });
});