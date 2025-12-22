"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";
import { Droplet, Mic2, ShieldAlert } from "lucide-react";

const games = [
  {
    id: "lyric-legends",
    name: "Lyric Legends",
    description: "The ultimate karaoke race! Be the fastest to sing a lyric containing the prompt word. 3-10 players – pure musical chaos.",
    icon: <Mic2 className="w-full h-full" />,
    players: "3-10",
    rules: "Race to sing lyrics! Get a word prompt, be first to sing a real lyric containing it. Fastest singer scores the point.",
    color: "#8338ec",
  },
  {
    id: "forbidden-flash",
    name: "Forbidden Flash",
    description: "The ultimate word race! Describe the target without saying the forbidden words. 2-10 players – local swap & play chaos.",
    icon: <ShieldAlert className="w-full h-full" />,
    players: "2-10",
    rules: "Describe the target word without using forbidden words. 60 seconds per turn. Pass the device and take turns as clue-giver!",
    color: "#ff006e",
  },
  {
    id: "shade-signals",
    name: "Shade Signals",
    description: "Guess the shade with clever signals! 2-10 players – endless rainbow chaos, perfect for online duels, big parties, or local swap & play.",
    icon: <Droplet className="w-full h-full" />,
    players: "2-10",
    rules: "Signal-giver picks a color, gives 1-word clue. Guessers place markers. Give 2-3 word clue to refine. Closest guess wins!",
    color: "#00f5ff",
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