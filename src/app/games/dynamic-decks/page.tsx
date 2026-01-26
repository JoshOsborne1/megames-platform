"use client";

import { DynamicDecksHub } from "@/components/games/dynamic-decks/DynamicDecksHub";
import { AppShell } from "@/components/AppShell";
import { GameErrorBoundary } from "@/components/games/shared";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DynamicDecksContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <AppShell>
      <GameErrorBoundary gameName="Dynamic Decks" fallbackUrl="/games">
        <div className="text-white flex flex-col font-space overflow-hidden select-none relative touch-manipulation">
          <DynamicDecksHub mode={mode as "local" | "online"} />
        </div>
      </GameErrorBoundary>
    </AppShell>
  );
}

export default function DynamicDecksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <DynamicDecksContent />
    </Suspense>
  );
}
