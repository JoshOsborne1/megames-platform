"use client";

import { motion } from "framer-motion";
import { GameCard } from "./GameCard";
import { Layers, Brain, Swords, HelpCircle, Sparkles, Droplet, Headphones } from "lucide-react";

const games = [
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
  {
    id: "lyric-echoes",
    name: "LYRIC ECHOES",
    description: "Guess the hit from echoed nonsense! 3-12 players – hilarious music madness, perfect for parties, karaoke nights, or quick duels.",
    icon: <Headphones className="w-full h-full" />,
    players: "3-12",
    duration: "15-30 min",
    difficulty: "Easy" as const,
    color: "#FF4500",
  },
  {
    id: "card-clash",
    name: "CARD CLASH",
    description: "The ultimate card-shedding showdown! Race to empty your hand by matching colors and numbers. Special action cards add twists and turns to every round.",
    icon: <Layers className="w-full h-full" />,
    players: "2-8",
    duration: "15-30 min",
    difficulty: "Easy" as const,
    color: "#ff006e",
  },
  {
    id: "trivia-royale",
    name: "TRIVIA ROYALE",
    description: "Test your knowledge across dozens of categories! Compete head-to-head or in teams. The ultimate battle of wits with thousands of questions.",
    icon: <Brain className="w-full h-full" />,
    players: "2-12",
    duration: "20-45 min",
    difficulty: "Medium" as const,
    color: "#8338ec",
  },
  {
    id: "kingdom-quest",
    name: "KINGDOM QUEST",
    description: "Build your empire, manage resources, and conquer territories in this epic strategy game. Form alliances or crush your enemies!",
    icon: <Swords className="w-full h-full" />,
    players: "2-6",
    duration: "45-90 min",
    difficulty: "Hard" as const,
    color: "#00f5ff",
  },
  {
    id: "mystery-mansion",
    name: "MYSTERY MANSION",
    description: "Solve puzzles, gather clues, and unmask the culprit in this thrilling deduction game. Trust no one - anyone could be the villain!",
    icon: <HelpCircle className="w-full h-full" />,
    players: "3-8",
    duration: "30-60 min",
    difficulty: "Medium" as const,
    color: "#fb00ff",
    comingSoon: true,
  },
];

export function GamesGrid() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#ff006e] rounded-full filter blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8338ec] rounded-full filter blur-[160px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] border-2 border-[#00f5ff]/40 rounded-full px-6 py-3 mb-8 neon-glow-cyan"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-[#39ff14]" />
            </motion.div>
            <span className="font-pixel text-[10px] text-white tracking-wider">GAME COLLECTION</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            <span className="block">CHOOSE YOUR</span>
            <span className="block text-gradient-neon glitch">ADVENTURE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-xl md:text-2xl max-w-3xl mx-auto font-space font-medium"
          >
            From quick card games to epic strategy battles -{" "}
            <span className="text-gradient-neon font-bold">there's something for everyone</span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50, rotateY: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="h-[420px]"
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
          className="text-center mt-16"
        >
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[#00f5ff] font-display font-bold text-lg neon-text-cyan"
          >
            More games dropping soon...
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}