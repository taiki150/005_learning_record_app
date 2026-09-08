"use client"
import { animate, useInView, useMotionValue } from "framer-motion";
import { GrafhApi, ConsecutiveApi } from "../../../../components/api/GrafhApi";
import { useEffect, useState, useRef } from "react";
import dayjs from 'dayjs';
import { FireIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

type RecordData = {
    recordData: {
        id: string;
        total_duration: number;
        study_date: string;
    }[],
};

type CountUpNumberProps = {
    number: number;
    fontSize?: string;
    isFloor?: boolean;
    speed?: "slow" | "medium" | "fast";
    withComma?:boolean
};

const speedDuration = {
    slow: 3,
    medium: 2,
    fast: 1,
};

const now = dayjs().format('YYYY-MM-DD');
const oneWeekAgo = dayjs().subtract(7, 'days').format('YYYY-MM-DD');
const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYY-MM-DD');

export default function DashboardPage() {
    const [weekData, setWeekData] = useState<RecordData | null>(null);
    const [monthData, setMonthData] = useState<RecordData | null>(null);
    const [onsecutiveDays, setConsecutiveDays] = useState<number>();

    useEffect(() => {
        Promise.all([
            GrafhApi({ start_date: oneWeekAgo, end_date: now }),
            GrafhApi({ start_date: oneMonthAgo, end_date: now }),
            ConsecutiveApi(now),
            
        ])
        .then(([week, month, onsecutiveDays]) => {
            setWeekData(week);
            setMonthData(month);
            setConsecutiveDays(onsecutiveDays.onsecutiveDays);
        })
        .catch((err) => {
            console.log("通信エラーが発生しました:", err);
        });
    }, []);

    const CountUpNumber = ({
        number,
        fontSize = "text-[max(8.533vw,32px)] md:text-[min(4.375vw,56px)]",
        isFloor = false,
        speed = "medium",
        withComma = true,
        }: CountUpNumberProps) => {
        const ref = useRef<HTMLSpanElement>(null);
        const isInView = useInView(ref, { once: true }); // 一度だけ実行

        // 動きの管理
        const motionValue = useMotionValue(speed === "fast" ? 1 : 0);

        useEffect(() => {
            if (isInView) {
            // 画面に入ったらアニメーション開始
            animate(motionValue, number, {
                duration: speedDuration[speed], // ここで長さを調整（秒単位）
                ease: speed === "fast" ? "linear" : "circOut",    // 終わりの方をゆっくりにする
                onUpdate: (latest) => {
                // 数値が更新されるたびにテキストを書き換える（再レンダリングを避けるため直接DOM操作）
                if (ref.current) {
                    const value = isFloor ? Math.round(latest * 10) / 10 : Math.floor(latest);
                    if (withComma) {
                        // カンマ付き
                        const formatter = isFloor
                        ? Intl.NumberFormat("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                        : Intl.NumberFormat("ja-JP");
                        ref.current.textContent = formatter.format(value);
                    } else {
                        // カンマ抜き
                        ref.current.textContent = value.toString();
                    }
                }
                },
            });
            }
        }, [isInView, number, motionValue, isFloor, speed]);

        return (
            <span
            ref={ref}
            className={`text-notch ${fontSize}`}
            >
            {number.toLocaleString()}
            </span>
        );
    }
    
    return (
        <section className="">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        ダッシュボード
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        学習の進捗を確認しましょう
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">連続日数</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{onsecutiveDays}</p>
                                <p className="mt-1 text-xs text-slate-500">今週</p>
                            </div>
                            <FireIcon className="w-12 h-12 text-indigo-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">今週の学習時間</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">0.0</p>
                                <p className="mt-1 text-xs text-slate-500">時間</p>
                            </div>
                            <ClockIcon className="w-12 h-12 text-sky-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">今月の学習時間</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">0.0</p>
                                <p className="mt-1 text-xs text-slate-500">時間</p>
                            </div>
                            <ChartBarIcon className="w-12 h-12 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">週間の学習時間</h2>
                        <div className="flex items-end justify-between gap-2 h-48">
                            {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                                <div key={day} className="flex flex-col items-center flex-1">
                                    <div className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg" style={{ height: "0%" }}></div>
                                    <p className="text-xs text-slate-600 mt-2">{day}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">カテゴリ別の時間配分</h2>
                        <div className="space-y-3">
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">今月の目標進捗</h2>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-700">目標: 50時間</p>
                                <p className="text-sm font-bold text-indigo-600">0%</p>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                                <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-3 rounded-full" style={{ width: "0%" }}></div>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">0.0/50</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
