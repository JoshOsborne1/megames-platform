"use client";

import { useState, useEffect, Suspense } from "react";

import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Trophy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { GAMES, GameConfig } from "@/config/games";
import { GamePreviewModal } from "@/components/GamePreviewModal";
import { AuthModal } from "@/components/AuthModal";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useHaptic } from "@/hooks/useHaptic";
import { QuizProBanner } from "@/components/QuizProBanner";

function GamesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "local" or "online" from home page
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { trigger } = useHaptic();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleGameSelect = (game: GameConfig) => {
    trigger();

    // If user came from "Play Local" on home page, skip modal and go directly
    if (mode === "local") {
      router.push(`${game.route}?mode=local`);
      return;
    }

    // Otherwise show the modal for selection
    setSelectedGame(game);
  };

  return (
    <AppShell>
      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
        {/* HEADER - Centered, no icon */}
        <header className="text-center mb-6">
          <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Arcade</h1>
          <p className="text-xs text-white/50 font-medium">
            {mode === "local" ? "Select a game to play locally" : "All Games"}
          </p>
        </header>

        {/* GAMES GRID */}
        <div className="grid grid-cols-1 gap-4">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameSelect(game)}
              className="widget-card !p-4 flex items-center gap-3 group"
              style={{
                borderColor: `${game.color}40`,
                background: `linear-gradient(135deg, ${game.color}08, transparent 60%)`
              }}
            >
              {/* Icon Container - reduced glow */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${game.color}15`,
                  border: `1px solid ${game.color}20`
                }}
              >
                <game.icon
                  className="w-7 h-7"
                  style={{ color: game.color }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg text-white mb-0.5 truncate">
                  {game.name}
                </h3>
                <p className="text-[11px] text-white/50 font-medium line-clamp-1">
                  {game.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <motion.div
                whileHover={{ x: 5 }}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/5"
              >
                <Trophy
                  className="w-4 h-4 text-white/30"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* COMING SOON */}
        <div className="mt-8 mb-8 text-center">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">More Games Coming Soon</p>
        </div>

        {/* PRO BANNER */}
        <div className="mb-8">
          <QuizProBanner compact onSubscribeClick={() => { }} />
        </div>

        {/* MODALS */}
        <GamePreviewModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          onPlayLocal={() => selectedGame && router.push(`${selectedGame.route}?mode=local`)}
          onPlayOnline={() => selectedGame && (user ? router.push(`${selectedGame.route}?mode=online`) : setShowAuthModal(true))}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signup"
        />
      </div>
    </AppShell>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center text-white">Loading Arcade...</div>}>
      <GamesContent />
    </Suspense>
  );
}
