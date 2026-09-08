<?php

namespace App\Models;

use App\Models\GithubRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class GithubCommit extends Model
{
    use HasUuids;

    protected $fillable = ['github_repository_id', 'sha', 'message', 'technologies', 'committed_at'];
    protected $casts = [
        'technologies' => 'array',
        'committed_at' => 'datetime',
    ];

    public function repository()
    {
        return $this->belongsTo(GithubRepository::class);
    }
}
