import { useState, useEffect } from "react";
import { apiWrapper } from '@/utils/api';


const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type grafhPeriod = {
    start_date:string,
    end_date:string,
}

export async function GrafhApi(date:grafhPeriod) {
    const res = await apiWrapper(`${apiBaseUrl}/data/record`, {
        method: 'POST',
        body: JSON.stringify(date)
    })
    
    return await res.json();
}
