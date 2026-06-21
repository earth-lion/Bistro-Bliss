<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | [ SECTION 1 ] : USER REGISTRATION
    |--------------------------------------------------------------------------
    | Handles the creation of a new user account, password hashing, and
    | generation of the initial authentication token.
    */
    public function register(RegisterRequest $request) {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user'
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | [ SECTION 2 ] : USER LOGIN
    |--------------------------------------------------------------------------
    | Authenticates user credentials, verifies the password, and issues
    | an access token for subsequent API requests.
    */
    public function login(LoginRequest $request) {

        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();


        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | [ SECTION 3 ] : USER LOGOUT
    |--------------------------------------------------------------------------
    | Revokes the current access token, effectively logging the user out.
    */
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /*
    |--------------------------------------------------------------------------
    | [ SECTION 4 ] : PROFILE MANAGEMENT
    |--------------------------------------------------------------------------
    | Retrieve and update authenticated user details.
    */
    public function showProfile(Request $request) {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request) {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        $user->name = $data['name'];
        $user->phone = $data['phone'] ?? $user->phone;
        
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        
        $user->save();

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    /*
    |--------------------------------------------------------------------------
    | [ SECTION 5 ] : ADMIN - USER LIST
    |--------------------------------------------------------------------------
    | Retrieves a paginated list of all users. Restricted to admin access.
    */
    public function index() {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin Access Only.'], 403);
        }

        return response()->json(User::select('id', 'name', 'email', 'phone', 'role')->paginate(15));
    }

    /*
    |--------------------------------------------------------------------------
    | [ SECTION 6 ] : ADMIN - PERMANENTLY DELETE USER
    |--------------------------------------------------------------------------
    | Permanently removes a user account and all their associated tokens.
    | Guards against self-deletion. Only admin can perform this action.
    */
    public function destroy(Request $request, $id) {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin Access Only.'], 403);
        }

        // Prevent admin from deleting themselves
        if (auth()->id() == $id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user = User::findOrFail($id);

        // Revoke all tokens before deleting
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'User account permanently deleted.']);
    }
}