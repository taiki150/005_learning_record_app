<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;



class GithubRepository extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'owner',
        'repo_name',
        'branch',
        'access_token',
        'last_synced_at'
    ];

    protected $hidden = ['access_token'];
    protected $casts = [
        'access_token' => 'encrypted',
        'last_synced_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function commits()
    {
        return $this->hasMany(GithubCommit::class);
    }


}
