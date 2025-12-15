"use client";

import { motion } from "framer-motion";
import { GameCard } from "./GameCard";
import { Layers, Brain, Swords, HelpCircle } from "lucide-react";

const games = [
  {
    id: "card-clash",
    name: "Card Clash",
    description: "The ultimate card-shedding showdown! Race to empty your hand by matching colors and numbers. Special action cards add twists and turns to every round.",
    icon: <Layers className="w-full h-full" />,
    players: "2-8",
    duration: "15-30 min",
    difficulty: "Easy" as const,
    color: "#00BFFF",
  },
  {
    id: "trivia-royale",
    name: "Trivia Royale",
    description: "Test your knowledge across dozens of categories! Compete head-to-head or in teams. The ultimate battle of wits with thousands of questions.",
    icon: <Brain className="w-full h-full" />,
    players: "2-12",
    duration: "20-45 min",
    difficulty: "Medium" as const,
    color: "#FF4500",
  },
  {
    id: "kingdom-quest",
    name: "Kingdom Quest",
    description: "Build your empire, manage resources, and conquer territories in this epic strategy game. Form alliances or crush your enemies!",
    icon: <Swords className="w-full h-full" />,
    players: "2-6",
    duration: "45-90 min",
    difficulty: "Hard" as const,
    color: "#32CD32",
  },
  {
    id: "mystery-mansion",
    name: "Mystery Mansion",
    description: "Solve puzzles, gather clues, and unmask the culprit in this thrilling deduction game. Trust no one - anyone could be the villain!",
    icon: <HelpCircle className="w-full h-full" />,
    players: "3-8",
    duration: "30-60 min",
    difficulty: "Medium" as const,
    color: "#9370DB",
    comingSoon: true,
  },
];

export function GamesGrid() {
  return (
    <section className="py-24 px-4 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-gradient">Adventure</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From quick card games to epic strategy battles - there&apos;s something for everyone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard {...game} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
