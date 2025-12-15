"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";
import { Layers, Brain, Swords, HelpCircle, Dices, Target } from "lucide-react";

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
  {
    id: "dice-wars",
    name: "Dice Wars",
    description: "Roll the dice and conquer the board! A fast-paced territory control game where luck meets strategy.",
    icon: <Dices className="w-full h-full" />,
    players: "2-4",
    duration: "20-40 min",
    difficulty: "Easy" as const,
    color: "#FFD700",
    comingSoon: true,
  },
  {
    id: "word-duel",
    name: "Word Duel",
    description: "Battle of vocabulary! Create words, steal letters, and outsmart your opponents in this word-building challenge.",
    icon: <Target className="w-full h-full" />,
    players: "2-6",
    duration: "15-30 min",
    difficulty: "Medium" as const,
    color: "#00BFFF",
    comingSoon: true,
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Game <span className="text-gradient">Library</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Browse our collection of digital board games. More games added regularly!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
