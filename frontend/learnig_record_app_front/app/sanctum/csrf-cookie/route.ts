import { NextRequest, NextResponse } from "next/server";

const laravelBase = process.env.LARAVEL_URL ?? "http://localhost:8080";

function appendSetCookies(from: Response, to: NextResponse) {
    const h = from.headers as Headers & { getSetCookie?: () => string[] };
    if (typeof h.getSetCookie === "function") {
        for (const c of h.getSetCookie()) {
            to.headers.append("Set-Cookie", c);
        }
        return;
    }
    const single = from.headers.get("Set-Cookie");
    if (single) {
        to.headers.append("Set-Cookie", single);
    }
}

export async function GET(req: NextRequest) {
    const url = `${laravelBase}/sanctum/csrf-cookie${req.nextUrl.search}`;
    let res: Response;
    try {
        res = await fetch(url, {
            method: "GET",
            headers: {
                cookie: req.headers.get("cookie") ?? "",
                accept: req.headers.get("accept") ?? "application/json",
            },
            cache: "no-store",
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json(
            { message: "Laravel へ接続できません", detail: msg, url },
            { status: 502 },
        );
    }

    // 204 にはボディを付けられない（Next / Response の制約）。Laravel の csrf-cookie は 204 を返す。
    const out =
        res.status === 204
            ? new NextResponse(null, { status: 204 })
            : new NextResponse(await res.arrayBuffer(), { status: res.status });
    const ct = res.headers.get("content-type");
    if (ct && res.status !== 204) {
        out.headers.set("content-type", ct);
    }
    appendSetCookies(res, out);
    return out;
}
