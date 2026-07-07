'use client';

import React from "react";
import { ContentsHeader } from "./ContentsHeader";
import { useAuth } from '@/hooks/useAuth';

export default function ContentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isChecking = useAuth();
    if (isChecking) {
        return null;
    }

    return (
        <section className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50/60 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-6xl">
                <ContentsHeader />
                <main>{children}</main>
                <footer />
            </div>
        </section>
    );
}