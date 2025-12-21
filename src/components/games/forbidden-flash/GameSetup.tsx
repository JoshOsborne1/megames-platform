"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, Plus } from "lucide-react";

interface GameSetupProps {
  onStart: (players: string[]) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(["Player 1", "Player 2"]);
  const [newPlayer, setNewPlayer] = useState("");

  const addPlayer = () => {
    if (newPlayer.trim() && playerNames.length < 10) {
      setPlayerNames([...playerNames, newPlayer.trim()]);
      setNewPlayer("");
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[60vh]">
      <div className="max-w-2xl w-full bg-[#1a0f2e]/80 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <motion.h2 
            className="font-display font-black text-5xl text-white mb-2 tracking-tight uppercase"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Game Setup
          </motion.h2>
          <p className="text-white/50 font-space uppercase text-xs tracking-widest">Configure your session</p>
        </div>

        <div className="space-y-8">
          {/* Player Names */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#ff006e]">
              <Users className="w-5 h-5" />
              <h3 className="font-display font-bold text-xl uppercase tracking-wider">Players (2-10)</h3>
            </div>
            <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {playerNames.map((name, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-pixel text-xs text-white/50">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[index] = e.target.value;
                      setPlayerNames(newNames);
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-white font-space font-bold placeholder-white/20"
                  />
                  <button
                    onClick={() => removePlayer(index)}
                    disabled={playerNames.length <= 2}
                    className="p-2 text-white/20 hover:text-red-500 transition-colors disabled:opacity-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                placeholder="Add player name..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-space outline-none focus:border-[#ff006e] transition-colors"
              />
              <button
                onClick={addPlayer}
                disabled={playerNames.length >= 10 || !newPlayer.trim()}
                className="px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </section>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(playerNames)}
            className="w-full py-5 bg-gradient-to-r from-[#ff006e] to-[#8338ec] rounded-2xl font-display font-black text-xl text-white shadow-lg uppercase tracking-widest mt-4"
          >
            Begin Game
          </motion.button>
        </div>
      </div>
    </div>
  );
}
