"use client";

import LyricLegendsGame from "@/components/games/LyricLegends";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LyricLegendsContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <main>
      <LyricLegendsGame mode={mode as "local" | "online"} />
    </main>
  );
}

export default function LyricLegendsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LyricLegendsContent />
    </Suspense>
  );
}

