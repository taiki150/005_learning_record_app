<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GithubRepository;
use App\Http\Requests\StoreGithubRepositoryRequest;
use Illuminate\Support\Facades\Auth;

class GithubRepositoryController extends Controller
{
    // リポジトリ登録
    public function store(StoreGithubRepositoryRequest $request)
    {
        $validated = $request->validated();
        $repository = Auth::user()->githubRepositories()->create($validated);

        return response()->json($repository, 201);
    }

}
