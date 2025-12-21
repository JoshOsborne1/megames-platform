"use client";

import { motion } from "framer-motion";
import { GameCard } from "./GameCard";
import { Sparkles, Droplet, MessageCircle, ShieldAlert, Mic2 } from "lucide-react";

const games = [
  {
    id: "lyric-legends",
    name: "LYRIC LEGENDS",
    description: "The ultimate karaoke race! Be the fastest to sing a lyric containing the prompt word. 3-10 players – pure musical chaos.",
    icon: <Mic2 className="w-full h-full" />,
    players: "3-10",
    duration: "10-20 min",
    difficulty: "Medium" as const,
    color: "#8338ec",
  },
  {
    id: "forbidden-flash",
    name: "FORBIDDEN FLASH",
    description: "The ultimate word race! Describe the target without saying the forbidden words. 2-10 players – local swap & play chaos.",
    icon: <ShieldAlert className="w-full h-full" />,
    players: "2-10",
    duration: "5-15 min",
    difficulty: "Hard" as const,
    color: "#ff006e",
  },
  {
    id: "shade-signals",
    name: "SHADE SIGNALS",
    description: "Guess the shade with clever signals! 2-10 players – endless rainbow chaos, perfect for online duels, big parties, or local swap & play.",
    icon: <Droplet className="w-full h-full" />,
    players: "2-10",
    duration: "10-20 min",
    difficulty: "Easy" as const,
    color: "#00f5ff",
  },
];

export function GamesGrid() {
  return (
    <section className="relative py-12 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#ff006e] rounded-full filter blur-[100px] md:blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#8338ec] rounded-full filter blur-[110px] md:blur-[160px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] border-2 border-[#00f5ff]/40 rounded-full px-5 md:px-6 py-2 md:py-3 mb-6 md:mb-8 neon-glow-cyan"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#39ff14]" />
            </motion.div>
            <span className="font-pixel text-[9px] md:text-[10px] text-white tracking-wider uppercase">Collection</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight px-4"
          >
            <span className="block">CHOOSE YOUR</span>
            <span className="block text-gradient-neon glitch">ADVENTURE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl lg:text-2xl max-w-3xl mx-auto font-space font-medium px-4 opacity-80"
          >
            From quick card games to epic strategy battles -{" "}
            <span className="text-gradient-neon font-bold">there's something for everyone</span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 auto-rows-fr">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30, rotateY: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="h-[380px] sm:h-[420px]"
            >
              <GameCard {...game} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[#00f5ff] font-display font-bold text-base md:text-lg neon-text-cyan"
          >
            More games dropping soon...
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}