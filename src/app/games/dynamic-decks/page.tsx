"use client";

import dynamic from "next/dynamic";
import { AppShell } from "@/components/AppShell";
import { GameErrorBoundary } from "@/components/games/shared";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Lazy load the heavy game component
const DynamicDecksHub = dynamic(
  () => import("@/components/games/dynamic-decks/DynamicDecksHub").then((mod) => mod.DynamicDecksHub),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/60">Loading Dynamic Decks...</p>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for better performance
  }
);

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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <DynamicDecksContent />
    </Suspense>
  );
}
