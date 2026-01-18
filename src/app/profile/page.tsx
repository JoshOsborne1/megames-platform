"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AuthBenefits } from "@/components/AuthBenefits";
import {
  Trophy, Gamepad2, Settings, LogOut, ChevronRight, Loader2, User, Crown, Zap, Target,
  Mail, Lock, Eye, EyeOff, ArrowLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User as SupabaseUser } from "@supabase/supabase-js";



export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [stats, setStats] = useState({ games: 0, wins: 0, points: 0 });

  // Auth State
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

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

        // Fetch User Stats
        supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setStats({
                games: data.games_played || 0,
                wins: data.games_won || 0,
                points: data.total_points || 0
              });
            }
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

  // Authentication Handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const supabase = createClient();
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        // User state will update via useEffect subscription
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email.");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "discord") => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  };
  // Not logged in - show seamless auth screen within AppShell for consistent navigation
  if (!user) {
    return (
      <AppShell>
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm relative z-10"
          >
            {/* Logo with brand name */}
            <Link href="/" className="flex flex-col items-center mb-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/logo.svg"
                  alt="PartyPack"
                  width={48}
                  height={60}
                  className="w-12 h-auto drop-shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                />
              </motion.div>
              <span className="text-white/80 text-xs font-display font-medium mt-1.5 tracking-wide">
                PartyPack
              </span>
            </Link>

            {/* Benefits row */}
            <AuthBenefits variant="inline" />

            {/* OAuth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2.5 mb-4"
            >
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin("google")}
                className="w-full h-11 border-white/10 hover:bg-white/5 hover:border-white/20 text-white bg-transparent backdrop-blur-sm transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthLogin("discord")}
                className="w-full h-11 border-white/10 hover:bg-[#5865F2]/10 text-white bg-transparent hover:border-[#5865F2]/50 backdrop-blur-sm transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4 mr-2.5" viewBox="0 0 127.14 96.36"><path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-18.87-3.37-43.27-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" /></svg>
                Continue with Discord
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative my-4"
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-3 text-white/30">
                  or with email
                </span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleAuth}
              className="space-y-3"
            >
              {authMode === "signup" && (
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-white/70 text-xs">Username</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="GameMaster99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9 h-10 bg-white/5 border-white/10 focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-white/70 text-xs">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 bg-white/5 border-white/10 focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-white/70 text-xs">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 h-10 bg-white/5 border-white/10 focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 mt-1 bg-gradient-to-r from-[#00f5ff] to-[#00d4e0] hover:from-[#00f5ff]/90 hover:to-[#00d4e0]/90 text-black font-bold text-sm shadow-lg shadow-[#00f5ff]/20 transition-all duration-200"
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === "login" ? "Sign In" : "Create Account")}
              </Button>
            </motion.form>

            {/* Toggle auth mode */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center text-white/40 mt-4 text-sm"
            >
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-[#00f5ff] hover:text-[#00f5ff]/80 font-semibold transition-colors"
              >
                {authMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </motion.p>
          </motion.div>
        </div>
      </AppShell>
    );
  }


  // Extract user info
  const profileUsername = user?.user_metadata?.username || user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Player";
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
                <img src={avatarUrl} alt={profileUsername} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl font-display font-bold text-white">{profileUsername.charAt(0).toUpperCase()}</div>
              )}
            </div>
            {/* Online Indicator with glow */}
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#00f5ff] border-4 border-[#0a0015]" style={{ boxShadow: '0 0 10px rgba(0, 245, 255, 0.8)' }} />
          </div>

          <h2 className="relative z-10 font-display text-2xl font-bold text-white mb-2">{profileUsername}</h2>

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
          {[
            { label: "Games", value: stats.games, icon: Gamepad2, color: "#00f5ff" },
            { label: "Wins", value: stats.wins, icon: Trophy, color: "#32CD32" },
            { label: "Win Rate", value: stats.games > 0 ? `${Math.round((stats.wins / stats.games) * 100)}%` : "0%", icon: Target, color: "#ff006e" },
            { label: "Points", value: stats.points, icon: Zap, color: "#8338ec" },
          ].map((stat, i) => (
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
