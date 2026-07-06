<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use App\Models\LearningRecord;
use Illuminate\Support\Str;

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
        'deuration',
    ];

    public function LearningRecord() {
        return $this->belongsTo('App\Models\LearningRecord');
    }

    public function registRecordDetail($request, $learningRecord_id, $ratioOb) {
        foreach($ratioOb as $category_id => $data) {
            DB::table('learning_record_details')->insert([
                'id' => (string) Str::uuid(),
                'learning_record_id' => $learningRecord_id,
                'category_id' => $category_id,
                'ratio' => $data['ratio'],
                'deuration' => $data['time'],
            ]);
        }
    }
}
