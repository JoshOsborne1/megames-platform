"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { GAMES, GameConfig } from "@/config/games";
import { useHaptic } from "@/hooks/useHaptic";
import { QuizProBanner } from "@/components/QuizProBanner";

function GamesContent() {
  const router = useRouter();
  const { trigger } = useHaptic();



  const handleGameSelect = (game: GameConfig) => {
    trigger();
    // Go directly to the game in local mode
    router.push(`${game.route}?mode=local`);
  };

  return (
    <AppShell>
      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
        {/* HEADER - Centered, no icon */}
        <header className="text-center mb-6">
          <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Arcade</h1>
          <p className="text-xs text-white/50 font-medium">
            Select a game to play
          </p>
        </header>

        {/* GAMES GRID */}
        <div className="grid grid-cols-1 gap-3">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameSelect(game)}
              className="widget-card p-3! flex items-center gap-3 group rounded-2xl!"
              style={{
                borderColor: `${game.color}40`,
                background: `linear-gradient(135deg, ${game.color}08, transparent 60%)`
              }}
            >
              {/* Icon Container */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${game.color}15`,
                  border: `1px solid ${game.color}20`
                }}
              >
                <game.icon
                  className="w-6 h-6"
                  style={{ color: game.color }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-white truncate">
                    {game.name}
                  </h3>
                  {game.isHot && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-linear-to-r from-orange-500 to-red-500 text-white">
                      New
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50 font-medium line-clamp-1">
                  {game.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/5">
                <ChevronRight className="w-4 h-4 text-white/30" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* COMING SOON */}
        <div className="mt-8 mb-8 text-center">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">More Games Coming Soon</p>
        </div>

        {/* PRO BANNER */}
        <div className="mb-8">
          <QuizProBanner compact />
        </div>
      </div>
    </AppShell>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Arcade...</div>}>
      <GamesContent />
    </Suspense>
  );
}

