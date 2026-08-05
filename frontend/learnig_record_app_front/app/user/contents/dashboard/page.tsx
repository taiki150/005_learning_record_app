"use client"
import { GrafhApi, ConsecutiveApi, CategoryRatio } from "../../../../components/api/GrafhApi";
import { ChartSection } from "../../../../components/common/ChartSection";
import { StatsSection, CategoryRatioSection } from "../../../../components/common/StatsSection";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';

type RecordData = {
    recordData: {
        id?: string,
        learning_record_details?:{
            category_id?:string,
            created_at?:Date,
            deuration?:number,
            id?:string,
            learning_record_id?:string,
            ratio?:number,
            updated_at?:Date,
        }
        memo?:string,
        study_date: string,
        total_duration: number,
        updated_at?:Date
        user_id?:string,

    }[],
};

type ChartData = {
    date: string,
    duration: number,
}[];

type CategoryData = {
    name: string;
    ratio: number;
    duration: number;
    color: string;
}[];


const now:string = dayjs().format('YYYY-MM-DD');
const startOfThisWeek: string = dayjs().startOf('week').format('YYYY-MM-DD');
const endOfThisWeek: string = dayjs().startOf('week').add(6, 'days').format('YYYY-MM-DD');

const startOfThisMonth: string = dayjs().startOf('month').format('YYYY-MM-DD');
const endOfThisMonth: string = dayjs().endOf('month').format('YYYY-MM-DD');


export default function DashboardPage() {
    const [weekData, setWeekData] = useState<RecordData>();
    const [monthData, setMonthData] = useState<RecordData>();
    const [onsecutiveDays, setConsecutiveDays] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [weekViewData, setWeekViewData] = useState<number>(0);
    const [monthViewData, setMonthViewData] = useState<number>(0);
    const [weekChartData, setWeekChartData] = useState<ChartData>([]);
    const [monthChartData, setMonthChartData] = useState<ChartData>([]);
    const [categoryRatio, setCategoryRatio] = useState<CategoryData>([]);

    // 初期状態のデータ取得
    useEffect(() => {
        Promise.all([
            GrafhApi({ start_date: startOfThisWeek, end_date: endOfThisWeek }),
            GrafhApi({ start_date: startOfThisMonth, end_date: endOfThisMonth }),
            ConsecutiveApi(now),
            CategoryRatio({ start_date: startOfThisWeek, end_date: endOfThisWeek }),
            
        ])
        .then(([week, month, onsecutiveDays, categoryDatas]) => {
            setWeekData(week);
            setMonthData(month);
            setConsecutiveDays(onsecutiveDays.onsecutiveDays);
            setCategoryRatio(categoryDatas);
        })
        .catch((err) => {
            console.log("通信エラーが発生しました:", err);
        });
    }, []);

    // 初期状態の取得データ加工
    useEffect(() => {
        let weekTime = 0;
        let monthTime = 0;
        weekData?.recordData.map((data) => {
            weekTime = weekTime + data.total_duration;
        })
        monthData?.recordData.map((data) => {
            monthTime = monthTime + data.total_duration;
        })

        weekTime = (weekTime/60);
        monthTime = monthTime/60;
        
        setWeekViewData(Math.round(weekTime * 10) / 10);
        setMonthViewData(Math.round(monthTime * 10) / 10);        
    }, [weekData, monthData]);


    // 週間チャート表示するための処理
    useEffect(() => {
        const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

        const recordDatas = weekData?.recordData;
        if (!recordDatas) {
            setWeekChartData([]);
            return;
        }

        const newData: ChartData = weekDays.map((day, index) => {
            const matchedRecord = recordDatas.find((recordData) => {
                const dateObj = new Date(recordData.study_date);
                return dateObj.getDay() === index;
            });
            const duration = matchedRecord ? matchedRecord.total_duration / 60 : 0;

            return {
                date: day,
                duration: duration,
            };
        });

        setWeekChartData(newData);
    }, [weekData]);

    // 月間チャート表示するための処理
    useEffect(() => {
        const recordDatas = monthData?.recordData;
        if (!recordDatas || recordDatas.length === 0) {
            setMonthChartData([]);
            return;
        }

        const dataMap = new Map<string, number>();
        recordDatas.forEach((record) => {
            const date = record.study_date;
            const duration = record.total_duration / 60;
            dataMap.set(date, (dataMap.get(date) ?? 0) + duration);
        });

        const newData: ChartData = Array.from(dataMap).map(([date, duration]) => ({
            date: dayjs(date).format('M/D'),
            duration: duration,
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setMonthChartData(newData);
    }, [monthData]);


    useEffect(() => {
        console.log(categoryRatio);
    }), [categoryRatio];
    
    return (
        <section className="">
            <div className="mx-auto max-w-3xl">
                <StatsSection
                    onsecutiveDays={onsecutiveDays}
                    weekViewData={weekViewData}
                    monthViewData={monthViewData}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ChartSection
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        weekChartData={weekChartData}
                        monthChartData={monthChartData}
                    />

                    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md">
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold text-slate-900 mb-2">カテゴリ別の時間配分</h2>
                          <p className="text-sm text-slate-600">今週の合計: 
                            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                                {weekViewData}時間
                            </span>
                        </p>
                        </div>
                        <div className="space-y-4">
                        {categoryRatio.filter((data) => data.ratio > 0).map((data, index) => (
                            <div key={index} className="space-y-2">
                                <CategoryRatioSection name={data.name} ratio={data.ratio} duration={Math.round((data.duration)/60 * 10) / 10} color={data.color} />
                            </div>
                        ))}
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
