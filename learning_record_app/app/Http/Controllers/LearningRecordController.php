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


class LearningRecordController extends Controller
{
    public function store(LearningRecordRequest $request):JsonResponse
    {
        
        // DB::beginTransaction();

        // clock($request);
        clock(Auth::user()->id);

        
        return response()->json("aaa", 201);
    }
}
