"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Sparkles, Users, Zap, Gamepad2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

function FloatingCard({
  delay,
  x,
  y,
  rotation,
  gradientFrom,
  gradientTo,
  icon,
}: {
  delay: number;
  x: number;
  y: number;
  rotation: number;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotateY: -180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay, duration: 0.8, type: "spring", bounce: 0.4 }}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotateZ: [rotation, rotation + 8, rotation],
        }}
        transition={{
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.2, rotateY: 180 }}
        className="w-20 h-32 md:w-24 md:h-36 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-2xl cursor-pointer card-3d holographic-shine"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          transform: `rotate(${rotation}deg)`,
          boxShadow: `0 15px 40px ${gradientFrom}66, 0 0 30px ${gradientTo}44`,
          border: `2px solid rgba(255, 255, 255, 0.2)`,
        }}
      >
        <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{icon}</span>
      </motion.div>
    </motion.div>
  );
}

function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        y: [-100, -800],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255, 0, 110, 0.8), transparent)`,
        filter: `blur(${size / 4}px)`,
      }}
    />
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const cards = [
    { delay: 0.2, x: 8, y: 15, rotation: -20, gradientFrom: "#ff006e", gradientTo: "#8338ec", icon: "♠" },
    { delay: 0.4, x: 82, y: 10, rotation: 25, gradientFrom: "#8338ec", gradientTo: "#00f5ff", icon: "♥" },
    { delay: 0.6, x: 12, y: 70, rotation: -15, gradientFrom: "#00f5ff", gradientTo: "#fb00ff", icon: "♦" },
    { delay: 0.8, x: 85, y: 65, rotation: 18, gradientFrom: "#fb00ff", gradientTo: "#39ff14", icon: "♣" },
    { delay: 1.0, x: 75, y: 88, rotation: -12, gradientFrom: "#39ff14", gradientTo: "#ff006e", icon: "★" },
    { delay: 1.2, x: 22, y: 85, rotation: 15, gradientFrom: "#ff006e", gradientTo: "#00f5ff", icon: "🎲" },
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.3,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
  }));

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 scanline" />
      
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff006e] rounded-full filter blur-[180px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8338ec] rounded-full filter blur-[200px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#00f5ff] rounded-full filter blur-[190px]"
          />
        </div>
      </motion.div>

      <div className="hidden lg:block">
        {particles.map((particle, index) => (
          <Particle key={index} {...particle} />
        ))}
      </div>

      <div className="hidden md:block">
        {cards.map((card, index) => (
          <FloatingCard key={index} {...card} />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0, rotateZ: -180 }}
            animate={{ scale: 1, rotateZ: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150, bounce: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] border-2 border-[#ff006e]/40 rounded-full px-6 py-3 mb-8 neon-glow-pink"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-[#39ff14]" />
            </motion.div>
            <span className="text-sm font-display font-bold text-white">4 EPIC GAMES LIVE NOW</span>
            <Gamepad2 className="w-5 h-5 text-[#00f5ff]" />
          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.span
              className="block text-white mb-2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ALL YOUR
            </motion.span>
            <motion.span
              className="block text-gradient-neon mb-2 glitch tracking-wider"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              FAVORITE
            </motion.span>
            <motion.span
              className="block text-white"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              GAMES
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-xl md:text-3xl text-white/70 mb-12 max-w-3xl mx-auto font-space font-medium"
          >
            No cards. No setup. No limits.{" "}
            <span className="text-gradient-neon font-bold">Just pure multiplayer chaos.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <Link href="/games">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -2, 2, -2, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="relative font-display font-black text-xl px-10 py-8 rounded-2xl bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] text-white overflow-hidden group pulse-glow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] via-[#fb00ff] to-[#ff006e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-3">
                    <Play className="w-6 h-6 fill-white" />
                    PLAY NOW
                    <Zap className="w-6 h-6" />
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/lobbies/create">
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-[#00f5ff] text-[#00f5ff] hover:bg-[#00f5ff]/20 font-display font-black text-xl px-10 py-8 rounded-2xl neon-glow-cyan"
                >
                  <Users className="w-6 h-6 mr-3" />
                  CREATE LOBBY
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 text-white/60"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#1a0f2e]/60 border border-[#ff006e]/30"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.7 + i * 0.1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff006e] via-[#8338ec] to-[#00f5ff] border-3 border-[#0a0015] flex items-center justify-center font-display font-bold text-sm"
                  >
                    {i}K
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-display font-bold text-[#00f5ff]">8,500+ ONLINE</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#1a0f2e]/60 border border-[#39ff14]/30"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 1.8 + i * 0.05 }}
                    className="text-[#39ff14] text-xl drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]"
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <span className="text-sm font-display font-bold text-[#39ff14]">4.9/5 RATING</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#00f5ff] flex flex-col items-center gap-3 cursor-pointer group"
        >
          <span className="text-sm font-display font-bold tracking-wider neon-text-cyan">EXPLORE GAMES</span>
          <div className="w-8 h-12 border-3 border-[#00f5ff] rounded-full flex items-start justify-center p-2 group-hover:border-[#ff006e] transition-colors neon-glow-cyan">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-[#00f5ff] rounded-full group-hover:bg-[#ff006e] transition-colors"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
