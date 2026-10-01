'use client'

import { motion } from 'framer-motion';

type ShimmerProps = {
    width?: string;
    height?: string;
    className?: string;
    rounded?: boolean;
};

export function Shimmer({
    width = 'w-full',
    height = 'h-4',
    className = '',
    rounded = false,
}: ShimmerProps) {
    return (
        <motion.div
            className={`relative overflow-hidden bg-slate-200 ${width} ${height} ${rounded ? 'rounded-lg' : ''} ${className}`}
            animate={{
                backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
            }}
            style={{
                backgroundImage: 'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
                backgroundSize: '200% 100%',
            }}
        />
    );
}

export function ShimmerCard() {
    return (
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="space-y-4">
                <Shimmer width="w-1/3" height="h-4" rounded />
                <Shimmer width="w-full" height="h-8" rounded />
                <Shimmer width="w-1/4" height="h-3" rounded />
            </div>
        </div>
    );
}

export function ShimmerChart() {
    return (
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="space-y-4 mb-4">
                <Shimmer width="w-1/3" height="h-5" rounded />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Shimmer key={i} width="w-full" height="h-6" rounded className="mb-2" />
                ))}
            </div>
        </div>
    );
}

export function ShimmerCategoryList() {
    return (
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="space-y-4 mb-4">
                <Shimmer width="w-1/3" height="h-5" rounded />
            </div>
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Shimmer width="w-1/2" height="h-4" rounded />
                        <Shimmer width="w-full" height="h-3" rounded />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ShimmerGoal() {
    return (
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="space-y-4">
                <Shimmer width="w-1/3" height="h-5" rounded />
                <Shimmer width="w-full" height="h-4" rounded />
            </div>
        </div>
    );
}
