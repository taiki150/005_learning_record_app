<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GithubRepository;
use App\Http\Requests\StoreGithubRepositoryRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GithubRepositoryController extends Controller
{
    /**
     * GitHub ユーザーのリポジトリ一覧を取得（すべてのリポジトリ）
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user->github_token) {
            return response()->json(['error' => 'GitHub token not found'], 400);
        }

        try {
            $repositories = $this->fetchGithubRepositories($user->github_token);

            // データベースから登録状態を取得
            $registeredRepos = GithubRepository::where('user_id', $user->id)
                ->get()
                ->keyBy(fn($repo) => "{$repo->owner}/{$repo->repo_name}");

            // リポジトリに登録状態を追加
            foreach ($repositories as &$repo) {
                $key = "{$repo['owner']}/{$repo['repo_name']}";
                $repo['is_registered'] = isset($registeredRepos[$key]) && $registeredRepos[$key]->is_registered;
            }

            return response()->json($repositories, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch GitHub repositories', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch repositories'], 500);
        }
    }

    /**
     * ユーザーが保存したすべてのリポジトリを取得（登録状態に関わらず）
     */
    public function registered()
    {
        $user = Auth::user();

        try {
            $repositories = GithubRepository::where('user_id', $user->id)
                ->get()
                ->map(function ($repo) {
                    return [
                        'owner' => $repo->owner,
                        'repo_name' => $repo->repo_name,
                        'url' => "https://github.com/{$repo->owner}/{$repo->repo_name}",
                        'is_private' => false,
                        'is_registered' => $repo->is_registered,
                    ];
                })
                ->toArray();

            return response()->json($repositories, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch registered repositories', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch repositories'], 500);
        }
    }

    /**
     * リポジトリを登録（is_registered = true に設定）
     */
    public function registerRepository(Request $request)
    {
        $user = Auth::user();
        $token = $user->github_token;

        if (!$token) {
            return response()->json(['error' => 'GitHub token not found'], 400);
        }

        $validated = $request->validate([
            'owner' => 'required|string',
            'repo_name' => 'required|string',
        ]);

        try {
            $repository = GithubRepository::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'owner' => $validated['owner'],
                    'repo_name' => $validated['repo_name'],
                ],
                [
                    'access_token' => $token,
                    'branch' => 'main',
                    'is_registered' => true,
                    'last_synced_at' => now(),
                ]
            );

            Log::info('Repository registered', [
                'user_id' => $user->id,
                'owner' => $validated['owner'],
                'repo_name' => $validated['repo_name']
            ]);

            return response()->json([
                'message' => 'Repository registered successfully',
                'repository' => $repository
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to register repository', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 複数のリポジトリを登録
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $token = $user->github_token;

        if (!$token) {
            return response()->json(['error' => 'GitHub token not found'], 400);
        }

        $validated = $request->validate([
            'repositories' => 'required|array',
            'repositories.*.owner' => 'required|string',
            'repositories.*.repo_name' => 'required|string',
            'repositories.*.branch' => 'nullable|string',
        ]);

        try {
            Log::info('Attempting to register repositories', [
                'user_id' => $user->id,
                'repositories' => $validated['repositories']
            ]);

            $createdCount = 0;
            foreach ($validated['repositories'] as $repo) {
                $result = GithubRepository::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'owner' => $repo['owner'],
                        'repo_name' => $repo['repo_name'],
                    ],
                    [
                        'access_token' => $token,
                        'branch' => $repo['branch'] ?? 'main',
                        'last_synced_at' => now(),
                    ]
                );
                $createdCount++;
            }

            Log::info('Repositories registered successfully', [
                'user_id' => $user->id,
                'count' => $createdCount,
                'repositories' => $validated['repositories']
            ]);

            return response()->json([
                'message' => 'Repositories registered successfully',
                'count' => $createdCount
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to register repositories', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $validated ?? $request->all()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 言語取得のテスト（デバッグ用）
     */
    public function testFetchLanguages(Request $request)
    {
        $user = Auth::user();
        $token = $user->github_token;

        if (!$token) {
            return response()->json(['error' => 'GitHub token not found'], 400);
        }

        $validated = $request->validate([
            'owner' => 'required|string',
            'repo_name' => 'required|string',
        ]);

        try {
            Log::info('Testing language fetch', [
                'owner' => $validated['owner'],
                'repo_name' => $validated['repo_name']
            ]);

            $languages = $this->fetchLanguages($token, $validated['owner'], $validated['repo_name']);

            return response()->json([
                'success' => true,
                'languages' => $languages,
                'count' => count($languages)
            ], 200);
        } catch (\Exception $e) {
            Log::error('Language fetch test failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * リポジトリから言語を取得してカテゴリを自動作成/選択
     */
    public function autoClassifyCategories(Request $request)
    {
        $user = Auth::user();
        $token = $user->github_token;

        if (!$token) {
            return response()->json(['error' => 'GitHub token not found'], 400);
        }

        $validated = $request->validate([
            'owner' => 'required|string',
            'repo_name' => 'required|string',
        ]);

        try {
            $languages = $this->fetchLanguages($token, $validated['owner'], $validated['repo_name']);

            if (empty($languages)) {
                return response()->json(['message' => 'No languages detected', 'categories' => []], 200);
            }

            $repository = GithubRepository::where('user_id', $user->id)
                ->where('owner', $validated['owner'])
                ->where('repo_name', $validated['repo_name'])
                ->firstOrFail();

            $categories = [];
            foreach ($languages as $language) {
                $category = \App\Models\Category::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'name' => $language,
                    ],
                    [
                        'color_code' => $this->getLanguageColor($language),
                        'github_repository_id' => $repository->id,
                    ]
                );

                // データベースから再取得して完全なデータを確保
                $category->refresh();
                $categories[] = $category;
            }

            Log::info('Categories auto-classified', [
                'user_id' => $user->id,
                'repository_id' => $repository->id,
                'languages' => $languages,
                'categories_count' => count($categories)
            ]);

            return response()->json([
                'message' => 'Categories created/selected successfully',
                'categories' => $categories,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to auto-classify categories', [
                'user_id' => $user->id,
                'owner' => $validated['owner'] ?? null,
                'repo_name' => $validated['repo_name'] ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * GitHub API からリポジトリの言語一覧を取得
     */
    private function fetchLanguages(string $token, string $owner, string $repoName): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/vnd.github.v3+json',
                'User-Agent' => 'Laravel-Learning-Record-App',
            ])->timeout(10)->get("https://api.github.com/repos/{$owner}/{$repoName}/languages");

            if ($response->failed()) {
                Log::error('GitHub API language request failed', [
                    'status' => $response->status(),
                    'owner' => $owner,
                    'repo' => $repoName,
                    'response' => $response->body()
                ]);
                throw new \Exception('GitHub API request failed: ' . $response->status() . ' - ' . $response->body());
            }

            $languages = $response->json();

            if (!is_array($languages)) {
                Log::warning('GitHub API returned non-array languages', [
                    'owner' => $owner,
                    'repo' => $repoName,
                    'response' => $languages
                ]);
                return [];
            }

            return array_keys($languages);
        } catch (\Exception $e) {
            Log::error('Error fetching languages from GitHub', [
                'owner' => $owner,
                'repo' => $repoName,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * 言語に基づいて色を取得
     */
    private function getLanguageColor(string $language): string
    {
        $colors = [
            'Python' => '#3776ab',
            'JavaScript' => '#f1e05a',
            'Java' => '#b07219',
            'Go' => '#00add8',
            'Rust' => '#ce422b',
            'PHP' => '#777bb4',
            'Ruby' => '#cc342d',
            'TypeScript' => '#2b7a0b',
            'C++' => '#f34b7d',
            'C#' => '#239120',
        ];

        return $colors[$language] ?? '#' . substr(md5($language), 0, 6);
    }

    /**
     * GitHub API からリポジトリ一覧を取得
     */
    private function fetchGithubRepositories(string $token): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/vnd.github.v3+json',
            'User-Agent' => 'Laravel-Learning-Record-App',
        ])->get('https://api.github.com/user/repos?per_page=100');

        if ($response->failed()) {
            throw new \Exception('GitHub API request failed: ' . $response->status());
        }

        $repos = $response->json();

        return array_map(function ($repo) {
            return [
                'owner' => $repo['owner']['login'],
                'repo_name' => $repo['name'],
                'url' => $repo['html_url'],
                'is_private' => $repo['private'],
            ];
        }, $repos);
    }
}
