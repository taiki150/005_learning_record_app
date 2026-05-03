<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisteredUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisteredUserRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $user = User::registUser($request->validated());

            DB::commit();

            return response()->json([
                'message' => 'ユーザー登録を完了しました！',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ], 201);
        } catch (QueryException $e) {
            DB::rollBack();
            Log::error('ユーザー登録失敗(QueryException): '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'message' => '入力内容に誤りがあるか、既に登録されている可能性があります。内容を確認して再度お試しください。',
            ], 500);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('ユーザー登録失敗: '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'message' => '登録時にエラーが発生しました。再度お試しください。',
            ], 500);
        }
    }
}
