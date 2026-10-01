'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { apiWrapper } from "@/utils/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function CompleteProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        birthday?: string[];
    }>({});

    async function completeProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const form = event.currentTarget;
        const fd = new FormData(form);
        const birthday = fd.get("birthday") as string;

        const payload = {
            birthday,
        };

        try {
            const res = await apiWrapper(`${apiBaseUrl}/user/complete-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 422 && data?.errors) {
                    setErrors(data.errors);
                }
                toast.error(data?.message || "プロフィール更新に失敗しました");
                return;
            }

            toast.success("プロフィールを更新しました");
            router.push("/user/contents/dashboard");
        } catch (error) {
            console.error("プロフィール更新エラー:", error);
            toast.error("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    }

    return (
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
                    <span className='inline-block ml-5'>プロフィール完成</span>
                </h1>
                <p className="mt-1 text-[13px] text-slate-500">生年月日を入力してプロフィールを完成させてください</p>
            </div>

            <form className="space-y-5 px-6 py-6 sm:px-8 sm:py-7" onSubmit={completeProfileSubmit}>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">誕生日</label>
                    <input
                        id="birthday"
                        name="birthday"
                        type="date"
                        required
                        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    {errors.birthday?.map((msg, i) => <p key={i} className="mt-1.5 text-xs text-red-500">{msg}</p>)}
                </div>

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        {isLoading ? "更新中..." : "プロフィールを完成"}
                    </button>
                </div>
            </form>
        </div>
    );
}
