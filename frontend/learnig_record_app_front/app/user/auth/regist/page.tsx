'use client';

import Link from 'next/link'
import { useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";

const debugFlg = false;

const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function UserRegistPage() {
    const router = useRouter();
    const [errors, setErrors] = useState<{
        birthday?: string[];
        email?: string[];
        name?: string[];
        password?: string[];
        password_confirmation?: string[];
    }>({});

    async function userCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        const fd = new FormData(form)

        const name = fd.get("name") as string;
        const email = fd.get("email") as string;
        const birthday = fd.get("birthday") as string;
        const password = fd.get("password") as string;
        const passwordConfirm = fd.get("password_confirm") as string;

        const payload = {
            name,
            email,
            birthday,
            password,
            password_confirmation: passwordConfirm,
        };

        const res = await fetch(`${apiBaseUrl}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        });

        const raw = await res.text();
        let data: { message?: string; errors?: {
                birthday?: string[];
                email?: string[];
                name?: string[];
                password?: string[];
                password_confirmation?: string[];},
             user?: { name?: string } } = {};
        try {
            data = raw ? JSON.parse(raw) : {};
        } catch {
            console.error("登録失敗: JSON でないレスポンス", res.status, raw.slice(0, 200));
            return;
        }

        if (!res.ok) {
            if(debugFlg){
                console.error("登録失敗ステータス:", res.status);
                console.error("Laravelからのメッセージ:", data?.message || "不明なエラー");
            }
            if(res.status === 422 && data?.errors){
                setErrors(data.errors);
            }
            return;
        }

        router.push("/user/auth/login?registered=1");
        
    }

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
                    <span className='inline-block ml-5'>ユーザー登録</span>
                    </h1>
                <p className="mt-1 text-[13px] text-slate-500">必要事項を入力してアカウントを作成してください。</p>
            </div>

            <form className="space-y-5 px-6 py-6 sm:px-8 sm:py-7" onSubmit={userCreateSubmit} method="POST">

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">名前</label>
                    <input id="name" name="name" type="text" placeholder="山田 太郎" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20" />
                    {errors.name?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">メールアドレス</label>
                    <input id="email" name="email" type="email" placeholder="you@example.com" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20" />
                    {errors.email?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">誕生日</label>
                    <input id="birthday" name="birthday" type="date" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"/>
                    {errors.birthday?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div className='mb-7'>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">パスワード</label>
                    <input id="password" name="password" type="password" placeholder="8文字以上" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"/>
                    <p className="mt-1.5 text-xs text-slate-500">英数字を組み合わせた強力なパスワードを推奨します。</p>
                    {errors.password?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">パスワード（確認）</label>
                    <input id="password_confirm" name="password_confirm" type="password" placeholder="もう一度入力" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"/>
                    {errors.password_confirmation?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div className="pt-1">
                    <button type="submit" className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        アカウントを作成
                    </button>
                </div>
            </form>

            <div className="border-t border-slate-100 px-6 py-4 text-center sm:px-8">
                <p className="text-[13px] text-slate-500">
                    すでにアカウントをお持ちですか？
                <Link href="/user/auth/login" className="font-semibold text-brand hover:underline text-indigo-500">
                    ログイン
                </Link>
                </p>
            </div>
        </div>
    );
}