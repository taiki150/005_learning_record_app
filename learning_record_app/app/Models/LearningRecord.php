<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\LearningRecordDetail;
use Illuminate\Support\Str;


class LearningRecord extends Model
{
    use HasFactory, HasUuids;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'user_id',
        'total_duration',
        'study_date',
        'memo',
    ];

    public function learningRecordDetails() {
        return $this->hasMany('App\Models\LearningRecordDetail');
    }

    public function registRecord($request, $user_id) {
        $uuid = (string) Str::uuid();
        LearningRecord::create([
            'id' => $uuid,
            'user_id' => $user_id,
            'total_duration' => 0,
            'study_date' => $request->study_date,
            'memo' => $request->memo,
        ]);
        return $uuid;
    }

    public function updateRecord($request, $day) {
        $new_time = ($request->hours * 60) + $request->minute;
        $this->increment('total_duration', $new_time);
    }

}
