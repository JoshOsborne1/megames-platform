"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { QuizProBanner } from "@/components/QuizProBanner";
import { AuthModal } from "@/components/AuthModal";
import { GamePreviewModal } from "@/components/GamePreviewModal";
import {
  Wifi, User, ChevronRight, Zap, Crown, Globe, Gamepad2, Smartphone, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHaptic } from "@/hooks/useHaptic";
import { GAMES, GameConfig } from "@/config/games";

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const { trigger } = useHaptic();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) {
        supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setIsPro(data?.is_pro || false);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleGameSelect = (game: GameConfig) => {
    trigger();
    setSelectedGame(game);
  };

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Player";

  // Categorize games from config
  const featuredGames = GAMES.filter(g => g.isHot);
  const moreGames = GAMES.filter(g => !g.isHot);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">

        {/* HEADER - Clean, minimal */}
        <header className="text-center mb-6">
          <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Megames</h1>
          <p className="text-xs text-white/50 font-medium">Your Party Game Hub</p>
        </header>

        {/* FEATURED SECTION - Above play buttons */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-1">Featured</h3>
          {featuredGames.map(game => (
            <motion.div
              key={game.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameSelect(game)}
              className="widget-card !p-0 h-48 group overflow-visible"
              style={{
                borderColor: `${game.color}50`,
                boxShadow: `0 0 40px ${game.color}20`
              }}
            >
              {/* Background Gradient */}
              <div
                className="absolute inset-0 opacity-30 transition-opacity group-hover:opacity-40"
                style={{ background: `linear-gradient(135deg, ${game.color}40, transparent 60%)` }}
              />
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

              <div className="relative z-10 h-full p-5 flex flex-col justify-end">
                <div
                  className="absolute top-4 right-4 text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse"
                  style={{ backgroundColor: game.color, boxShadow: `0 0 25px ${game.color}60` }}
                >
                  HOT 🔥
                </div>

                <div
                  className="absolute top-5 left-5 p-3 rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                  style={{
                    backgroundColor: `${game.color}20`,
                    boxShadow: `0 0 30px ${game.color}50`
                  }}
                >
                  <game.icon
                    className="w-10 h-10"
                    style={{
                      color: game.color,
                      filter: `drop-shadow(0 0 10px ${game.color})`
                    }}
                  />
                </div>

                <div>
                  <h4
                    className="font-display font-bold text-2xl text-white mb-1"
                    style={{ textShadow: `0 0 20px ${game.color}40` }}
                  >
                    {game.name}
                  </h4>
                  <p className="text-xs text-white/70 line-clamp-1">{game.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* PLAY MODE GRID - Online & Local */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* ONLINE WIDGET */}
          <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={() => user ? router.push("/multiplayer") : openAuth("signup")}
            className="widget-card aspect-square flex flex-col justify-between bg-gradient-to-br from-[#8338ec]/20 to-[#8338ec]/5 border-[#8338ec]/30 group"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-[#8338ec]/20 text-[#8338ec]">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight mb-1">Online<br />Lobby</h3>
              <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Multiplayer</p>
            </div>
          </motion.div>

          {/* LOCAL WIDGET */}
          <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/games?mode=local")}
            className="widget-card aspect-square flex flex-col justify-between bg-gradient-to-br from-[#ff006e]/20 to-[#ff006e]/5 border-[#ff006e]/30 group"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-[#ff006e]/20 text-[#ff006e]">
                <Gamepad2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight mb-1">Play<br />Local</h3>
              <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Single Device</p>
            </div>
          </motion.div>
        </div>

        {/* MORE GAMES LIST */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">More Games</h3>
            <Link href="/games" className="text-[10px] font-bold text-[#8338ec] uppercase tracking-wider hover:text-white transition-colors">View All</Link>
          </div>

          <div className="space-y-3">
            {moreGames.map(game => (
              <motion.div
                key={game.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGameSelect(game)}
                className="widget-card !p-3.5 flex items-center justify-between group"
                style={{
                  borderColor: `${game.color}40`,
                  background: `linear-gradient(135deg, ${game.color}08, transparent 50%)`,
                  boxShadow: `0 0 20px ${game.color}10`
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${game.color}20`,
                      boxShadow: `0 0 15px ${game.color}30`,
                      border: `1px solid ${game.color}25`
                    }}
                  >
                    <game.icon
                      className="w-5 h-5"
                      style={{
                        color: game.color,
                        filter: `drop-shadow(0 0 6px ${game.color})`
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{game.name}</h4>
                    <p className="text-[10px] text-white/40">{game.description}</p>
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 transition-colors"
                  style={{ color: `${game.color}60` }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {!isPro && (
          <div className="pb-10">
            <QuizProBanner compact onSubscribeClick={() => { }} />
          </div>
        )}

        {/* MODALS */}
        <GamePreviewModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          onPlayLocal={() => selectedGame && router.push(`${selectedGame.route}?mode=local`)}
          onPlayOnline={() => selectedGame && (user ? router.push(`/multiplayer?game=${selectedGame.id}`) : openAuth("signup"))}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    </AppShell>
  );
}
