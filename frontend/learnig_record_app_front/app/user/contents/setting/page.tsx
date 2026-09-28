"use client";
import { useEffect, useState } from "react";
import { apiWrapper } from '@/utils/api';
import { BookOpenIcon, AdjustmentsHorizontalIcon, UserIcon } from "@heroicons/react/24/outline";
import { HexColorPicker } from "react-colorful";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type categoryData = {
    id: string,
    name: string,
    color_code: string,
};

type userData = {
    name: string,
    email: string,
};

type GithubRepository = {
    owner: string;
    repo_name: string;
    url: string;
    is_private: boolean;
};

export default function SettingPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'goals' | 'categories' | 'github'>('profile');
    const [userProfileData, setUserProfileData] = useState<userData>(
        {
            name: "太郎",
            email: "taro@gmail.com",
        }
    );
    const [goalHours, setGoalHours] = useState(50);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [notifications, setNotifications] = useState({
        dailyReminder: true,
        weeklyReport: true,
        goalAlert: false,
    });

    const [selectedCategories, setSelectedCategories] = useState<categoryData[]>([]);
    const [pickColor, setPickColor] = useState("#aabbcc");
    const [githubRepositories, setGithubRepositories] = useState<GithubRepository[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [savingRepos, setSavingRepos] = useState(false);

    const tabs = [
        { id: 'profile', label: 'プロフィール', icon: UserIcon },
        { id: 'goals', label: '目標設定', icon: AdjustmentsHorizontalIcon },
        { id: 'categories', label: 'カテゴリ', icon: BookOpenIcon },
        { id: 'github', label: 'GitHub リポジトリ', icon: UserIcon },
    ];

    // カテゴリー取得
    useEffect(() => {
        apiWrapper(`${apiBaseUrl}/categories`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(selectedCategories => {
            setSelectedCategories(selectedCategories);
            console.log(selectedCategories);
        })
        .catch(error => console.error('カテゴリ取得エラー:', error));
    }, []);

    // GitHub リポジトリ取得
    useEffect(() => {
        if (activeTab === 'github') {
            setLoadingRepos(true);
            Promise.all([
                apiWrapper(`${apiBaseUrl}/github/repositories`, { method: 'GET' }).then(res => res.json()),
                apiWrapper(`${apiBaseUrl}/github/repositories/registered`, { method: 'GET' }).then(res => res.json())
            ])
            .then(([allRepos, registeredRepos]) => {
                setGithubRepositories(allRepos);

                // 登録済みリポジトリをフィルタリング
                const registeredKeys = registeredRepos.map((repo: any) => `${repo.owner}/${repo.repo_name}`);
                setSelectedRepos(new Set(registeredKeys));

                setLoadingRepos(false);
            })
            .catch(error => {
                console.error('GitHub リポジトリ取得エラー:', error);
                setLoadingRepos(false);
            });
        }
    }, [activeTab]);

    const handleSaveRepositories = async () => {
        setSavingRepos(true);
        const repos = Array.from(selectedRepos).map(key => {
            const [owner, repo_name] = key.split('/');
            return { owner, repo_name, branch: 'main' };
        });

        try {
            const response = await apiWrapper(`${apiBaseUrl}/github/repositories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repositories: repos })
            });
            const data = await response.json();

            if (!response.ok) {
                console.error('エラーレスポンス:', data);
                alert(`リポジトリ登録に失敗しました: ${data.error || response.statusText}`);
                setSavingRepos(false);
                return;
            }

            setSavingRepos(false);
            alert('リポジトリが登録されました');
        } catch (error) {
            setSavingRepos(false);
            console.error('リポジトリ登録エラー:', error);
            alert(`リポジトリ登録に失敗しました: ${error}`);
        }
    };

    return (
        <section className="">
            <div className="mx-auto max-w-6xl px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">設定</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* サイドメニュー */}
                    <div className="md:col-span-1 md:order-last">
                        <div className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-x-visible mb-6 md:mb-0">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex md:flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap md:whitespace-normal transition-all md:w-full cursor-pointer ${
                                        activeTab === id
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 md:mr-2" />
                                    <span className="hidden md:inline text-[14px]">{label}</span>
                                    <span className="md:hidden">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* コンテンツエリア */}
                    <div className="md:col-span-2">

                        {/* プロフィール設定 */}
                        {activeTab === 'profile' && (
                            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">プロフィール設定</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">ユーザー名</label>
                                        <input
                                            type="text"
                                            value={userProfileData.name}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">メールアドレス</label>
                                        <input
                                            type="email"
                                            value={userProfileData.email}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                                        保存する
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 目標設定 */}
                        {activeTab === 'goals' && (
                            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">学習目標設定</h2>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-medium text-slate-700">月間目標時間</label>
                                            <span className="text-2xl font-bold text-indigo-600">{goalHours}時間</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="200"
                                            step="5"
                                            value={goalHours}
                                            onChange={(e) => setGoalHours(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                                            <span>10時間</span>
                                            <span>200時間</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-indigo-50 rounded-lg">
                                        <p className="text-sm text-indigo-900">
                                            月間目標: <span className="font-bold">{goalHours}時間</span>
                                        </p>
                                        <p className="text-xs text-indigo-700 mt-1">現在の進捗: 0時間 (0%)</p>
                                    </div>
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                                        保存する
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* カテゴリ管理 */}
                        {activeTab === 'categories' && (
                            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">学習カテゴリ管理</h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                            <span className="text-sm font-medium text-slate-700">選択中:</span>
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-slate-300 shadow-sm"
                                                style={{ backgroundColor: pickColor }}
                                            ></div>
                                            <span className="text-sm font-mono text-slate-600">{pickColor}</span>
                                            <button className="ml-auto px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium cursor-pointer">
                                                変更
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                placeholder="新しいカテゴリ名を入力"
                                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                                追加
                                            </button>
                                        </div>
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                            カテゴリーを追加する
                                        </button>
                                    </div>

                                    {/* カテゴリリスト */}
                                    <div className="space-y-2">
                                        {selectedCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color_code }}></div>
                                                    <span className="font-medium text-slate-900">{category.name}</span>
                                                </div>
                                                <button className="px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                                                    削除
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GitHub リポジトリ管理 */}
                        {activeTab === 'github' && (
                            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">GitHub リポジトリ選択</h2>
                                <div className="space-y-6">
                                    {loadingRepos ? (
                                        <div className="p-6 text-center">
                                            <p className="text-slate-600">リポジトリ一覧を読み込み中...</p>
                                        </div>
                                    ) : githubRepositories.length === 0 ? (
                                        <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
                                            <p className="text-amber-900 text-center">
                                                GitHub がまだ連携されていません。
                                            </p>
                                            <button
                                                onClick={() => window.location.href = `${apiBaseUrl}/auth/github/redirect`}
                                                className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                GitHub で連携する
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                <p className="text-sm text-slate-600">
                                                    登録するリポジトリを選択してください（複数選択可能）
                                                </p>
                                                <div className="space-y-2 max-h-96 overflow-y-auto border border-slate-200 rounded-lg p-4 bg-slate-50">
                                                    {githubRepositories.map((repo) => {
                                                        const key = `${repo.owner}/${repo.repo_name}`;
                                                        return (
                                                            <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRepos.has(key)}
                                                                    onChange={(e) => {
                                                                        const newSelected = new Set(selectedRepos);
                                                                        if (e.target.checked) {
                                                                            newSelected.add(key);
                                                                        } else {
                                                                            newSelected.delete(key);
                                                                        }
                                                                        setSelectedRepos(newSelected);
                                                                    }}
                                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-slate-900">{repo.repo_name}</p>
                                                                    <p className="text-xs text-slate-500">{repo.owner}</p>
                                                                </div>
                                                                {repo.is_private && (
                                                                    <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded whitespace-nowrap">Private</span>
                                                                )}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => window.location.href = `${apiBaseUrl}/auth/github/redirect`}
                                                    className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors border border-indigo-200"
                                                >
                                                    再認証
                                                </button>
                                                <button
                                                    onClick={handleSaveRepositories}
                                                    disabled={savingRepos || selectedRepos.size === 0}
                                                    className="ml-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {savingRepos ? '保存中...' : `選択したリポジトリを登録 (${selectedRepos.size})`}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
