"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { AuthBenefits } from "@/components/AuthBenefits";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account!");
        router.push("/login");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Same animated background as the rest of the site */}
      <AnimatedBackground />

      {/* Desktop: Left side benefits */}
      <AuthBenefits variant="full" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 lg:py-0 relative z-10">
        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 lg:top-8 lg:left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Logo with brand name - extra top margin on mobile to center in gap */}
          <Link href="/" className="flex flex-col items-center mt-4 mb-4 lg:mt-0 lg:mb-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/logo.svg"
                alt="PartyPack"
                width={48}
                height={60}
                className="w-12 lg:w-14 h-auto drop-shadow-[0_0_20px_rgba(255,0,110,0.3)]"
              />
            </motion.div>
            <span className="text-white/80 text-xs font-display font-medium mt-1.5 tracking-wide">
              PartyPack
            </span>
          </Link>

          {/* Desktop only: Title */}
          <div className="hidden lg:block text-center mb-6">
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Join PartyPack
            </h1>
            <p className="text-white/50 text-sm">
              Create an account and start playing
            </p>
          </div>

          {/* Benefits row - mobile only */}
          <div className="lg:hidden">
            <AuthBenefits variant="inline" />
          </div>

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
              Sign up with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("discord")}
              className="w-full h-11 border-white/10 hover:bg-[#5865F2]/10 text-white bg-transparent hover:border-[#5865F2]/50 backdrop-blur-sm transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4 mr-2.5" viewBox="0 0 127.14 96.36"><path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-18.87-3.37-43.27-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" /></svg>
              Sign up with Discord
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
            onSubmit={handleSignUp}
            className="space-y-3"
          >
            <div className="space-y-1">
              <Label htmlFor="username" className="text-white/70 text-xs">Username</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff006e] transition-colors" />
                <Input
                  id="username"
                  type="text"
                  placeholder="GameMaster99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9 h-10 bg-white/5 border-white/10 focus:border-[#ff006e]/50 focus:ring-[#ff006e]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-white/70 text-xs">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff006e] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-10 bg-white/5 border-white/10 focus:border-[#ff006e]/50 focus:ring-[#ff006e]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-white/70 text-xs">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff006e] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 h-10 bg-white/5 border-white/10 focus:border-[#ff006e]/50 focus:ring-[#ff006e]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
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

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-white/70 text-xs">Confirm Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff006e] transition-colors" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 h-10 bg-white/5 border-white/10 focus:border-[#ff006e]/50 focus:ring-[#ff006e]/20 focus:bg-white/[0.07] transition-all placeholder:text-white/25 text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 bg-gradient-to-r from-[#ff006e] to-[#e0005f] hover:from-[#ff006e]/90 hover:to-[#e0005f]/90 text-white font-bold text-sm shadow-lg shadow-[#ff006e]/20 transition-all duration-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </Button>
          </motion.form>

          {/* Sign in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-white/40 mt-4 text-sm"
          >
            Already have an account?{" "}
            <Link href="/login" className="text-[#ff006e] hover:text-[#ff006e]/80 font-semibold transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
