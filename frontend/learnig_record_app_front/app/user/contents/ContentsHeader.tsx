"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import { apiWrapper } from '@/utils/api';

const linkBase =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";


function navItemClass(active: boolean) {
    return active
        ? `${linkBase} bg-slate-900 text-white shadow-md shadow-slate-900/20`
        : `${linkBase} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
}

function isPathActive(pathname: string, href: string) {
    if (href === "/user/contents/dashboard") {
        return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function ContentsHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const isConfirmed = window.confirm('ログアウトしますか？');
        if (!isConfirmed) { return; }

        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
            const response = await apiWrapper(`${apiBaseUrl}/logout`, {
                method: "POST",
            });
            if (response.ok) {
                router.push('/user/auth/login');
            }
        } catch (error) {
            console.error('ログアウトエラー:', error);
        }
    }

    return (
        <header className="mb-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-4 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5">
                <Link
                    href="/user/contents/dashboard"
                    className="group flex shrink-0 items-center gap-3 rounded-xl p-1 -m-1 transition-opacity hover:opacity-90"
                >
                    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200/80 shadow-sm">
                        <Image
                            src="/contents/app_logo.png"
                            alt="アプリロゴ"
                            width={44}
                            height={44}
                            className="object-contain p-1.5"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-semibold tracking-tight text-slate-900">
                            SIStack
                        </span>
                        <span className="hidden text-xs text-slate-500 sm:block">
                            学習記録アプリ
                        </span>
                    </div>
                </Link>

                <nav
                    className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0 sm:pl-2"
                    aria-label="メイン"
                >
                    <Link
                        href="/user/contents/dashboard"
                        className={navItemClass(
                            isPathActive(pathname, "/user/contents/dashboard"),
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/user/contents/records"
                        className={navItemClass(
                            isPathActive(pathname, "/user/contents/records"),
                        )}
                    >
                        Record
                    </Link>

                    <Link
                        href="/user/contents/records"
                        className={navItemClass(
                            isPathActive(pathname, "/user/contents/setting"),
                        ) + " group"}
                    >
                        setting
                        <svg 
                            className="ml-1 transition-transform duration-300 group-hover:rotate-90"
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            aria-hidden="true"
                        >
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </Link>

                    <span
                        className="mx-0.5 hidden h-6 w-px shrink-0 bg-slate-200 sm:block"
                        aria-hidden
                    />

                    <button
                        type="button"
                        onClick={handleLogout} 
                        className={`${linkBase} text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer`}
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}
