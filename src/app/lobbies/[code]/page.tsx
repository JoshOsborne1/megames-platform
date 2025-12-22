"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Users,
  Crown,
  Copy,
  MessageSquare,
  Send,
  Play,
  LogOut,
  CheckCircle,
  Circle,
  Layers,
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  avatar: string;
}

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: Date;
}

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "You", isHost: true, isReady: false, avatar: "#00BFFF" },
    { id: "2", name: "GameMaster99", isHost: false, isReady: true, avatar: "#FF4500" },
    { id: "3", name: "CardShark", isHost: false, isReady: false, avatar: "#32CD32" },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", player: "GameMaster99", message: "Ready to play!", timestamp: new Date() },
    { id: "2", player: "CardShark", message: "Let's go!", timestamp: new Date() },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false);

  const currentPlayer = players.find((p) => p.name === "You");
  const isHost = currentPlayer?.isHost;
  const allReady = players.every((p) => p.isReady || p.isHost);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Lobby code copied!");
  };

  const toggleReady = () => {
    setIsReady(!isReady);
    setPlayers((prev) =>
      prev.map((p) => (p.name === "You" ? { ...p, isReady: !p.isReady } : p))
    );
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        player: "You",
        message: newMessage.trim(),
        timestamp: new Date(),
      },
    ]);
    setNewMessage("");
  };

  const startGame = () => {
    toast.success("Starting game...");
    router.push(`/games`);
  };

  const leaveLobby = () => {
    toast.info("Left the lobby");
    router.push("/lobbies");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a14]">
      <Header />
      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#00BFFF]/20 flex items-center justify-center">
                  <Layers className="w-7 h-7 text-[#00BFFF]" />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                    Game Lobby
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-sm">Code:</span>
                    <span className="font-mono text-lg text-[#00BFFF]">{code}</span>
                    <button
                      onClick={copyCode}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={leaveLobby}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Lobby
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00BFFF]" />
                    Players ({players.length}/4)
                  </h2>
                  {!isHost && (
                    <Button
                      onClick={toggleReady}
                      className={`${isReady
                          ? "bg-[#32CD32] hover:bg-[#32CD32]/90"
                          : "bg-white/10 hover:bg-white/20"
                        } text-white font-semibold`}
                    >
                      {isReady ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Ready!
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 mr-2" />
                          Not Ready
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${player.isReady || player.isHost
                          ? "border-[#32CD32]/50 bg-[#32CD32]/10"
                          : "border-white/10 bg-white/5"
                        }`}
                    >
                      {player.isHost && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center">
                          <Crown className="w-3 h-3 text-black" />
                        </div>
                      )}
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: player.avatar }}
                      />
                      <p className="text-center text-white font-medium truncate">
                        {player.name}
                      </p>
                      <p
                        className={`text-center text-xs mt-1 ${player.isReady || player.isHost ? "text-[#32CD32]" : "text-gray-500"
                          }`}
                      >
                        {player.isHost ? "Host" : player.isReady ? "Ready" : "Not Ready"}
                      </p>
                    </motion.div>
                  ))}

                  {Array.from({ length: 4 - players.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="p-4 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center min-h-[120px]"
                    >
                      <span className="text-gray-500 text-sm">Empty Slot</span>
                    </div>
                  ))}
                </div>
              </div>

              {isHost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={startGame}
                    disabled={!allReady && players.length > 1}
                    className="w-full bg-gradient-to-r from-[#00BFFF] to-[#32CD32] hover:opacity-90 text-black font-bold py-6 text-lg disabled:opacity-50"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {allReady || players.length === 1 ? "Start Game" : "Waiting for players..."}
                  </Button>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#16162a] border border-white/10 rounded-2xl p-6 flex flex-col h-[400px] lg:h-auto"
            >
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-[#FF4500]" />
                Lobby Chat
              </h2>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${msg.player === "You"
                        ? "text-right"
                        : "text-left"
                      }`}
                  >
                    <span className="text-xs text-gray-500">{msg.player}</span>
                    <div
                      className={`inline-block px-3 py-2 rounded-lg mt-1 max-w-[80%] ${msg.player === "You"
                          ? "bg-[#00BFFF] text-black"
                          : "bg-white/10 text-white"
                        }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
