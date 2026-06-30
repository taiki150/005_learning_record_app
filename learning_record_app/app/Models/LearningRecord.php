<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
    ];

    public function registRecord($request, $userId) {
        DB::table('LearningRecord')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'total_duration' => 0,
            'study_date' => $request->date,
        ]);
    }

}
