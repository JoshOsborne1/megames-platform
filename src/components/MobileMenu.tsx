"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Globe, User, Zap, Menu, LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHaptic } from "@/hooks/useHaptic";
import { GAMES } from "@/config/games";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isGameMode?: boolean;
  gameName?: string;
  gameIcon?: React.ReactNode;
  accentColor?: string;
  onConfirmLeave?: () => void;
  showConfirmation?: boolean;
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  isGameMode = false,
  gameName,
  gameIcon,
  accentColor = "#ff006e",
  onConfirmLeave,
  showConfirmation = true,
}: MobileMenuProps) {
  const { trigger } = useHaptic();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
      setUser(user);
      setLoading(false);
    });

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

  const handleLinkClick = () => {
    trigger();
    onClose();
  };

  const handleNavigate = (path: string) => {
    if (showConfirmation && isGameMode) {
      setConfirmTarget(path);
      onClose();
    } else {
      onConfirmLeave?.();
      trigger();
    }
  };

  const confirmNavigation = () => {
    if (confirmTarget) {
      onConfirmLeave?.();
      trigger();
    }
    setConfirmTarget(null);
  };

  // Get first 4 games for quick access (only in non-game mode)
  const quickGames = GAMES.slice(0, 4);

  // Animation variants based on mode
  const slideVariants = isGameMode ? {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" }
  } : {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" }
  };

  const positionClasses = isGameMode 
    ? "left-0 border-r border-white/10" 
    : "right-0 border-l border-white/10";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={slideVariants.initial}
              animate={slideVariants.animate}
              exit={slideVariants.exit}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${positionClasses} h-full w-[280px] sm:w-[320px] bg-[#0a0015]/95 backdrop-blur-xl shadow-2xl shadow-black/80 z-[70] flex flex-col`}
              style={{
                paddingTop: "max(env(safe-area-inset-top), 16px)",
                paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
              }}
            >
              {/* Game Mode Header - "Now Playing" */}
              {isGameMode && gameName && (
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    {gameIcon && (
                      <div className="w-10 h-10" style={{ color: accentColor }}>
                        {gameIcon}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-pixel text-white/40 uppercase tracking-widest block">
                        Now Playing
                      </span>
                      <h3 className="font-display font-bold text-white text-lg">
                        {gameName}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Header (non-game mode) */}
              {!isGameMode && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.svg"
                      alt="PartyPack"
                      width={28}
                      height={35}
                      className="h-7 w-auto drop-shadow-[0_0_10px_rgba(255,0,110,0.5)]"
                    />
                    <span className="font-display font-bold text-lg text-white tracking-wide">
                      PARTY
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
                {/* Quick Games Section - Only in non-game mode */}
                {!isGameMode && (
                  <section className="mb-6">
                    <h3 className="font-display text-[10px] uppercase tracking-widest text-white/50 mb-3 px-1">
                      Quick Games
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {quickGames.map((game, index) => {
                        const Icon = game.icon;
                        const colors = ["#ff006e", "#8338ec", "#00f5ff", "#22c55e"];
                        const gameAccentColor = colors[index % colors.length];
                        
                        return (
                          <Link
                            key={game.id}
                            href={`${game.route}?mode=local`}
                            onClick={handleLinkClick}
                            className="block"
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                            >
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ 
                                  backgroundColor: `${gameAccentColor}15`,
                                  border: `1px solid ${gameAccentColor}30`
                                }}
                              >
                                <Icon className="w-5 h-5" style={{ color: gameAccentColor }} />
                              </div>
                              <span className="text-[11px] text-white/70 text-center font-medium leading-tight overflow-hidden text-ellipsis whitespace-nowrap w-full">
                                {game.name}
                              </span>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Main Navigation */}
                <section>
                  <h3 className="font-display text-[10px] uppercase tracking-widest text-white/50 mb-4">
                    Navigation
                  </h3>
                  <nav className="space-y-2">
                    <button
                      onClick={() => handleNavigate("/")}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group text-left"
                    >
                      <Home className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: "#00f5ff" }} />
                      <span className="font-display font-bold text-white/80 group-hover:text-white">Home</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigate("/lobby?mode=local")}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group text-left"
                    >
                      <LayoutGrid className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: "#ff006e" }} />
                      <span className="font-display font-bold text-white/80 group-hover:text-white">All Games</span>
                    </button>
                  </nav>
                </section>

                {/* Account Section - Only in non-game mode */}
                {!isGameMode && (
                  <section>
                    <h3 className="font-display text-[10px] uppercase tracking-widest text-white/50 mb-4">
                      Account
                    </h3>
                    {!loading && (
                      <div className="space-y-3">
                        {user ? (
                          <Link
                            href="/profile"
                            onClick={handleLinkClick}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                            >
                              {getAvatarUrl() ? (
                                <img
                                  src={getAvatarUrl()!}
                                  alt="Profile"
                                  className="w-8 h-8 rounded-full ring-2 ring-white/10"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center text-white text-sm font-bold">
                                  {getUserInitial()}
                                </div>
                              )}
                              <span className="font-display font-semibold">My Profile</span>
                            </motion.div>
                          </Link>
                        ) : (
                          <div className="space-y-2">
                            <Link href="/login" onClick={handleLinkClick}>
                              <Button
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/5 font-display py-4"
                              >
                                Login
                              </Button>
                            </Link>
                            <Link href="/signup" onClick={handleLinkClick}>
                              <Button
                                className="w-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display font-bold py-4"
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                Sign Up
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}

                {/* PartyPro Promo - Only in non-game mode */}
                {!isGameMode && (
                  <section>
                    <Link href="/shop" onClick={handleLinkClick}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-[#ff006e]/10 to-[#8338ec]/10 border border-[#ff006e]/30 hover:border-[#ff006e]/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-display font-bold text-white">PartyPro</span>
                        </div>
                        <p className="text-xs text-white/60 mb-3">
                          Unlock all games, remove ads, and get exclusive features!
                        </p>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display text-xs"
                        >
                          Upgrade Now
                        </Button>
                      </motion.div>
                    </Link>
                  </section>
                )}
              </div>

              {/* Back to Game Button - Only in game mode */}
              {isGameMode && (
                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-display font-bold text-sm">Back to Game</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog - Game Mode Only */}
      <AnimatePresence>
        {confirmTarget && isGameMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmTarget(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#1a142e] border-2 border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto">
                <h3 className="font-display font-black text-2xl text-white mb-3 text-center">Leave Game?</h3>
                <p className="text-white/60 text-center mb-6 font-space">
                  Your current progress will be lost. Are you sure?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfirmTarget(null)}
                    className="py-3 px-4 rounded-xl bg-white/10 text-white font-display font-bold hover:bg-white/20 transition-colors"
                  >
                    Stay
                  </button>
                  <button
                    onClick={confirmNavigation}
                    className="py-3 px-4 rounded-xl font-display font-bold text-white transition-colors"
                    style={{ backgroundColor: accentColor }}
                  >
                    Leave
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Burger Button for Game Mode (Top Left)
interface GameMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
  accentColor?: string;
}

export function GameMenuButton({ onClick, isOpen, accentColor = "#ff006e" }: GameMenuButtonProps) {
  const { trigger } = useHaptic();

  const handleClick = () => {
    trigger();
    onClick();
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleClick}
      className="fixed top-12 sm:top-10 left-4 sm:left-6 z-50 w-12 h-12 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all shadow-lg"
      style={{ boxShadow: isOpen ? `0 0 20px ${accentColor}40` : undefined }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            <X className="w-6 h-6" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
          >
            <Menu className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Floating Menu Button for Game Mode (Bottom Left) - Alternative
interface FloatingMenuButtonProps {
  onClick: () => void;
}

export function FloatingMenuButton({ onClick }: FloatingMenuButtonProps) {
  const { trigger } = useHaptic();

  const handleClick = () => {
    trigger();
    onClick();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#ff006e] to-[#8338ec] shadow-lg shadow-[#ff006e]/30 flex items-center justify-center text-white"
      style={{
        bottom: "max(24px, env(safe-area-inset-bottom) + 16px)",
        left: "max(24px, env(safe-area-inset-left) + 16px)",
      }}
    >
      <Menu className="w-6 h-6" />
    </motion.button>
  );
}
