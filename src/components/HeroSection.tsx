"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function FloatingCard({
  delay,
  x,
  y,
  rotation,
  color,
  icon,
}: {
  delay: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [rotation, rotation + 5, rotation],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: delay * 0.5,
          ease: "easeInOut",
        }}
        className="w-16 h-24 md:w-20 md:h-28 rounded-xl flex items-center justify-center text-2xl md:text-3xl shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
          transform: `rotate(${rotation}deg)`,
          boxShadow: `0 10px 30px ${color}44`,
        }}
      >
        {icon}
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const cards = [
    { delay: 0.2, x: 5, y: 20, rotation: -15, color: "#00BFFF", icon: "♠" },
    { delay: 0.3, x: 85, y: 15, rotation: 20, color: "#FF4500", icon: "♥" },
    { delay: 0.4, x: 10, y: 70, rotation: -10, color: "#32CD32", icon: "♦" },
    { delay: 0.5, x: 88, y: 65, rotation: 15, color: "#9370DB", icon: "♣" },
    { delay: 0.6, x: 75, y: 85, rotation: -8, color: "#FFD700", icon: "★" },
    { delay: 0.7, x: 20, y: 85, rotation: 12, color: "#00BFFF", icon: "🎲" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-card-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] via-transparent to-[#0a0a14]" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00BFFF] rounded-full filter blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF4500] rounded-full filter blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9370DB] rounded-full filter blur-[150px]" />
      </div>

      <div className="hidden md:block">
        {cards.map((card, index) => (
          <FloatingCard key={index} {...card} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm text-gray-300">Now with 4 amazing games to play!</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="text-white">All Your Favorite</span>
            <br />
            <span className="text-gradient">Board Games</span>
            <br />
            <span className="text-white">in One Digital Deck!</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            No cards, no setup, no mess. Just pure multiplayer fun with friends online.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/games">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black font-bold text-lg px-8 py-6 rounded-xl glow-blue"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Play Now
                </Button>
              </motion.div>
            </Link>
            <Link href="/lobbies/create">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500]/10 font-bold text-lg px-8 py-6 rounded-xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Create Lobby
                </Button>
              </motion.div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#9370DB] border-2 border-[#0a0a14]"
                  />
                ))}
              </div>
              <span className="text-sm">2,500+ players online</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-[#FFD700]">★</span>
                ))}
              </div>
              <span className="text-sm">4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 flex flex-col items-center gap-2"
        >
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gray-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
