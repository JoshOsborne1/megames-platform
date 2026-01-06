"use client";

import LyricLegendsGame from "@/components/games/LyricLegends";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LyricLegendsContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <main className="bg-[#0f0a1e]">
      <LyricLegendsGame mode={mode as "local" | "online"} />
    </main>
  );
}

export default function LyricLegendsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center text-white">Loading...</div>}>
      <LyricLegendsContent />
    </Suspense>
  );
}
