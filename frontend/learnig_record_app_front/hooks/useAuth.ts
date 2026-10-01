import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";


export function useAuth() {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        fetch(`${apiBaseUrl}/user`, {
            method: "GET",
            credentials: "include",
        })
            .then(async res => {
                if(res.status === 401){
                    router.push('/user/auth/login');
                    return;
                }

                if(res.status === 200){
                    const data = await res.json();
                    // birthday が未設定で、かつ complete-profile ページでなければリダイレクト
                    if (data.user?.birthday === null && pathname !== '/user/auth/complete-profile') {
                        router.push('/user/auth/complete-profile');
                        return;
                    }
                }

                setIsChecking(false);
            })
            .catch(error => {
                console.error('セッション確認エラー:', error)
                setIsChecking(false);
            });
    }, [router, pathname]);

    return isChecking;
}