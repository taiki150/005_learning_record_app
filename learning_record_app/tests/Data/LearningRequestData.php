<?php
namespace Tests\Data;

class LearningRequestData {

    public static function createRequestData($categories) {
        $count = random_int(1, 4);
        $selectedCategories = [];
        $selectedRatio = [];

        // ランダムデータの作成
        $study_date = now()->format('Y-m-d');
        $hours = random_int(0, 23);
        $minute = random_int(0, 59);
        $ratioArrayAdd = 0;

        for ($i=0; $i < $count; $i++) { 
            $ratioArray[] = $ratioNumber = random_int(1, 10)*10;
            $ratioArrayAdd += $ratioArray[$i];
        }

        for($i=0; $i < $count; $i++) {
            $selectedCategories[] = $categories->random()->id;
            $ratioArrayNumber = ($ratioArray[$i]/$ratioArrayAdd)*100;
            $selectedRatio[$selectedCategories[$i]] = $ratioArrayNumber;

        }
        $memo = 'テストデータです。';

        $requestData = [
            'study_date' => $study_date,
            'hours' => $hours,
            'minute' => $minute,
            'category_id' => $selectedCategories,
            'ratio' => $selectedRatio,
            'memo' => $memo,
        ];

        

        return $requestData;
    }
}


?>