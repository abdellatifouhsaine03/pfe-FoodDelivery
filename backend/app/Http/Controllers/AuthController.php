<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'address' => $request->address,
            'type' => $request->type ?? 'client'
        ]);

        $token = JWTAuth::fromUser($user);

        // 1. Fire this event to send the Gmail automatically
         event(new Registered($user));

        return response()->json([
            'user' => $user,
            'token' => $token,
            'redirect_to' => $this->getRedirectUrlByType($user->type),
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'user' => $user,
            'token' => $token,
            'redirect_to' => $this->getRedirectUrlByType($user->type),
        ]);

}
private function getRedirectUrlByType($type)
{
    switch ($type) {
        case 'admin':
            return '/Dashboardpartner';
        case 'rider':
            return '/livreur';
        case 'admingobite':
            return '/adminpage';
        case '/admingobite':
            return '/Dashboardpartner';
        case 'client':
        default:
            return '/';
    }
}


// 2. Add the Verify method to handle the link click : mli kaywslo dak lcode o kaydkhlo
public function verify(Request $request, $id, $hash)
{
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return redirect(env('FRONTEND_URL') . '/login?status=error');
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    // Prepare data for LocalStorage
    $params = http_build_query([
        'verified' => 'true',
        'id'       => $user->id,
        'username' => $user->name,
        'email'    => $user->email,
        'address'  => $user->address,
        'type'     => $user->type ?? 'client',
        'redirect_to' => $this->getRedirectUrlByType($user->type), // Ensure this exists in your users table
    ]);

    return redirect(env('FRONTEND_URL') . '/?' . $params);
}
}



