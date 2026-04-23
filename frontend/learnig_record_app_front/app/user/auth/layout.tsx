import { Children } from "react";
import Link from 'next/link'


export default function Layout({ children }: Readonly<{children: React.ReactNode;}>) 
{
    return (
        <div className="bg-[rgb(241,245,249)] min-h-screen text-center flex items-center justify-center">
            <main className="">
                { children }
            </main>
        </div>
    );
}