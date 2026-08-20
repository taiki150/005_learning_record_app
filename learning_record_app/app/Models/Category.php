<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\User;



class Category extends Model
{
    use HasFactory, HasUuids;

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
        protected $fillable = [
            'user_id',
            'name',
            'color_code',
            'delete_flg',
    ];
}
