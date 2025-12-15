"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Layers, Brain, Swords, Globe, Lock, Users, Loader2 } from "lucide-react";

const games = [
  { id: "card-clash", name: "Card Clash", icon: Layers, color: "#00BFFF", maxPlayers: 8 },
  { id: "trivia-royale", name: "Trivia Royale", icon: Brain, color: "#FF4500", maxPlayers: 12 },
  { id: "kingdom-quest", name: "Kingdom Quest", icon: Swords, color: "#32CD32", maxPlayers: 6 },
];

function generateLobbyCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function CreateLobbyPage() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [lobbyName, setLobbyName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [loading, setLoading] = useState(false);

  const selectedGameData = games.find((g) => g.id === selectedGame);

  const handleCreate = async () => {
    if (!selectedGame) {
      toast.error("Please select a game");
      return;
    }

    setLoading(true);
    
    // Simulate lobby creation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const code = generateLobbyCode();
    toast.success(`Lobby created! Code: ${code}`);
    router.push(`/lobbies/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Create a <span className="text-[#32CD32]">Lobby</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Choose a game and invite your friends to play
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#16162a] border border-white/10 rounded-2xl p-8"
          >
            <div className="space-y-8">
              <div>
                <Label className="text-gray-300 text-lg mb-4 block">Select a Game</Label>
                <div className="grid grid-cols-3 gap-4">
                  {games.map((game) => (
                    <motion.button
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedGame(game.id);
                        setMaxPlayers(Math.min(maxPlayers, game.maxPlayers));
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedGame === game.id
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
                        style={{ backgroundColor: `${game.color}22` }}
                      >
                        <game.icon className="w-6 h-6" style={{ color: game.color }} />
                      </div>
                      <span className="font-display text-sm text-white">{game.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="lobbyName" className="text-gray-300">
                  Lobby Name (optional)
                </Label>
                <Input
                  id="lobbyName"
                  value={lobbyName}
                  onChange={(e) => setLobbyName(e.target.value)}
                  placeholder="My Awesome Lobby"
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="maxPlayers" className="text-gray-300">
                  Max Players: {maxPlayers}
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    id="maxPlayers"
                    min={2}
                    max={selectedGameData?.maxPlayers || 8}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="flex-1 accent-[#00BFFF]"
                  />
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{maxPlayers}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="w-5 h-5 text-[#32CD32]" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <Label className="text-gray-300">Public Lobby</Label>
                    <p className="text-sm text-gray-500">
                      {isPublic ? "Anyone can find and join" : "Invite only with code"}
                    </p>
                  </div>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <Button
                onClick={handleCreate}
                disabled={!selectedGame || loading}
                className="w-full bg-gradient-to-r from-[#00BFFF] to-[#32CD32] hover:opacity-90 text-black font-bold py-6 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Lobby"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
