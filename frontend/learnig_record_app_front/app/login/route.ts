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

export async function POST(req: NextRequest) {
    const url = `${laravelBase}/login`;
    const body = await req.arrayBuffer();
    let res: Response;
    try {
        res = await fetch(url, {
            method: "POST",
            headers: {
                cookie: req.headers.get("cookie") ?? "",
                "content-type": req.headers.get("content-type") ?? "application/json",
                accept: req.headers.get("accept") ?? "application/json",
                "x-csrf-token": req.headers.get("x-csrf-token") ?? "",
            },
            body: body.byteLength ? body : undefined,
            cache: "no-store",
        });
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json(
            { message: "Laravel へ接続できません", detail: msg, url },
            { status: 502 },
        );
    }

    const out = new NextResponse(await res.arrayBuffer(), { status: res.status });
    const ct = res.headers.get("content-type");
    if (ct) {
        out.headers.set("content-type", ct);
    }
    appendSetCookies(res, out);
    return out;
}
