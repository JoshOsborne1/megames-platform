"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Users, Clock, Play, Trophy, Sparkles, ChevronRight, Info } from "lucide-react";

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  players: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  color: string;
  comingSoon?: boolean;
}

export function GameCard({
  id,
  name,
  description,
  icon,
  players,
  duration,
  difficulty,
  color,
  comingSoon = false,
}: GameCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const rarityGradients = {
    Easy: "from-[#39ff14]/20 to-[#00f5ff]/20",
    Medium: "from-[#fb00ff]/20 to-[#8338ec]/20",
    Hard: "from-[#ff006e]/20 to-[#fb00ff]/20",
  };

  return (
    <motion.div
      className="relative w-full h-[380px] md:h-[420px] rounded-[2rem] overflow-hidden group cursor-pointer border-2 transition-colors duration-500"
      style={{
        borderColor: showDetails ? `${color}80` : "transparent",
        backgroundColor: "#0a0015",
      }}
      onClick={() => setShowDetails(!showDetails)}
      onHoverStart={() => !isTouch && setShowDetails(true)}
      onHoverEnd={() => !isTouch && setShowDetails(false)}
      whileHover={{ y: -8 }}
    >
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${color} 0%, transparent 70%)`,
        }}
      />

      {/* Main Content (Front) */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
        {comingSoon && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-[#fb00ff] to-[#8338ec] text-[10px] sm:text-xs font-display font-bold px-3 py-1.5 rounded-full flex items-center gap-2 neon-glow-purple z-20">
            <Sparkles className="w-3 h-3 sm:w-4 h-4" />
            COMING SOON
          </div>
        )}

        <motion.div
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] flex items-center justify-center mb-6 bg-gradient-to-br ${rarityGradients[difficulty]} border border-white/10`}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div style={{ color: color }} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {icon}
          </div>
          
          <div className="absolute -bottom-2 -right-2">
            <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/80">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        <h3 className="font-display text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">
          {name}
        </h3>

        <div className="flex items-center gap-3 text-white/50 text-[10px] sm:text-xs font-display font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5">
            <Users className="w-3 h-3" />
            {players}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
        </div>
      </div>

      {/* Details Overlay (Revealed on Hover/Click) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-2 bottom-2 bg-[#0d021a]/95 backdrop-blur-xl rounded-[1.8rem] p-5 sm:p-6 z-30 border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-display font-black text-white/40 uppercase tracking-widest">DETAILS</span>
              </div>
              <div 
                className="px-2 py-0.5 rounded text-[10px] font-display font-black"
                style={{ backgroundColor: `${color}20`, color: color }}
              >
                {difficulty.toUpperCase()}
              </div>
            </div>

            <p className="text-white/70 text-[11px] sm:text-sm font-space leading-relaxed mb-6 line-clamp-3">
              {description}
            </p>

            {!comingSoon ? (
              <Link href={`/games/${id}`}>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 sm:h-14 rounded-2xl flex items-center justify-between px-6 font-display font-black text-sm text-[#0a0015] transition-all"
                  style={{ backgroundColor: color }}
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 fill-[#0a0015]" />
                    PLAY NOW
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full h-12 sm:h-14 rounded-2xl flex items-center justify-center gap-2 font-display font-black text-sm text-white/20 bg-white/5 border border-white/10 cursor-not-allowed uppercase"
              >
                <Sparkles className="w-4 h-4" />
                SOON
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive indicator (mobile) */}
      {isTouch && !showDetails && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-display font-black text-white/20 uppercase tracking-widest animate-pulse">
          TAP TO VIEW
        </div>
      )}
    </motion.div>
  );
}
