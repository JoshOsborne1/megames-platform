"use client";

import dynamic from "next/dynamic";
import { AppShell } from "@/components/AppShell";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Lazy load the heavy game component
const LyricLegendsGame = dynamic(
  () => import("@/components/games/LyricLegends").then((mod) => mod.default),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#FF00FF] rounded-full animate-spin" />
          <p className="text-sm text-white/60">Loading Lyric Legends...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

function LyricLegendsContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <AppShell>
      <LyricLegendsGame mode={mode as "local" | "online"} />
    </AppShell>
  );
}

export default function LyricLegendsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#FF00FF] rounded-full animate-spin" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <LyricLegendsContent />
    </Suspense>
  );
}
