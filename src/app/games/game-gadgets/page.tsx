"use client";

import { AppShell } from "@/components/AppShell";
import { GameGadgetsHub } from "@/components/games/game-gadgets/GameGadgetsHub";
import { Suspense } from "react";

function GameGadgetsContent() {
  return (
    <AppShell>
      <GameGadgetsHub />
    </AppShell>
  );
}

export default function GameGadgetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <GameGadgetsContent />
    </Suspense>
  );
}
