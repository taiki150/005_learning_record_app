import Link from 'next/link'


export default function userRegistPage(){
    return(
        <div className="min-w-xs w-md rounded-card border-inherit border-line bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] m-auto">

            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <h1 className="text-lg font-semibold text-ink">ユーザー登録</h1>
                <p className="mt-1 text-[13px] text-slate-500">必要事項を入力してアカウントを作成してください。</p>
            </div>

            <form className="space-y-5 px-6 py-6 sm:px-8 sm:py-7" action="#" method="post">

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">名前</label>
                    <input id="name" name="name" type="text" required placeholder="山田 太郎" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20" />
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">メールアドレス</label>
                    <input id="email" name="email" type="email" required placeholder="you@example.com" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20" />
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">誕生日</label>
                    <input id="birthday" name="birthday" type="date" required className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"/>
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">パスワード</label>
                    <input id="password" name="password" type="password" required placeholder="8文字以上" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"/>
                    <p className="mt-1.5 text-xs text-slate-500">英数字を組み合わせた強力なパスワードを推奨します。</p>
                </div>

                <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-ink">パスワード（確認）</label>
                    <input id="password_confirm" name="password_confirm" type="password" required placeholder="もう一度入力" className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"/>
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