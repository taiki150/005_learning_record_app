'use client'
import Link from 'next/link'
import Image from "next/image";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function readCookie(name: string): string | undefined {
    const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
    if (!row) return undefined;
    return decodeURIComponent(row.slice(name.length + 1));
}

export default function userLoginPage(){

    const [errors, setErrors] = useState<{
        email?: string[];
        password?: string[];
    }>({});
    

    async function userLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const fd = new FormData(form);
        const email = fd.get("email") as string;
        const password = fd.get("password") as string;

        const payload = {
            email,
            password,
        };

        console.log(`URL:${apiBaseUrl}`);

        // CSRF トークンを取得
        await fetch(`http://localhost:8080/sanctum/csrf-cookie`, {
            method: "GET",
            credentials: "include",
        });

        const xsrf = readCookie("XSRF-TOKEN");
        console.log('XSRF Token:', xsrf);
        const res = await fetch(`${apiBaseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(xsrf ? { "X-CSRF-TOKEN": xsrf } : {}),
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const raw = await res.text();
        let data: {
            message?: string;
            errors?:{email?: string[], password?: string[]},
            user?: { email?: string; id?: number }
        } = {};

            try {
                data = raw ? JSON.parse(raw) : {};
            } catch {
                console.error("ログイン失敗: JSON でないレスポンス", res.status, raw.slice(0, 200));
                return;
            }

        if(!res.ok){
            if(res.status === 422 && data?.errors){
                setErrors(data.errors);
            }
            return;
        }

        router.push("/user/contents/dashboard");

    }

    const router = useRouter();
    const searchParams = useSearchParams();
    const toastDisplayFlg = useRef(false);

    useEffect(() => {
        if(searchParams.get("registered") === "1" && !toastDisplayFlg.current){
            toastDisplayFlg.current = true;
            toast.success("登録が完了しました！ログインしてください。");

            router.replace("/user/auth/login");
        }
    }, [router, searchParams]);

    return(
        <div className="min-w-xs w-md rounded-card border-inherit border-line bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] m-auto">

            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <h1 className="text-lg font-semibold text-ink flex justify-center items-center mb-3">
                    <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200/80 shadow-sm">
                    <Image
                        src="/contents/app_logo.png"
                        alt="アプリロゴ"
                        width={44}
                        height={44}
                        className="object-contain p-1.5"
                        priority
                    />
                </div>
                    <span className='inline-block ml-5'>ログイン</span>
                    </h1>
                <p className="mt-1 text-[13px] text-slate-500">認証に必要な項目を入力してログインを進めてください</p>
            </div>

            <form className="space-y-5 px-6 py-6 sm:px-8 sm:py-7" onSubmit={userLoginSubmit} method="post">

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">メールアドレス</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20" />
                    {errors.email?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">パスワード</label>
                    <input id="password" name="password" type="password" placeholder="パスワードを入力" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"/>
                    {errors.password?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div className="pt-1">
                    <button type="submit" className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        ログイン
                    </button>
                </div>
            </form>

            <div className="border-t border-slate-100 px-6 py-4 text-center sm:px-8">
                <p className="text-[13px] text-slate-500">
                    アカウントをお持ちでない方は
                <Link href="/user/auth/regist" className="font-semibold text-brand hover:underline text-indigo-500">
                    新規登録
                </Link>
                </p>
            </div>
        </div>
    );
}