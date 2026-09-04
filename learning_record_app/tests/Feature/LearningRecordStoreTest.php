<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\LearningRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningRecordStoreTest extends TestCase
{
    
    public function test_learning_record_stored()
    {

        /**
         * フラグ管理
         *  $user_create_flg true -> テストごとにユーザー作成 | false -> 既存のユーザー使用
         *  $category_create_flg true -> テストごとにカテゴリー作成 | false -> 既存のカテゴリー使用
         */
        $user_create_flg = true;
        $category_create_flg = true;

        /***********************************************
         * 
         *ここからテストコード 
         * 
         */

        // テストデータ作成
        $user = $user_create_flg ? User::factory()->create() : User::find(1);
        if($category_create_flg){
            $categories = Category::factory()->forUser($user)->count(10)->create();

        }

        $this->actingAs($user);

        $categoryIds = [
            (string)$categories[4]->id,
            (string)$categories[6]->id
        ];

        
        // リクエストデータ
        $requestData = [
            'study_date' => '2026-09-01',
            'hours' => 2,
            'minute' => 30,
            'category_id' => $categoryIds,
            'ratio' => [
                $categoryIds[0] => 20,
                $categoryIds[1] => 80,
            ],
            'memo' => 'テストです。',
        ];

        $response = $this->postJson('/api/record', $requestData);

        $response->assertStatus(201);
        $response->assertJson(['message' => '登録が完了しました']);


        // リクエストデータから合計時間（分）を計算
        $total_duration = ($requestData['hours']*60) + $requestData['minute'];

        // DBの検証①（親：learning_records）
        $this->assertDatabaseHas('learning_records', [
            'user_id' => $user->id,
            'study_date' => $requestData['study_date'],
            'total_duration' => $total_duration,
        ]);

        $learningRecord = LearningRecord::where('user_id', $user->id)
        ->where('study_date', $requestData['study_date'])
        ->first();

        // DBの検証②（子：learning_record_details）
        for ($i=0; $i < count($requestData['category_id']); $i++) { 
            $this->assertDatabaseHas('learning_record_details', [
                'learning_record_id' => $learningRecord->id,
                'category_id' => $requestData['category_id'][$i],
                'ratio' => $requestData['ratio'][$i],
                'deuration' => $total_duration * ($requestData['ratio'][$i] / 100),
            ]);
        }


        
        // Assert（検証）
        // 結果が正しいか確認
    }
}
