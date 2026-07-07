import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";


export function useAuth() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        fetch(`${apiBaseUrl}/user`, {
            method: "GET",
            credentials: "include",
        })
            .then(res => {
                if(res.status === 401){
                    router.push('/user/auth/login');
                    return;
                }
                setIsChecking(false);

                if(res.status === 200){
                    // session有効 => 何もしない
                }
            })
            .catch(error => {
                console.error('セッション確認エラー:', error)
                setIsChecking(false);
            });
    }, [router]);

    return isChecking;
}