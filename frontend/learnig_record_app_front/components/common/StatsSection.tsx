'use client'

import { memo, useRef, useEffect } from "react";
import { animate, useInView, useMotionValue } from "framer-motion";
import { FireIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

type CountUpNumberProps = {
    number: number;
    fontSize?: string;
    isFloor?: boolean;
    speed?: "slow" | "medium" | "fast";
};

const speedDuration = {
    slow: 5,
    medium: 3,
    fast: 1,
};

const CountUpNumber = memo(({
    number,
    fontSize = "",
    isFloor = false,
    speed = "medium",
}: CountUpNumberProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    const motionValue = useMotionValue(speed === "fast" ? 1 : 0);

    useEffect(() => {
        if (isInView) {
            animate(motionValue, number, {
                duration: speedDuration[speed],
                ease: speed === "fast" ? "linear" : "circOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        const value = isFloor ? Math.round(latest * 10) / 10 : Math.floor(latest);
                        ref.current.textContent = value.toString();
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
});

CountUpNumber.displayName = 'CountUpNumber';

type StatsSectionProps = {
    onsecutiveDays: number;
    weekViewData: number;
    monthViewData: number;
};

export const StatsSection = memo(function StatsSection({
    onsecutiveDays,
    weekViewData,
    monthViewData,
}: StatsSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">連続日数</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            <CountUpNumber number={onsecutiveDays} isFloor={false} speed="fast"/>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">日</p>
                    </div>
                    <FireIcon className="w-12 h-12 text-indigo-500" />
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">今週の学習時間</p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            <CountUpNumber number={weekViewData} isFloor={true} speed="fast"/>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">時間</p>
                    </div>
                    <ClockIcon className="w-12 h-12 text-sky-500" />
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-600">今月の学習時間</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            <CountUpNumber number={monthViewData} isFloor={true} speed="slow"/>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">時間</p>
                    </div>
                    <ChartBarIcon className="w-12 h-12 text-emerald-500" />
                </div>
            </div>
        </div>
    );
});
