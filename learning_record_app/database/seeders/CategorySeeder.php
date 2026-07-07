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
        $users = User::all();

        $categoryNames = [
            ['name' => 'PHP', 'color_code' => '#4F5D95'],
            ['name' => 'JavaScript', 'color_code' => '#F7DF1E'],
            ['name' => 'Typescript', 'color_code' => '#0070f3'],
            ['name' => 'Laravel', 'color_code' => '#f55247'],
        ];

        foreach ($users as $user) {
            foreach ($categoryNames as $categoryData) {
                DB::table('categories')->insert([
                    'id'         => (string) Str::uuid(),
                    'user_id'    => $user->id,
                    'name'       => $categoryData['name'],
                    'color_code' => $categoryData['color_code'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}