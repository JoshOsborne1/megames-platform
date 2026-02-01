"use client";

import dynamic from "next/dynamic";
import { AppShell } from "@/components/AppShell";
import { Suspense } from "react";

// Lazy load the heavy game component - this splits it into a separate chunk
const ShadeSignalsGame = dynamic(
  () => import("@/components/games/shade-signals/ShadeSignalsGame").then((mod) => mod.ShadeSignalsGame),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#00FFFF] rounded-full animate-spin" />
          <p className="text-sm text-white/60">Loading Shade Signals...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function ShadeSignalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#00FFFF] rounded-full animate-spin" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <AppShell>
        <ShadeSignalsGame />
      </AppShell>
    </Suspense>
  );
}
