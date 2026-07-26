type ChartData = {
    date: string,
    duration: number,
}[];

type MonthlyChartProps = {
    data: ChartData;
};

export function MonthlyChart({ data }: MonthlyChartProps) {
    return (
        <div className="w-full h-80 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
            <p className="text-slate-500">月間グラフは製作中</p>
        </div>
    );
}
