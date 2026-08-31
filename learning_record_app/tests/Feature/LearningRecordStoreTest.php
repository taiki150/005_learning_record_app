<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningRecordStoreTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_learning_record_stored()
    {

        /**
         * flg管理
         *  $user_create_flg true -> テストごとにユーザー作成 | false -> 既存のユーザー使用
         *  $category_create_flg true -> テストごとにカテゴリー作成 | false -> 既存のカテゴリー使用
         */

        $user_create_flg = true;
        $category_create_flg = true;

        // テストデータ作成
        $user = $user_create_flg ? User::factory()->create() : User::find(1);

        if($category_create_flg){
            Category::factory()->count(10)->create();
        }

        $this->actingAs($user);
        
        // Act（実行）
        $requestData = [
            'study_date' => '2024-01-01',
            'hours' => 2,
            'minute' => 30,
            'category_id' => [1, 2],
            'ratio' => [50, 50],
            'memo' => 'テスト学習',
        ];

        $response = $this->postJson('/api/record', $requestData);

        // APIを呼び出す、または処理を実行
        
        // Assert（検証）
        // 結果が正しいか確認
    }
}
