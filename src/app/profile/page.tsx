"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import {
  Trophy, TrendingUp, Clock, Gamepad2, Settings, LogOut, ChevronRight, Loader2, Medal, User, Crown, Zap, Target
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { AuthModal } from "@/components/AuthModal";

const mockStats = [
  { label: "Games", value: 127, icon: Gamepad2, color: "#00f5ff" },
  { label: "Wins", value: 68, icon: Trophy, color: "#32CD32" },
  { label: "Win Rate", value: "54%", icon: Target, color: "#ff006e" },
  { label: "Hours", value: 42, icon: Clock, color: "#8338ec" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user) {
        // Fetch Pro status
        supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setIsPro(data?.is_pro || false);
          });
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      setLoggingOut(false);
    } else {
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#00f5ff]" />
        </div>
      </AppShell>
    );
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <AppShell>
        <div className="min-h-screen px-4 pt-6 max-w-md mx-auto flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="widget-card !p-8 text-center flex flex-col items-center gap-6 relative overflow-hidden"
          >
            {/* Glow effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ff006e]/30 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#8338ec]/30 blur-3xl rounded-full" />

            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff006e] to-[#8338ec] flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Medal className="w-12 h-12 text-white" />
            </div>

            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold text-white mb-2 leading-tight">Join the<br />Arena</h2>
              <p className="text-white/50 text-sm max-w-[200px] mx-auto">Track stats, unlock achievements, and dominate the leaderboard.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="relative z-10 w-full py-4 rounded-xl bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-bold uppercase tracking-wider shadow-lg shadow-purple-500/25"
            >
              Sign In / Sign Up
            </motion.button>
          </motion.div>

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />
        </div>
      </AppShell>
    );
  }

  // Extract user info
  const username = user?.user_metadata?.username || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Player";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <AppShell>
      <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">

        {/* HEADER - Centered like Arcade */}
        <header className="text-center mb-6">
          <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Profile</h1>
          <p className="text-xs text-white/50 font-medium">Player Stats</p>
        </header>

        {/* PROFILE CARD - With glows */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="widget-card !p-6 mb-6 flex flex-col items-center relative overflow-hidden"
        >
          {/* Background glows */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#00f5ff]/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#ff006e]/20 blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#8338ec]/10 blur-3xl rounded-full" />

          <div className="relative z-10 w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#00f5ff] via-[#8338ec] to-[#ff006e] mb-4 shadow-lg" style={{ boxShadow: '0 0 40px rgba(131, 56, 236, 0.4)' }}>
            <div className="w-full h-full rounded-full bg-[#0a0015] overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl font-display font-bold text-white">{username.charAt(0).toUpperCase()}</div>
              )}
            </div>
            {/* Online Indicator with glow */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#00f5ff] border-4 border-[#0a0015]" style={{ boxShadow: '0 0 10px rgba(0, 245, 255, 0.8)' }} />
          </div>

          <h2 className="relative z-10 font-display text-2xl font-bold text-white mb-2">{username}</h2>

          {isPro ? (
            <div className="relative z-10 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/40 flex items-center gap-2" style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}>
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">PRO MEMBER</span>
            </div>
          ) : (
            <div className="relative z-10 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Level 1 Rookie</span>
            </div>
          )}
        </motion.div>

        {/* STATS GRID - With colors and glows */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {mockStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="widget-card !p-4 flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${stat.color}10, transparent 60%)`,
                borderColor: `${stat.color}30`
              }}
            >
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-16 h-16 blur-2xl rounded-full" style={{ backgroundColor: `${stat.color}20` }} />

              <stat.icon className="w-6 h-6 mb-2 relative z-10" style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color})` }} />
              <div className="font-display font-bold text-xl text-white relative z-10">{stat.value}</div>
              <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider relative z-10">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ACHIEVEMENTS TEASER */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="widget-card !p-4 mb-6 relative overflow-hidden"
          style={{ borderColor: '#FFD700' + '30' }}
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-400/10 blur-2xl rounded-full" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}>
                <Zap className="w-5 h-5 text-amber-400" style={{ filter: 'drop-shadow(0 0 6px #fbbf24)' }} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Achievements</h4>
                <p className="text-[10px] text-white/40">3/24 Unlocked</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400/60" />
          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full widget-card !p-4 flex items-center justify-between bg-white/5 border-white/10 hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-white/50" />
              <span className="text-sm font-bold text-white">Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full widget-card !p-4 flex items-center justify-between bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
          >
            <div className="flex items-center gap-3">
              {loggingOut ? <Loader2 className="w-5 h-5 text-red-500 animate-spin" /> : <LogOut className="w-5 h-5 text-red-500" />}
              <span className="text-sm font-bold text-red-500">Log Out</span>
            </div>
          </motion.button>
        </div>
      </div>
    </AppShell>
  );
}
