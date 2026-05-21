<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // ★これが必要
use App\Models\User;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        $userId = $user ? $user->id : '適当なユーザーUUID';

        $categories = [
            [
                'id'         => (string) Str::uuid(), // ★UUIDを生成
                'user_id'    => $userId,
                'name'       => 'PHP',
                'color_code' => '#4F5D95',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => (string) Str::uuid(), // ★UUIDを生成
                'user_id'    => $userId,
                'name'       => 'JavaScript',
                'color_code' => '#F7DF1E',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // ... 他のカテゴリも同様に 'id' => (string) Str::uuid() を追加
        ];

        DB::table('categories')->insert($categories);
    }
}