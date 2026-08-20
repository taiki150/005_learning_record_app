<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LearningMemo extends Model
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
        'memo',
    ];

    public function LearningRecord() {
        return $this->belongsTo('App\Models\LearningRecord');
    }

    public static function registRecordMemo($record_id, $memo) {
        DB::table('learning_memos')->insert([
            'id' => (string) Str::uuid(),
            'learning_record_id' => $record_id,
            'memo' => $memo,
        ]);
    }
}
