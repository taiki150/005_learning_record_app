<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
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
});

// 認証が必要なエンドポイント
Route::middleware([StartSession::class, 'auth:sanctum'])->group(function () {
    // セッション確認API
    Route::get('/user', [AuthenticatedSessionController::class, 'sessionCheck']);

    // ログアウト
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // カテゴリー取得API
    Route::get('/categories', [CategoryController::class, 'index']);

    // カテゴリー取得API
    Route::post('/record', [LearningRecordController::class, 'store']);

    
    /* ここからData取得API */
    Route::post('data/record',[LearningRecordController::class, 'getData']);
    Route::post('data/consecutive',[LearningRecordController::class, 'getConsecutiveData']);

    Route::post('/github/repositories', [GithubRepositoryController::class, 'store']);

});