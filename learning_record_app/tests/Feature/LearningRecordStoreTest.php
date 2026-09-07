<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\LearningRecord;
use Tests\TestCase;
use Tests\Data\LearningRequestData;

class LearningRecordStoreTest extends TestCase
{
    
    public function test_learning_record_stored()
    {

        /** *****************************************
         * ①カスタムエリア（フラグ）
         ** *****************************************
         * @var 
         * - $user_create_flg : true =  factoryからユーザーの作成を行う（テスト毎）
         *                      false = 既存のユーザーの使用（find(**)で指定可能）
         * - $category_create_flg : true = factoryからカテゴリーの作成を行う（テスト毎）
         *                          false = 既存カテゴリーの使用（ログイン中のユーザーのカテゴリーデータ（$user）が必須）
         * *******************************************/
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
        }else{
            $categories = Category::where('user_id', $user->id)->get();
        }
        $this->actingAs($user);

        /** *****************************************
         * ②カスタムエリア（リクエストデータ）
         ** *****************************************
         * @var array{
         * random: bool, 
         * custom: array {
         *          study_date: string,
         *          hours: int,
         *          minute: int,
         *          category_id: array<int>,
         *          ratio: array<int, int>,
         *          memo: string
         *      }
         * }
         * テストリクエストデータの設定配列
         * - random: true = ランダムなテストデータを生成、false = customで指定したデータを使用
         * - custom: APIに送信するカスタムリクエストデータ（random=falseの時に使用）
         * 
         * コマンド：```
         * docker compose exec php php artisan test tests/Feature/LearningRecordStoreTest.php
         * ```
         * *******************************************/
        $requestDataArray = [
            // 正常テスト（エラーなし）
            'random' => true,

            // カスタムリクエストデータ（正常 or エラーテスト | 'random' => false,に変更して使用 ）
             'custom' => [
                'study_date' => '2026-09-01',
                'hours' => 2,
                'minute' => 30,
                'category_id' => [
                    $categories[4]->id,
                    $categories[6]->id,
                ],
                'ratio' => [
                    $categories[4]->id => 20,
                    $categories[6]->id => 80,
                ],
                'memo' => 'テストです。',
            ],
         ];

        /* *******************************************
         * カスタムエリア ここまで
         * *******************************************/

        $requestData = $requestDataArray['random'] ? 
            LearningRequestData::createRequestData($categories) : $requestDataArray['custom'];

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
        foreach ($requestData['category_id'] as $categoryId) {
            $this->assertDatabaseHas('learning_record_details', [
                'learning_record_id' => $learningRecord->id,
                'category_id' => $categoryId,
                'ratio' => $requestData['ratio'][$categoryId],
                'deuration' => round($total_duration * ($requestData['ratio'][$categoryId] / 100), 2),
            ]);
        }
    }
}
