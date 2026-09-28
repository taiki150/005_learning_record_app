<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GithubAuthController extends Controller
{
    /**
     * GitHub へリダイレクト
     */
    public function redirect()
    {
        Log::info('GitHub redirect called');
        try {
            $response = Socialite::driver('github')->redirect();
            Log::info('GitHub redirect successful');
            return $response;
        } catch (\Exception $e) {
            Log::error('GitHub redirect error: ' . $e->getMessage());
            return redirect('/user/contents/setting')->with('error', 'GitHub へのリダイレクトに失敗しました');
        }
    }

    /**
     * GitHub からのコールバック処理
     */
    public function callback()
    {
        try {
            $githubUser = Socialite::driver('github')->user();

            // ログイン中のユーザーを取得
            $user = Auth::user();

            if (!$user) {
                $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
                return redirect($frontendUrl . '/login?error=ログインしてください');
            }

            // GitHub トークンを User に保存
            $user->update(['github_token' => $githubUser->token]);

            Log::info('GitHub token saved', ['user_id' => $user->id]);

            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect($frontendUrl . '/user/contents/setting?success=GitHub%20アカウントを連携しました');

        } catch (\Exception $e) {
            Log::error('GitHub callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect($frontendUrl . '/user/contents/setting?error=GitHub%20連携に失敗しました');
        }
    }

}
