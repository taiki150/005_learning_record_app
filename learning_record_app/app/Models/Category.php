<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\User;



class Category extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'color_code',
        'delete_flg',
        'github_repository_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function githubRepository()
    {
        return $this->belongsTo(GithubRepository::class);
    }
}
