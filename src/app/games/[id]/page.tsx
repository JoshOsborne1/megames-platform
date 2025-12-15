"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Clock, Star, Trophy, Play, Plus, ArrowLeft, Layers, Brain, Swords, HelpCircle } from "lucide-react";

const gamesData: Record<string, {
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  players: string;
  duration: string;
  difficulty: string;
  color: string;
  rules: string[];
}> = {
  "card-clash": {
    name: "Card Clash",
    description: "The ultimate card-shedding showdown!",
    longDescription: "Race to empty your hand by matching colors or numbers. Use special action cards like Skip, Reverse, and Draw Two to outmaneuver your opponents. The first player to get rid of all their cards wins! But watch out - if you forget to call out when you're down to your last card, you'll have to draw more!",
    icon: Layers,
    players: "2-8",
    duration: "15-30 min",
    difficulty: "Easy",
    color: "#00BFFF",
    rules: [
      "Each player starts with 7 cards",
      "Match the top card by color or number",
      "Special cards: Skip, Reverse, Draw Two, Wild, Wild Draw Four",
      "Say 'Clash!' when you have one card left",
      "First player to empty their hand wins",
    ],
  },
  "trivia-royale": {
    name: "Trivia Royale",
    description: "Test your knowledge!",
    longDescription: "Battle through rounds of trivia across dozens of categories including History, Science, Pop Culture, Sports, and more. Earn points for correct answers and speed. Challenge friends or compete against players worldwide in real-time knowledge showdowns!",
    icon: Brain,
    players: "2-12",
    duration: "20-45 min",
    difficulty: "Medium",
    color: "#FF4500",
    rules: [
      "Answer multiple choice questions",
      "Faster correct answers earn more points",
      "Categories rotate each round",
      "Power-ups available: 50/50, Skip, Double Points",
      "Highest score at the end wins",
    ],
  },
  "kingdom-quest": {
    name: "Kingdom Quest",
    description: "Build your empire!",
    longDescription: "Expand your kingdom through strategic resource management, diplomacy, and warfare. Build armies, forge alliances, trade resources, and conquer territories. Every decision shapes your path to victory in this epic strategy game.",
    icon: Swords,
    players: "2-6",
    duration: "45-90 min",
    difficulty: "Hard",
    color: "#32CD32",
    rules: [
      "Start with a small territory and basic resources",
      "Collect gold, wood, stone, and food each turn",
      "Build structures to improve production",
      "Train armies to defend and attack",
      "Control the most territory to win",
    ],
  },
};

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = gamesData[gameId];

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-white mb-4">Game Not Found</h1>
            <Link href="/games">
              <Button>Back to Games</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = game.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-[#16162a] border border-white/10 rounded-2xl p-8 mb-6">
                <div className="flex items-start gap-6 mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${game.color}22` }}
                  >
                    <Icon className="w-10 h-10" style={{ color: game.color }} />
                  </div>
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                      {game.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {game.players} players
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {game.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ color: game.color }} />
                        {game.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">{game.longDescription}</p>
              </div>

              <div className="bg-[#16162a] border border-white/10 rounded-2xl p-8">
                <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: game.color }} />
                  How to Play
                </h2>
                <ul className="space-y-3">
                  {game.rules.map((rule, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${game.color}22`, color: game.color }}
                      >
                        {index + 1}
                      </span>
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Play Now</h3>
                <div className="space-y-3">
                  <Link href={`/lobbies/create?game=${gameId}`}>
                    <Button
                      className="w-full py-5 font-semibold"
                      style={{ backgroundColor: game.color, color: "#000" }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Lobby
                    </Button>
                  </Link>
                  <Link href="/lobbies">
                    <Button
                      variant="outline"
                      className="w-full py-5 border-white/10 text-white hover:bg-white/5"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Join Lobby
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Game Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active Players</span>
                    <span className="text-white font-bold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Games Today</span>
                    <span className="text-white font-bold">5,678</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg. Duration</span>
                    <span className="text-white font-bold">18 min</span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-6 border"
                style={{
                  background: `linear-gradient(135deg, ${game.color}22 0%, ${game.color}11 100%)`,
                  borderColor: `${game.color}44`,
                }}
              >
                <h3 className="font-display text-lg font-bold text-white mb-2">Quick Match</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Jump into a game instantly with players at your skill level
                </p>
                <Button
                  className="w-full font-semibold"
                  style={{ backgroundColor: game.color, color: "#000" }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Find Match
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
