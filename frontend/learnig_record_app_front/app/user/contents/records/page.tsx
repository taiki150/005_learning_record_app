"use client";
import { useState, useEffect } from "react";
import { apiWrapper } from '@/utils/api';


const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type Category = {
    id: number;
    name: string;
};

export default function RecordsPage() {

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]); 

    // カテゴリー一覧の取得
    useEffect(() => {

        apiWrapper(`${apiBaseUrl}/categories`, {
            method: 'GET',
        })
        .then(res => res.json())
        .then(categoriesData => {
            setCategories(categoriesData);
        })
        .catch(error => console.error('カテゴリ取得エラー:', error));
    }, []);

    function addHourse(delta: number) {
        if(delta === 0){
            setHours(0);
            return;
        }
        setHours((h) => Math.max(0, h + delta));
    }

    function addMinutes(delta: number) {
        if(delta === 0){
            setMinutes(0);
            return;
        }

        setMinutes((prevMinutes) => {
            const total = delta + prevMinutes;
            const carry = Math.floor(total / 60);
            const nextMinutes = ((total % 60) + 60) % 60;

            if (carry !== 0) {
                setHours((prevHours) => Math.max(0, prevHours + carry));
            }

            return nextMinutes;
        });
    }

    return (
        <section className="">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        学習時間記録
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        日付・学習内容・学習時間を入力して保存します。
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md sm:p-7">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div className="space-y-2 sm:col-span-1">
                                <div className="space-y-3">
                                    <label
                                        className="block text-sm font-medium text-slate-800"
                                    >
                                        日付
                                    </label>
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2">
                                            <span className="text-sm font-medium text-slate-800">
                                                本日の入力
                                            </span>
                                            <div className="relative inline-flex items-center">
                                                <label className="relative inline-flex cursor-pointer items-center">
                                                    <input id="switch-today-auto" type="checkbox" className="peer sr-only"/>
                                                    <span className="h-6 w-11 rounded-full bg-indigo-600 transition peer-checked:bg-slate-200" />
                                                    <span className="absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                                                </label>
                                            </div>
                                        </div>
                                </div>
                            </div>

                            <div className="space-y-3">

                                <div className="h-[0px] sm:h-[20px]"></div>
                                
                                <div className="flex-1">
                                    <input id="learning-date" type="date" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"/>
                                    <p className="mt-1 hidden text-xs text-slate-500 peer-checked:block">ONのときは当日の記録を自動で作成します。</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-1">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-800" htmlFor="hours">学習時間（時間）</label>
                                    <input
                                        value={String(hours)}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if(v === ""){ return setHours(0); }                                            
                                            const n = parseInt(v, 10);
                                            setHours(Number.isFinite(n) && n >= 0 ? n : 0);
                                        }}
                                        id="hours" type="number" inputMode="numeric" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                    />

                                    <div className="grid grid-cols-4 gap-2">
                                        <button type="button" onClick={() => addHourse(0)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">0</button>
                                        <button type="button" onClick={() => addHourse(1)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">1</button>
                                        <button type="button" onClick={() => addHourse(2)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">2</button>
                                        <button type="button" onClick={() => addHourse(4)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">4</button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-800" htmlFor="minutes">学習時間（分）</label>
                                <input
                                    value={String(minutes)}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if(v === ""){ return setMinutes(0); }
                                        const n:number = parseInt(v, 10);

                                        const nextMinutes = n % 60;
                                        setMinutes(nextMinutes);
                                    }}
                                    id="minutes" type="number" inputMode="numeric" min={0} step={5} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                />
                                <div className="grid grid-cols-4 gap-2">
                                    <button type="button" onClick={() => addMinutes(0)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">0</button>
                                    <button type="button" onClick={() => addMinutes(15)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">15</button>
                                    <button type="button" onClick={() => addMinutes(30)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">30</button>
                                    <button type="button" onClick={() => addMinutes(45)} className="rounded-xl cursor-pointer border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">45</button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-0">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-800" htmlFor="learning-title">カテゴリー</label>
                                <input id="learning-title" type="text" placeholder="例: Next.js / 数学 / 英単語" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"/>
                            </div>
                            <div className="text-center mt-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsPopupOpen(!isPopupOpen)}
                                    className="group inline-block text-[12px] font-medium text-indigo-500 cursor-pointer transition-[0.5s] hover:text-indigo-300"
                                >
                                    <div className="flex ">
                                        <span>全カテゴリ</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-1 bi bi-grid-fill transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 16 16">
                                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z"/>
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {isPopupOpen && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                {/* ポップアップ本体 */}
                                <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                                    <h2 className="text-lg font-bold mb-4">選択中のカテゴリー</h2>
                                    <div className="flex">
                                        {
                                            categories.map((category) => (
                                                <div key={category.id} className="flex items-center gap-2 p-2">
                                                    <div onClick={() => {
                                                            if (selectedCategories.includes(category.id)) {
                                                                setSelectedCategories(
                                                                    selectedCategories.filter((id) => id !== category.id)
                                                                );
                                                            } else {
                                                                setSelectedCategories([...selectedCategories, category.id]);
                                                            }
                                                        }} className={`
                                                            flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border-1
                                                            ${
                                                                selectedCategories.includes(category.id)
                                                                    ? 'bg-indigo-100 border-indigo-500'
                                                                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                            }
                                                        `}>
                                                        <div 
                                                            className={`
                                                                w-4 h-4 rounded border-1 flex items-center justify-center
                                                                transition-all duration-200
                                                                ${
                                                                    selectedCategories.includes(category.id)
                                                                        ? 'bg-indigo-500 border-indigo-500'
                                                                        : 'bg-white border-gray-300'
                                                                }
                                                            `}>
                                                            {selectedCategories.includes(category.id) && (
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" >
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-[14px]">{category.name}</span>
                                                    </div>
                                                </div>

                                            ))
                                        }
                                        </div>
                                    <div>

                                    </div>
                                    
                                    <button 
                                        onClick={() => setIsPopupOpen(false)}
                                        className="mt-4 bg-indigo-500 text-white px-3 py-2 rounded cursor-pointer transition-[0.5s] hover:bg-indigo-400"
                                    >
                                        閉じる
                                    </button>
                                </div>
                            </div>
                        )}


                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-800" htmlFor="notes">メモ（任意）</label>
                            <textarea id="notes" rows={5} placeholder="例: 今日できたこと / 次にやること / 詰まった点" className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"/>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">クリア</button>

                            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200">保存</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}