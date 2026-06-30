<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class LearningRecordDetail extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'learning_record_id',
        'category_id',
        'ratio',
        'duration',
        'memo',
    ];

    public function registRecordDetail($request, $learningRecord_id) {
        DB::table('LearningRecordDetail')->insert([
            'id' => (string) Str::uuid(),
            'learning_record_id' => $learningRecord_id,
            'category_id' => $request->category_id,
            'ratio' => $request->ratio,
            'duration' => $request->duration,
            'memo' => $request->memo,
        ]);
    }

}
