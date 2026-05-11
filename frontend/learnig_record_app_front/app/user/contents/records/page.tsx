"use client";
import { useMemo, useState } from "react";


export default function RecordsPage() {


    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

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
                        1日の学習時間を記録
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
                                        htmlFor="hours"
                                    >
                                        日付
                                    </label>
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2">
                                            <span className="text-sm font-medium text-slate-800">
                                                本日の入力
                                            </span>
                                            <div className="relative inline-flex items-center">
                                                <label className="relative inline-flex cursor-pointer items-center">
                                                    <input
                                                        id="switch-today-auto"
                                                        type="checkbox"
                                                        className="peer sr-only"
                                                    />
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
                                    <input
                                        id="learning-date"
                                        type="date"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                    />
                                    <p className="mt-1 hidden text-xs text-slate-500 peer-checked:block">
                                        ONのときは当日の記録を自動で作成します。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium text-slate-800"
                                    htmlFor="learning-title"
                                >
                                    学習内容
                                </label>
                                <input
                                    id="learning-title"
                                    type="text"
                                    placeholder="例: Next.js / 数学 / 英単語"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                />
                            </div>
                            <div className="text-center mt-3 w-[100px] m-auto">
                                <a className="flex justify-center text-[12px] font-medium text-indigo-500 cursor-pointer">
                                    カテゴリー一覧
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                                        className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                                        
                                        <path fill-rule="evenodd"
                                            d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-1">
                                <div className="space-y-3">
                                    <label
                                        className="block text-sm font-medium text-slate-800"
                                        htmlFor="hours"
                                    >
                                        学習時間（時間）
                                    </label>
                                    <input
                                        value={String(hours)}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if(v === ""){ return setHours(0); }                                            
                                            const n = parseInt(v, 10);
                                            setHours(Number.isFinite(n) && n >= 0 ? n : 0);
                                        }}
                                        id="hours" type="number" inputMode="numeric"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                    />

                                    <div className="grid grid-cols-4 gap-2">
                                        <button type="button" onClick={() => addHourse(0)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">0</button>
                                        <button type="button" onClick={() => addHourse(1)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">1</button>
                                        <button type="button" onClick={() => addHourse(2)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">2</button>
                                        <button type="button" onClick={() => addHourse(4)}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">4</button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label
                                    className="block text-sm font-medium text-slate-800"
                                    htmlFor="minutes"
                                >
                                    学習時間（分）
                                </label>
                                <input
                                    value={String(minutes)}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if(v === ""){ return setMinutes(0); }
                                        const n:number = parseInt(v, 10);

                                        const nextMinutes = n % 60;
                                        setMinutes(nextMinutes);
                                    }}
                                    id="minutes" type="number" inputMode="numeric" min={0} step={5}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                />
                                <div className="grid grid-cols-4 gap-2">
                                    <button type="button" onClick={() => addMinutes(0)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">0</button>
                                    <button type="button" onClick={() => addMinutes(15)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">15</button>
                                    <button type="button" onClick={() => addMinutes(30)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">30</button>
                                    <button type="button" onClick={() => addMinutes(45)}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">45</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                className="block text-sm font-medium text-slate-800"
                                htmlFor="notes"
                            >
                                メモ（任意）
                            </label>
                            <textarea
                                id="notes"
                                rows={5}
                                placeholder="例: 今日できたこと / 次にやること / 詰まった点"
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <button
                                type="button"
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                            >
                                クリア
                            </button>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
                            >
                                保存
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}