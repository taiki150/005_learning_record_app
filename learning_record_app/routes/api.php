<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\GithubAuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\LearningRecordController;
use App\Http\Controllers\GithubRepositoryController;
use App\Http\Controllers\CategoryController;
use Illuminate\Session\Middleware\StartSession;

// 認証なしで使用可能なエンドポイント
Route::middleware([StartSession::class])->group(function () {
    // ログインAPI（認証なしで使用可能）
    Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);

    // 登録処理API（認証なしで使用可能）
    Route::post('/register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);

    Route::post('/csrf-token', function (Request $request){
        return response()->json([
            'csrf-token' => csrf_token(),
        ]);
    });

    // GitHub OAuth（認証なしで使用可能）
    Route::get('/auth/github/redirect', [GithubAuthController::class, 'redirect']);
    Route::get('/auth/github/callback', [GithubAuthController::class, 'callback']);

    // Google OAuth（認証なしで使用可能）
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);
});

// 認証が必要なエンドポイント
Route::middleware(['auth:sanctum'])->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class)->group(function () {
    // セッション確認API
    Route::get('/user', [AuthenticatedSessionController::class, 'sessionCheck']);

    // プロフィール完成（生年月日入力）
    Route::post('/user/complete-profile', [AuthenticatedSessionController::class, 'completeProfile']);

    // ログアウト
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // カテゴリー取得API
    Route::get('/categories', [CategoryController::class, 'index']);

    // カテゴリー取得API
    Route::post('/record', [LearningRecordController::class, 'store']);

    
    /* ここからData取得API */
    Route::post('data/record',[LearningRecordController::class, 'getData']);
    Route::post('data/consecutive',[LearningRecordController::class, 'getConsecutiveData']);
    Route::post('data/ratio',[LearningRecordController::class, 'getCategoryRatio']);

    /* GitHub リポジトリAPI */
    Route::get('/github/repositories', [GithubRepositoryController::class, 'index']);
    Route::get('/github/repositories/registered', [GithubRepositoryController::class, 'registered']);
    Route::post('/github/repositories', [GithubRepositoryController::class, 'store']);
    Route::post('/github/repositories/register', [GithubRepositoryController::class, 'registerRepository']);
    Route::post('/github/repositories/test-languages', [GithubRepositoryController::class, 'testFetchLanguages']);
    Route::post('/github/repositories/auto-classify', [GithubRepositoryController::class, 'autoClassifyCategories']);

});