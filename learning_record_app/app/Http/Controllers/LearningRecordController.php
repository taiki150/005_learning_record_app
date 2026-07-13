<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RatioCalculatorService;
use App\Models\Category;
use App\Models\LearningRecord;
use App\Models\LearningRecordDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LearningRecordRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;


class LearningRecordController extends Controller
{
    public function store(LearningRecordRequest $request):JsonResponse
    {
        $userId = Auth::user()->id;

        DB::beginTransaction();
        try {
            $record_id = (new LearningRecord())->registRecord($request, $userId);
            $learningRecord = LearningRecord::where('id', $record_id)->first();

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
}
