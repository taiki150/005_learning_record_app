<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category_name_array = [
            'PHP','Next.js','Laravel','TypeScript','JavaScript','React','Vue.js','Nuxt.js',
            'Docker','Git','GitHub','MySQL','PostgreSQL','Redis','Linux','Nginx','Apache','AWS','GCP',
            'REST API','GraphQL','Tailwind CSS','HTML','CSS',
            'CI/CD','ユニットテスト','セキュリティ','アーキテクチャ','リファクタリング',
        ];
        // 1番目はメインアカウントとして使用中
        $user = User::find(1);
        $color_code_array = [
            '#FFFFFF', '#000000', '#333333', '#F8F9FA', '#0D6EFD',
            '#6C757D', '#198754', '#FFC107', '#DC3545', '#6610F2',
        ];
        return [
            'user_id' => null,
            'name' => fake()->randomElement($category_name_array),
            'color_code' => fake()->randomElement($color_code_array),
            'delete_flg' => 1,
        ];
    }

    public function forUser($user)
    {
        return $this->state(['user_id' => $user->id]);
    }
}
