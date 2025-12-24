"use client";

import { DynamicDecksHub } from "@/components/games/dynamic-decks/DynamicDecksHub";

export default function DynamicDecksPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col p-4 font-space overflow-hidden select-none relative">
      <DynamicDecksHub />
    </div>
  );
}
