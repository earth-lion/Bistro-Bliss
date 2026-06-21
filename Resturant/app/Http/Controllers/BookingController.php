<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request) {
        $data = $request->validate([
            'num_of_people' => 'required|integer|min:1',
            'booking_date' => 'required|date|after_or_equal:today',
            'booking_time' => 'required',
        ]);

        $booking = $request->user()->bookings()->create(array_merge($data, ['status' => 'pending']));
        return response()->json(['message' => 'Booking request sent successfully', 'booking' => $booking], 201);
    }

    public function myBookings(Request $request) {
        return response()->json($request->user()->bookings()->latest()->paginate(15));
    }

    public function index() {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin Access Only.'], 403);
        }

        return response()->json(Booking::with('user')->latest()->paginate(15));
    }

    public function updateStatus(Request $request, $id) {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin Access Only.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:confirmed,rejected'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $data['status']]);

        return response()->json(['message' => 'Booking status updated', 'booking' => $booking]);
    }
}