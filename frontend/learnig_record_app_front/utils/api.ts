'use client'

export async function apiWrapper(
    url: string,
    options?: RequestInit,
): Promise<Response>{
    const xsrfToken = readCookie('XSRF-TOKEN');
    const response = await fetch(url, {
        ...options,
         headers: {
        ...options?.headers,
        ...(xsrfToken ? { 'X-CSRF-TOKEN': xsrfToken } : {}),
    },
        credentials: 'include',
    });
    if(response.status === 401){
        window.location.href = '/user/auth/login';   
        return response;
    }

    return response;
};

function readCookie(name: string): string | undefined {
    const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
    if(!row) { return undefined; }
    return decodeURIComponent(row.slice(name.length + 1));
}
