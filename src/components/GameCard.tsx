"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Users, Clock, Star, Sparkles, Play, Trophy } from "lucide-react";

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsFlipped(false);
  };

  const difficultyColors = {
    Easy: "#39ff14",
    Medium: "#fb00ff",
    Hard: "#ff006e",
  };

  const rarityGradients = {
    Easy: "from-[#39ff14] to-[#00f5ff]",
    Medium: "from-[#fb00ff] to-[#8338ec]",
    Hard: "from-[#ff006e] to-[#fb00ff]",
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-[420px] cursor-pointer"
      style={{
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
        onHoverStart={() => !isTouch && setIsFlipped(true)}
        onHoverEnd={() => !isTouch && setIsFlipped(false)}
        onClick={() => isTouch && setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
          className="relative w-full h-full transform-gpu"
          style={{
            rotateX: isFlipped ? 0 : (isTouch ? 0 : rotateX),
            rotateY: isFlipped ? 180 : (isTouch ? 0 : rotateY),
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div
            className="absolute inset-0 rounded-3xl holographic-card holographic-shine overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
              border: `3px solid ${color}40`,
              transform: "translateZ(0)", // Improved 3D rendering on mobile
              WebkitTransform: "translateZ(0)",
            }}
          >
          {comingSoon && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-[#fb00ff] to-[#8338ec] text-white text-xs font-display font-bold px-4 py-2 rounded-full flex items-center gap-2 neon-glow-purple z-10"
            >
              <Sparkles className="w-4 h-4" />
              COMING SOON
            </motion.div>
          )}

          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r opacity-80" style={{ background: `linear-gradient(90deg, ${color}, transparent, ${color})` }} />

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
            <motion.div
              className={`relative w-32 h-32 rounded-3xl flex items-center justify-center mb-6 bg-gradient-to-br ${rarityGradients[difficulty]}`}
              animate={{
                boxShadow: [
                  `0 0 20px ${color}60`,
                  `0 0 40px ${color}90`,
                  `0 0 20px ${color}60`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            >
              <div style={{ color: "white" }} className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                {icon}
              </div>
              <div className="absolute -top-2 -right-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39ff14] to-[#00f5ff] flex items-center justify-center border-2 border-[#0a0015]"
                >
                  <Trophy className="w-4 h-4 text-[#0a0015]" />
                </motion.div>
              </div>
            </motion.div>

            <h3 className="font-display text-2xl font-black text-white text-center mb-4 tracking-wide">
              {name}
            </h3>

            <div className="flex items-center gap-6 text-white/70 text-sm font-display font-semibold">
              <motion.span
                whileHover={{ scale: 1.2, color: color }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10"
              >
                <Users className="w-4 h-4" />
                {players}
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.2, color: color }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10"
              >
                <Clock className="w-4 h-4" />
                {duration}
              </motion.span>
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}40 0%, transparent 70%)`,
            }}
          />
        </div>

        <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
              border: `3px solid ${color}60`,
              boxShadow: `0 20px 60px ${color}40`,
            }}
          >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r opacity-90" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

          <div className="relative z-10 h-full flex flex-col p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-black text-white tracking-wide">{name}</h3>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10"
                style={{ color: color }}
              >
                {icon}
              </motion.div>
            </div>

            <p className="text-white/80 text-sm font-space leading-relaxed flex-1 mb-6">
              {description}
            </p>

            <div className="space-y-4">
              {!comingSoon ? (
                <Link href={`/games/${id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 rounded-2xl font-display font-black text-lg text-white transition-all relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                      boxShadow: `0 10px 30px ${color}40`,
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-3">
                      <Play className="w-5 h-5 fill-white" />
                      PLAY NOW
                      <Sparkles className="w-5 h-5" />
                    </span>
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  disabled
                  className="w-full py-4 rounded-2xl font-display font-black text-lg text-white/40 bg-white/5 cursor-not-allowed border-2 border-dashed border-white/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    NOTIFY ME
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${color}50 0%, transparent 60%)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}