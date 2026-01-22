"use client";

import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { GAMES } from "@/config/games";
import { useHaptic } from "@/hooks/useHaptic";
import { ChevronRight, Loader2 } from "lucide-react";

function LobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trigger } = useHaptic();
  
  const mode = searchParams.get("mode");

  // If not local mode, redirect to multiplayer
  useEffect(() => {
    if (mode !== "local") {
      router.replace("/multiplayer");
    }
  }, [mode, router]);

  // Show loading state while redirecting
  if (mode !== "local") {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AppShell>
    );
  }

  // Local mode: show games list for local play
  return (
    <AppShell>
      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Arcade</h1>
          <p className="text-xs text-white/50 font-medium">
            Select a game to play locally
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                trigger();
                router.push(`${game.route}?mode=local`);
              }}
              className="widget-card p-3! flex items-center gap-3 group rounded-2xl!"
              style={{
                borderColor: `${game.color}40`,
                background: `linear-gradient(135deg, ${game.color}08, transparent 60%)`
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${game.color}15`,
                  border: `1px solid ${game.color}20`
                }}
              >
                <game.icon className="w-6 h-6" style={{ color: game.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base text-white truncate">
                  {game.name}
                </h3>
                <p className="text-[11px] text-white/50 font-medium line-clamp-1">
                  {game.description}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/5">
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LobbyContent />
    </Suspense>
  );
}
