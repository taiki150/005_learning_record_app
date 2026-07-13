"use client"
import { GrafhApi, grafhPeriod } from "../../../../components/api/GrafhApi";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { log } from "console";

const now = dayjs().format('YYYY-MM-DD');
const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYY-MM-DD');

const firstValue: grafhPeriod = 
{
    start_date:oneMonthAgo,
    end_date:now,
}

export default function dashboardPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<grafhPeriod>(firstValue);
    const [getGrafhData, setGetGrafhData] = useState();
    useEffect(() => {

        GrafhApi(selectedPeriod)
        .then(data => {
            setGetGrafhData(data);
            // console.log("通信成功！バックエンドから届いたデータ:", data);
        })
        .catch((err) => {
            console.log("通信エラーが発生しました:", err);
        });
    }, []);

    console.log(getGrafhData);
    

    
    return (
        <>
            <h1>top</h1>
            <form action="">
                <input type="radio" name="period" value="1"/>
                <input type="radio" name="period" value="2"/>
                <input type="radio" name="period" value="3"/>
                <button >絞り込む</button>
            </form>
        </>
    );   
}