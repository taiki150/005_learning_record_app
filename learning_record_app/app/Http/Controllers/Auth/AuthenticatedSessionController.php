<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        
        $request->session()->regenerate();
        
        Auth::login($request->user());

        return response()->json([
            'message' => 'ログインに成功しました',
            'user' => [
                'email' => Auth::user()->email,
                'id' => Auth::user()->id,
            ],
        ], 200);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'ログアウトしました',
        ], 200);
    }

    // session検証
    public function sessionCheck(Request $request):JsonResponse {
        $user = Auth::user();

        if(!$user){
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        return response()->json([
            'message' => 'Authenticated',
            'user' => [
                'email' => $user->email,
                'name' => $user->name,
                'birthday' => $user->birthday,
            ],
        ], 200);
    }
}
