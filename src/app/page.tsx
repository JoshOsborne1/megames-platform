"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { QuizProBanner } from "@/components/QuizProBanner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { DailyQuizWidget } from "@/components/DailyQuiz";
import {
  Users, ChevronRight, Globe, Gamepad2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHaptic } from "@/hooks/useHaptic";
import { GAMES, GameConfig } from "@/config/games";

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isPro, setIsPro] = useState(false);
  const { trigger } = useHaptic();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then((response: { data: { user: SupabaseUser | null } }) => {
      const user = response.data.user;
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", user.id)
          .single()
          .single()
          .then(({ data }: { data: { is_pro: boolean } | null }) => {
            setIsPro(data?.is_pro || false);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);



  const handleGameSelect = (game: GameConfig) => {
    trigger();
    // Go directly to the game in local mode
    router.push(`${game.route}?mode=local`);
  };



  // Categorize games from config
  const featuredGames = GAMES.filter(g => g.isHot);
  const moreGames = GAMES.filter(g => !g.isHot);



  return (
    <AppShell>
      {/* Install Prompt for non-PWA users */}
      <InstallPrompt />

      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">



        {/* FEATURED SECTION - Above play buttons */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 px-1">Featured</h3>
          {featuredGames.map(game => (
            <motion.div
              key={game.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGameSelect(game)}
              className="widget-card p-0! h-48 group overflow-visible"
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
                  {game.slogan && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 shadow-black drop-shadow-md mb-1 block">
                      {game.slogan}
                    </span>
                  )}
                  <p className="text-xs text-white/70 line-clamp-1">{game.description}</p>

                  {/* Player Count - Bottom Right Absolute */}
                  <div className="absolute bottom-5 right-5">
                    <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1 backdrop-blur-md border border-white/10 shadow-lg">
                      <Users className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white">{game.playerCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DAILY QUIZ WIDGET */}
        <div className="mb-6">
          <DailyQuizWidget />
        </div>

        {/* PLAY MODE GRID - Online & Local */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* ONLINE WIDGET */}
          <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={() => user ? router.push("/multiplayer") : router.push("/login")}
            className="widget-card aspect-square flex flex-col justify-between bg-linear-to-br from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 group"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple">
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
            onClick={() => router.push("/lobby?mode=local")}
            className="widget-card aspect-square flex flex-col justify-between bg-linear-to-br from-neon-pink/20 to-neon-pink/5 border-neon-pink/30 group"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-neon-pink/20 text-neon-pink">
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
            <Link href="/lobby" className="text-[10px] font-bold text-neon-purple uppercase tracking-wider hover:text-white transition-colors">View All</Link>
          </div>
          <div className="space-y-3">
            {moreGames.map(game => (
              <motion.div
                key={game.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGameSelect(game)}
                className="widget-card p-3.5! flex items-center justify-between group"
                style={{
                  borderColor: `${game.color}40`,
                  background: `linear-gradient(135deg, ${game.color}08, transparent 50%)`,
                  boxShadow: `0 0 20px ${game.color}10`
                }}
              >
                <div className="flex items-center gap-3 w-full">
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
                  <div className="flex-1 min-w-0 mr-2">
                    <h4 className="font-bold text-sm text-white mb-0.5">{game.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 line-clamp-1 truncate">
                        {game.slogan && (
                          <span className="font-bold uppercase text-[9px] mr-1.5 tracking-wide" style={{ color: game.color }}>
                            {game.slogan}
                          </span>
                        )}
                        {game.description}
                      </span>
                    </div>
                  </div>

                  {/* Player Count - Right Side */}
                  <div className="flex items-center gap-1 text-[10px] text-white/60 bg-white/5 px-2 py-1 rounded-lg border border-white/5 shrink-0">
                    <span>{game.playerCount}</span>
                    <Users className="w-3 h-3" />
                  </div>

                  <ChevronRight
                    className="w-4 h-4 transition-colors"
                    style={{ color: `${game.color}60` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {!isPro && (
          <div className="pb-10">
            <QuizProBanner compact />
          </div>
        )}


      </div>
    </AppShell >
  );
}
