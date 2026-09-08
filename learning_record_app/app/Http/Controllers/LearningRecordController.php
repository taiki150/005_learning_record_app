<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RatioCalculatorService;
use App\Models\Category;
use App\Models\LearningRecord;
use App\Models\LearningMemo;
use App\Models\LearningRecordDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LearningRecordRequest;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Carbon\Carbon;


class LearningRecordController extends Controller
{

    public function getUser($id) {

        $userData = Auth::user();

        if($id){
            $userData = $userData->id;
        }

        return $userData;
    }

    public function store(LearningRecordRequest $request):JsonResponse
    {
        $user_id = $this->getUser(true);

        DB::beginTransaction();
        try {
            $record_id = (new LearningRecord())->registRecord($request, $user_id);
            $learningRecord = LearningRecord::where('id', $record_id)->first();

            if(isset($request->memo)){
                LearningMemo::registRecordMemo($record_id, $request->memo);
            }

            $calculator = new RatioCalculatorService();
            $ratioOb = $calculator->calculateRatios($request);

            $record_detail = new LearningRecordDetail;
            $record_detail->registRecordDetail($request, $record_id, $ratioOb);

            $learningRecord->updateRecord($request, $learningRecord->study_date);
            DB::commit();

        } catch (QueryException $e) {
            DB::rollBack();
            Log::error('学習記録登録失敗(QueryException): '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'message' => '登録時にエラーが発生しました。再度お試しください。',
            ], 500);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('学習記録登録失敗(Throwable): '.$e->getMessage(), ['exception' => $e]);

            return response()->json([
                'message' => '登録時にエラーが発生しました。再度お試しください。',
            ], 500);
        }
        

        return response()->json([
            'message' => '登録が完了しました',
        ], 201);
    }

    // グラフ期間の取得API
    public function getData() {
        $request = request()->getContent();
        $data = json_decode($request);
        $user_id = $this->getUser(true);
        $startDate = $data->start_date;
        $endDate = $data->end_date;

        $record_readers = LearningRecord::where('user_id', $user_id)
            ->whereBetween('study_date', [$startDate, $endDate])
            ->with('learningRecordDetails')
            ->get();

        return response()->json([
            'recordData' => $record_readers,
        ], 200);
    }


    // 連続日数の取得
    public function getConsecutiveData() {
        $request = request()->getContent();
        $data = json_decode($request);
        $user_id = $this->getUser(true);

        $baseDate = new Carbon($data, 'Asia/Tokyo');
        $rangeEnd_Today = $baseDate->format('Y-m-d');
        $rangeStarte_OneYearAgo = $baseDate->copy()->subDays(365)->format('Y-m-d');

        $records = LearningRecord::where('user_id', $user_id)
            ->whereBetween('study_date', [$rangeStarte_OneYearAgo, $rangeEnd_Today])
            ->pluck('study_date')
            ->toArray();

            $recordMap = array_flip($records);
            $onsecutiveDays = 0;

            $todayStr = $baseDate->format('Y-m-d');
            $yesterdayStr = $baseDate->copy()->subDay()->format('Y-m-d');

            if(isset($recordMap[$todayStr])){
                $baseDate;
            }elseif(isset($recordMap[$yesterdayStr])){
                $baseDate->subDay();

            }else{
                return response()->json([
                    'onsecutiveDays' => $onsecutiveDays,
                ], 200);
            }
            
            for ($i=0; $i < 365; $i++) { // 365日分をMaxカウントとして設定（当面はこちらで設定）

                $formattedCheckDate = $baseDate->format('Y-m-d');
    
                if (isset($recordMap[$formattedCheckDate])) {
                    $onsecutiveDays++;
                    $baseDate->subDay();
                } else {
                    break; 
                }
            }

        return response()->json([
            'onsecutiveDays' => $onsecutiveDays,
        ], 200);
    }

    public function getCategoryRatio() {
        $request = request()->getContent();
        $data = json_decode($request);
        $user_id = $this->getUser(true);

        $startDate = $data->start_date;
        $endDate = $data->end_date;

        $record_readers = LearningRecord::where('user_id', $user_id)
            ->whereBetween('study_date', [$startDate, $endDate])
            ->with('learningRecordDetails')
            ->get();
        
        $categoryData = [];
        $count = 0;
        $totalTime = 0;

        $categories = Category::where('user_id', $user_id)
            ->select('id', 'name', 'color_code')
            ->get();

        foreach ($categories as $category) {
            $categoryData[$category->id] = 
            [
                "name" => $category->name,
                "color" => $category->color_code,
                "ratio" => 0,
                "duration" => 0,
            ];
        }
        
        foreach ($record_readers as $record) {
            foreach ($record->learningRecordDetails as $detail) {
                if(isset($categoryData[$detail->category_id])){
                    $categoryData[$detail->category_id]["duration"] += $detail->deuration;
                }
            }
            $totalTime += $record->total_duration;
        }

        if($totalTime > 0){
            foreach ($categoryData as $key => $data) {
                $categoryData[$key]["ratio"] = round(($data['duration']/$totalTime)*100, 1);
            }
            usort($categoryData, function($a, $b) {
                if ($a['ratio'] == $b['ratio']) { return 0; }
                return ($a['ratio'] < $b['ratio']) ? 1 : -1;
            });
        }

        return response()->json(array_values($categoryData), 200);
    }

    
}
