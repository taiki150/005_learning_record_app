<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Google へリダイレクト
     */
    public function redirect()
    {
        Log::info('Google redirect called');
        try {
            $response = Socialite::driver('google')->redirect();
            Log::info('Google redirect successful');
            return $response;
        } catch (\Exception $e) {
            Log::error('Google redirect error: ' . $e->getMessage());
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect($frontendUrl . '/user/auth/login?error=Googleへのリダイレクトに失敗しました');
        }
    }

    /**
     * Google からのコールバック処理
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // 同じメールアドレスのユーザーを取得、またはGoogleの情報から新規作成
            $user = User::firstOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $googleUser->name ?? $googleUser->email,
                    'password' => Hash::make(Str::random(32)),
                ]
            );

            // ユーザーをログイン
            Auth::login($user);
            request()->session()->regenerate();

            Log::info('Google authentication successful', ['user_id' => $user->id, 'email' => $user->email]);

            // リダイレクト先を決定: birthday未設定なら プロフィール完成画面へ、設定済みならダッシュボードへ
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            $redirectPath = is_null($user->birthday)
                ? '/user/auth/complete-profile'
                : '/user/contents/dashboard';

            return redirect($frontendUrl . $redirectPath);

        } catch (\Exception $e) {
            Log::error('Google callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect($frontendUrl . '/user/auth/login?error=Googleログインに失敗しました');
        }
    }
}
