<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | [ 1 ] STORE — Submit a new contact message (public, auth optional)
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create([
            'user_id' => auth()->id(),          // null for guests
            'name'    => $data['name'],
            'email'   => $data['email'],
            'subject' => $data['subject'],
            'message' => $data['message'],
        ]);

        return response()->json([
            'message' => 'Your message has been sent successfully.',
            'data'    => $message,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | [ 2 ] INDEX — Get all contact messages (admin only)
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        $messages = ContactMessage::with('user')
            ->latest()
            ->get();

        return response()->json($messages);
    }

    /*
    |--------------------------------------------------------------------------
    | [ 3 ] REPLY — Admin replies to a contact message
    |--------------------------------------------------------------------------
    */
    public function reply(Request $request, ContactMessage $contactMessage)
    {
        $data = $request->validate([
            'reply' => 'required|string',
        ]);

        $contactMessage->update([
            'reply'      => $data['reply'],
            'replied_at' => now(),
        ]);

        return response()->json([
            'message' => 'Reply sent successfully.',
            'data'    => $contactMessage->fresh(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | [ 4 ] MY MESSAGES — Logged-in user sees their own messages + replies
    |--------------------------------------------------------------------------
    */
    public function myMessages(Request $request)
    {
        $messages = ContactMessage::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($messages);
    }
}
