<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

Route::post('/register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);