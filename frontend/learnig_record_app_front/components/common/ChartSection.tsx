import { WeeklyChart } from "./WeeklyChart";

type ChartData = {
    date: string,
    duration: number,
}[];

type ChartSectionProps = {
    viewMode: 'week' | 'month';
    onViewModeChange: (mode: 'week' | 'month') => void;
    weekChartData: ChartData;
    monthChartData: ChartData;
};

export function ChartSection({
    viewMode,
    onViewModeChange,
    weekChartData,
    monthChartData,
}: ChartSectionProps) {
    return (
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {viewMode === 'week' ? '週間の学習時間' : '月間の学習時間'}
                </h2>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('week')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition cursor-pointer ${
                            viewMode === 'week'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        週間
                    </button>
                    <button
                        onClick={() => onViewModeChange('month')}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition cursor-pointer ${
                            viewMode === 'month'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        月間
                    </button>
                </div>
            </div>
            <WeeklyChart data={viewMode === 'week' ? weekChartData : monthChartData} />
        </div>
    );
}
