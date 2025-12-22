"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Clock, Star, Trophy, Play, Plus, ArrowLeft, Layers, Brain, Swords, HelpCircle, Droplet } from "lucide-react";

const gamesData: Record<string, {
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  players: string;
  duration: string;
  difficulty: string;
  color: string;
  rules: string[];
}> = {
  "shade-signals": {
    name: "Shade Signals",
    description: "Guess the shade with clever signals!",
    longDescription: "A hilarious party game of cryptic color clues and guessing on an infinite rainbow spectrum. Give 1-word then 2-3 word clues to guide your teammates to the exact shade. Score points based on how close you get with radial distance bonuses. Play online with friends or pass-and-play locally for in-person fun!",
    icon: Droplet,
    players: "2-10",
    duration: "10-20 min",
    difficulty: "Easy",
    color: "#00f5ff",
    rules: [
      "Signal-Giver selects a secret color from 4 random vibrant shades",
      "Give a 1-word clue (no direct color names!)",
      "All guessers place their first marker on the spectrum",
      "Give a 2-3 word clarifying clue",
      "Guessers place their second marker to refine their guess",
      "Score based on radial HSV distance with bonuses for accuracy",
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
                  {/* <Link href={`/lobbies/create?game=${gameId}`}>
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
                    </Link> */}
                  <div className="text-gray-400 text-sm italic text-center py-4">
                    Online multiplayer coming soon.<br />Local play available!
                  </div>
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

              {/* <div
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
                </div> */}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}