"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Lock, Globe, Layers, Brain, Swords } from "lucide-react";

const mockLobbies = [
  {
    id: "1",
    code: "ABC123",
    game: "Card Clash",
    host: "GameMaster99",
    players: 3,
    maxPlayers: 4,
    isPublic: true,
    icon: Layers,
    color: "#00BFFF",
  },
  {
    id: "2",
    code: "XYZ789",
    game: "Trivia Royale",
    host: "QuizWhiz",
    players: 5,
    maxPlayers: 8,
    isPublic: true,
    icon: Brain,
    color: "#FF4500",
  },
  {
    id: "3",
    code: "DEF456",
    game: "Kingdom Quest",
    host: "StrategistKing",
    players: 2,
    maxPlayers: 6,
    isPublic: false,
    icon: Swords,
    color: "#32CD32",
  },
];

export default function LobbiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const filteredLobbies = mockLobbies.filter(
    (lobby) =>
      lobby.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lobby.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Game <span className="text-[#FF4500]">Lobbies</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Join an existing game or create your own lobby
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#00BFFF]" />
                Join by Code
              </h2>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter 6-character code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 uppercase font-mono text-lg tracking-wider"
                />
                <Link href={joinCode.length === 6 ? `/lobbies/${joinCode}` : "#"}>
                  <Button
                    disabled={joinCode.length !== 6}
                    className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black font-semibold px-6"
                  >
                    Join
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#32CD32]" />
                Create New Lobby
              </h2>
              <p className="text-gray-400 mb-4">Start a new game and invite friends!</p>
              <Link href="/lobbies/create">
                <Button className="w-full bg-[#32CD32] hover:bg-[#32CD32]/90 text-black font-semibold">
                  Create Lobby
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-white">Public Lobbies</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search lobbies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredLobbies.map((lobby, index) => (
                <motion.div
                  key={lobby.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#16162a] border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${lobby.color}22` }}
                    >
                      <lobby.icon className="w-6 h-6" style={{ color: lobby.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-white">{lobby.game}</span>
                        {lobby.isPublic ? (
                          <Globe className="w-4 h-4 text-[#32CD32]" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400">Hosted by {lobby.host}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {lobby.players}/{lobby.maxPlayers}
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray-400">
                      {lobby.code}
                    </span>
                    <Link href={`/lobbies/${lobby.code}`}>
                      <Button
                        size="sm"
                        className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black font-semibold"
                      >
                        Join
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}

              {filteredLobbies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No lobbies found. Create one to get started!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
