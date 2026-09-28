'use client'

import { memo, useRef, useEffect, useState } from "react";
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { FireIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

type CountUpNumberProps = {
    number: number;
    fontSize?: string;
    isFloor?: boolean;
    speed?: "slow" | "medium" | "fast";
};

type categoryRatioSectionData = {
    name: string;
    ratio: number;
    duration: number;
    color: string;
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

type StatCard = {
    id: 'consecutive' | 'week' | 'month';
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    isFloor: boolean;
    speed: "slow" | "medium" | "fast";
};

type StatsSectionProps = {
    onsecutiveDays: number;
    weekViewData: number;
    monthViewData: number;
};

const StatCardComponent = memo(function StatCardComponent({
    card,
    isDraggable,
    onDragStart,
    onDragOver,
    onDrop,
}: {
    card: StatCard;
    isDraggable: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, id: string) => void;
}) {
    return (
        <div
            draggable={isDraggable}
            onDragStart={(e) => onDragStart(e, card.id)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, card.id)}
            className={`rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md ${
                isDraggable ? 'cursor-move hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600">{card.title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        <CountUpNumber number={card.value} isFloor={card.isFloor} speed={card.speed} />
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{card.unit}</p>
                </div>
                {card.icon}
            </div>
        </div>
    );
});

StatCardComponent.displayName = 'StatCardComponent';

export const StatsSection = memo(function StatsSection({
    onsecutiveDays,
    weekViewData,
    monthViewData,
}: StatsSectionProps) {
    const [isMobile, setIsMobile] = useState(true);
    const [cards, setCards] = useState<StatCard[]>([
        { id: 'consecutive', title: '連続日数', value: onsecutiveDays, unit: '日', icon: <FireIcon className="w-12 h-12 text-indigo-500" />, isFloor: false, speed: 'fast' },
        { id: 'week', title: '今週の学習時間', value: weekViewData, unit: '時間', icon: <ClockIcon className="w-12 h-12 text-sky-500" />, isFloor: true, speed: 'fast' },
        { id: 'month', title: '今月の学習時間', value: monthViewData, unit: '時間', icon: <ChartBarIcon className="w-12 h-12 text-emerald-500" />, isFloor: true, speed: 'slow' },
    ]);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    useEffect(() => {
        const savedOrder = localStorage.getItem('stats-card-order');
        if (savedOrder) {
            try {
                const order = JSON.parse(savedOrder);
                setCards(prev => {
                    const newCards = [...prev];
                    newCards.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                    return newCards;
                });
            } catch (error) {
                console.error('Failed to restore card order:', error);
            }
        }
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const dataCards = [
            { id: 'consecutive', value: onsecutiveDays },
            { id: 'week', value: weekViewData },
            { id: 'month', value: monthViewData },
        ];
        setCards(prev => prev.map(card => ({
            ...card,
            value: dataCards.find(d => d.id === card.id)?.value || card.value
        })));
    }, [onsecutiveDays, weekViewData, monthViewData]);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) {
            setDraggedId(null);
            return;
        }

        const newCards = [...cards];
        const draggedIndex = newCards.findIndex(c => c.id === draggedId);
        const targetIndex = newCards.findIndex(c => c.id === targetId);

        [newCards[draggedIndex], newCards[targetIndex]] = [newCards[targetIndex], newCards[draggedIndex]];

        setCards(newCards);
        localStorage.setItem('stats-card-order', JSON.stringify(newCards.map(c => c.id)));
        setDraggedId(null);
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
            {cards.map(card => (
                <StatCardComponent
                    key={card.id}
                    card={card}
                    isDraggable={!isMobile}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                />
            ))}
        </div>
    );
});

export const CategoryRatioSection = memo(function CategoryRatioSection({name, ratio, duration, color}:categoryRatioSectionData) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const widthValue = useTransform(motionValue, value => `${value}%`);

    useEffect(() => {
        if (isInView) {
            animate(motionValue, ratio, {
                duration: 1.5,
                ease: "circOut",
            });
        }
    }, [isInView, ratio, motionValue]);

    return(
        <>
            <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-slate-700">{name}</span>
                <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                        <CountUpNumber number={ratio} isFloor={false} speed="fast"/>%
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                        <CountUpNumber number={duration} isFloor={true} speed="slow"/>時間
                    </span>
                </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5" ref={ref}>
                <motion.div
                    className={`h-2.5 rounded-full`}
                    style={{ width: widthValue, background: `${color}` }}
                />
            </div>
        </>
    );
});

CategoryRatioSection.displayName = 'CategoryRatioSection';