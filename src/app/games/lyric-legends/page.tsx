"use client";

import LyricLegendsGame from "@/components/games/LyricLegends";
import { useSearchParams } from "next/navigation";

export default function LyricLegendsPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <main className="bg-[#0f0a1e]">
      <LyricLegendsGame mode={mode as "local" | "online"} />
    </main>
  );
}
