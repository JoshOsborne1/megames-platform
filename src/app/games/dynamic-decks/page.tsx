"use client";

import { DynamicDecksHub } from "@/components/games/dynamic-decks/DynamicDecksHub";
import { useSearchParams } from "next/navigation";

export default function DynamicDecksPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col p-4 font-space overflow-hidden select-none relative">
      <DynamicDecksHub mode={mode as "local" | "online"} />
    </div>
  );
}
