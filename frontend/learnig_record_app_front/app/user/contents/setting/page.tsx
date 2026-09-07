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

export default function SettingPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'goals' | 'categories'>('profile');
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

    const tabs = [
        { id: 'profile', label: 'プロフィール', icon: UserIcon },
        { id: 'goals', label: '目標設定', icon: AdjustmentsHorizontalIcon },
        { id: 'categories', label: 'カテゴリ', icon: BookOpenIcon },
    ];

    // プロフィール情報取得

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

    // プロフィール情報取得

    return (
        <section className="">
            <div className="mx-auto max-w-6xl px-4">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">設定</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* サイドメニュー（SP上側、md以上で右） */}
                    <div className="md:col-span-1 md:order-last">
                        <div className="flex md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-x-visible mb-6 md:mb-0">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id as any)}
                                    className={`flex md:flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap md:whitespace-normal transition-all md:w-full ${
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

                    {/* コンテンツエリア（md以上で左） */}
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
                                            // onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">メールアドレス</label>
                                        <input
                                            type="email"
                                            value={userProfileData.email}
                                            // onChange={(e) => setProfileEmail(e.target.value)}
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
                                    {/* カテゴリ追加 */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                            <span className="text-sm font-medium text-slate-700">選択中:</span>
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-slate-300 shadow-sm"
                                                style={{ backgroundColor: pickColor }}
                                            ></div>
                                            <span className="text-sm font-mono text-slate-600">{pickColor}</span>
                                            <button
                                                className="ml-auto px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium cursor-pointer"
                                            >
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
                                            <button
                                                // onClick={}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                            >
                                                追加
                                            </button>
                                        {/* <HexColorPicker color={pickColor} onChange={setPickColor} /> */}
                                        </div>
                                        <button
                                                // onClick={}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                カテゴリーを追加する
                                            </button>
                                    </div>

                                    {/* カテゴリリスト */}
                                    <div className="space-y-2">
                                        {selectedCategories.map((category, index) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full `} style={{ backgroundColor: category.color_code }}></div>
                                                    <span className="font-medium text-slate-900">{category.name}</span>
                                                </div>
                                                <button
                                                    // onClick={() => deleteCategory(category.id)}
                                                    className="px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}