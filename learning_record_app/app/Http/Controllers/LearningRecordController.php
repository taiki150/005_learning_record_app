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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Carbon\Carbon;


class LearningRecordController extends Controller
{
    public function store(LearningRecordRequest $request):JsonResponse
    {
        $userId = Auth::user()->id;

        DB::beginTransaction();
        try {
            $record_id = (new LearningRecord())->registRecord($request, $userId);
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
        $user_id = Auth::user()->id;
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
        $user_id = Auth::user()->id;

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
}
