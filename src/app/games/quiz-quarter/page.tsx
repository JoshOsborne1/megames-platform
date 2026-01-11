"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuizQuarterHub } from "@/components/games/quiz-quarter/QuizQuarterHub";
import { AppShell } from "@/components/AppShell";

function QuizQuarterContent() {
    const searchParams = useSearchParams();
    const mode = (searchParams.get("mode") as "local" | "online") ?? "local";

    return (
        <AppShell>
            <QuizQuarterHub mode={mode} />
        </AppShell>
    );
}

export default function QuizQuarterPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60">Loading Quiz Quarter...</p>
                    </div>
                </div>
            }
        >
            <QuizQuarterContent />
        </Suspense>
    );
}
