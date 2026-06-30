<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
            $learningRecord = LearningRecord::firstOrCreate(
                ['study_date' => $request->date],
                [
                    'id' => (string) Str::uuid(),
                    'user_id' => $userId,
                ]
            );

            if ($learningRecord->wasRecentlyCreated) {
                $learningRecord->registRecord($request, $userId);
            }
            
            $record_detail = new LearningRecordDetail();
            $record_detail->registRecordDetail($request, $learningRecord->id);

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
            'message' => '登録が完了しました。',
            'id' => $learningRecord->id
        ], 201);
    }
}
