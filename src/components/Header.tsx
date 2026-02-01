"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Zap, Star, Maximize2, Minimize2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { createClient } from "@/lib/supabase/client";
import { type User as SupabaseUser, type AuthChangeEvent, type Session } from "@supabase/supabase-js";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);



  const getUserInitial = () => {
    if (!user) return "?";
    const name = user.user_metadata?.username ||
      user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "P";
    return name.charAt(0).toUpperCase();
  };

  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || null;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 pt-safe transition-all duration-300 ${scrolled
          ? "bg-[#0a0015]/95 backdrop-blur-xl border-b-2 border-neon-pink/30 shadow-[0_0_30px_rgba(255,0,110,0.2)]"
          : "bg-[#0a0015]/70 backdrop-blur-md border-b border-neon-purple/20"
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-12 md:h-14">
            <Link href="/" className="flex items-center gap-3 group z-10">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/logo.svg"
                  alt="PartyPack"
                  width={40}
                  height={50}
                  className="h-12 w-auto drop-shadow-[0_0_15px_rgba(255,0,110,0.6)]"
                />
              </motion.div>
              <span className="font-display text-2xl font-black text-gradient-neon hidden min-[450px]:block tracking-wider">
                PARTYPACK
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 transform">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="relative group px-6 py-6 text-white/80 hover:text-white hover:bg-transparent font-display font-semibold text-sm overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-neon-pink/0 via-neon-purple/10 to-electric-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-neon-pink via-neon-purple to-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <Star className="w-4 h-4 mr-2 inline-block" />
                    <span className="relative">Home</span>
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/multiplayer">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="relative group px-6 py-6 text-white/80 hover:text-white hover:bg-transparent font-display font-semibold text-sm overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-neon-pink/0 via-neon-purple/10 to-electric-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-neon-pink via-neon-purple to-electric-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <span className="relative">Lobby</span>
                  </Button>
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-3 z-10">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden md:block"
                  >
                    <Input
                      placeholder="Search games..."
                      className="bg-[#1a0f2e] border-neon-purple/40 text-white placeholder:text-[#c4b5fd]/50 focus:border-neon-pink focus:ring-neon-pink/30 font-space"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white/70 hover:text-electric-cyan hover:bg-electric-cyan/10 rounded-full"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white/70 hover:text-electric-cyan hover:bg-electric-cyan/10 rounded-full"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </Button>
              </motion.div>

              {/* Auth buttons */}
              {!loading && (
                <>
                  {user ? (
                    <Link href="/profile" className="hidden sm:block">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {getAvatarUrl() ? (
                          <div className="relative w-10 h-10">
                            <Image
                              src={getAvatarUrl()!}
                              alt="Profile"
                              fill
                              className="rounded-full border-2 border-neon-purple hover:border-neon-pink transition-colors object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-r from-neon-pink to-neon-purple flex items-center justify-center text-white font-bold border-2 border-transparent hover:border-electric-cyan transition-colors">
                            {getUserInitial()}
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                        <Link href="/login">
                          <Button
                            variant="outline"
                            className="border-neon-purple text-white hover:bg-neon-purple/20 hover:border-neon-pink font-display font-semibold text-sm md:text-base px-3 md:px-4 py-2 touch-manipulation"
                          >
                            Login
                          </Button>
                        </Link>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:block"
                      >
                        <Link href="/signup">
                          <Button
                            className="relative font-display font-bold text-sm md:text-base px-3 md:px-4 py-2 bg-linear-to-r from-neon-pink via-neon-purple to-electric-cyan text-white overflow-hidden group touch-manipulation"
                          >
                            <span className="absolute inset-0 bg-linear-to-r from-electric-cyan via-[#fb00ff] to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Sign Up
                            </span>
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-neon-pink rounded-full touch-manipulation min-w-[44px] min-h-[44px]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

        </nav>
      </header>

      {/* New Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}
