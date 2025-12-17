"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Snowflake, Gift, Bell } from "lucide-react";
import { Snowflakes } from "@/components/christmas/Snowflakes";
import { SnowPile } from "@/components/christmas/SnowPile";

interface ChallengeTwoProps {
  onComplete: (answer: string | number) => void;
  completedAnswers: (string | number)[];
}

const GRID_SIZE = 4;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const IMAGE_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1766011648601.png?width=800&height=800&resize=contain";

// Define tiles that should have a Santa hat
const HAT_TILES = [2, 3, 6, 7]; // Assuming heads are in the upper middle area

function FestiveLights() {
  return (
    <div className="absolute -top-2 left-0 w-full flex justify-around pointer-events-none z-30">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          className={`w-3 h-4 rounded-full shadow-[0_0_10px_currentColor] ${
            i % 3 === 0 ? 'text-red-500 bg-red-500' : i % 3 === 1 ? 'text-green-500 bg-green-500' : 'text-yellow-400 bg-yellow-400'
          }`}
        />
      ))}
    </div>
  );
}

export function ChallengeTwo({ onComplete }: ChallengeTwoProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  const initPuzzle = useCallback(() => {
    const newTiles = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);
    let currentTiles = [...newTiles];
    let emptyIndex = TILE_COUNT - 1;
    
    for (let i = 0; i < 200; i++) {
      const neighbors = [];
      const row = Math.floor(emptyIndex / GRID_SIZE);
      const col = emptyIndex % GRID_SIZE;
      
      if (row > 0) neighbors.push(emptyIndex - GRID_SIZE);
      if (row < GRID_SIZE - 1) neighbors.push(emptyIndex + GRID_SIZE);
      if (col > 0) neighbors.push(emptyIndex - 1);
      if (col < GRID_SIZE - 1) neighbors.push(emptyIndex + 1);
      
      const nextIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
      [currentTiles[emptyIndex], currentTiles[nextIndex]] = [currentTiles[nextIndex], currentTiles[emptyIndex]];
      emptyIndex = nextIndex;
    }
    
    setTiles(currentTiles);
    setIsSolved(false);
    setMoves(0);
  }, []);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIndex = tiles.indexOf(TILE_COUNT);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isNeighbor = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isNeighbor) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);

      const solved = newTiles.every((tile, i) => tile === i + 1);
      if (solved) {
        setIsSolved(true);
        setTimeout(() => onComplete(4), 1500);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto relative"
    >
      <FestiveLights />
      
      {/* Local snow effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-3xl">
        <Snowflakes />
      </div>

      <div className="bg-gradient-to-br from-[#1a0f2e]/95 via-[#2a1b4e]/90 to-[#0a0015]/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.15)] relative overflow-hidden">
        {/* Frosty corners */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-center mb-4 px-2 relative z-20">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bell className="w-5 h-5 text-yellow-400" />
            </motion.div>
            <h3 className="font-display text-lg text-white font-bold tracking-tight">
              Festive Puzzle
            </h3>
          </div>
          <div className="text-blue-200 font-pixel text-sm flex items-center gap-3">
            <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> {moves}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-1 sm:gap-2 aspect-square w-full bg-blue-900/20 p-2 sm:p-3 rounded-2xl border border-white/20 relative z-20 shadow-inner">
          {tiles.map((tile, index) => {
            const isEmpty = tile === TILE_COUNT;
            const correctPos = tile - 1;
            const bgX = (correctPos % GRID_SIZE) * 33.33;
            const bgY = Math.floor(correctPos / GRID_SIZE) * 33.33;

            return (
              <motion.div
                key={tile}
                layout
                onClick={() => handleTileClick(index)}
                className={`relative aspect-square rounded-lg cursor-pointer overflow-hidden group ${
                  isEmpty ? "bg-white/5 border border-white/10" : "border border-white/20 shadow-lg"
                }`}
                whileHover={!isEmpty && !isSolved ? { scale: 1.02, zIndex: 10 } : {}}
                whileTap={!isEmpty && !isSolved ? { scale: 0.95 } : {}}
              >
                {!isEmpty ? (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-500 group-hover:scale-110 brightness-110 saturate-125"
                      style={{
                        backgroundImage: `url(${IMAGE_URL})`,
                        backgroundPosition: `${bgX}% ${bgY}%`,
                        backgroundSize: '400% 400%',
                        filter: 'contrast(1.1) drop-shadow(0 0 5px rgba(255,255,255,0.3))'
                      }}
                    />
                    
                    {/* Snow filter overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                    
                    {/* Improved Santa Hat Overlay */}
                    {HAT_TILES.includes(tile) && (
                      <motion.div 
                        initial={{ y: -20, opacity: 0, rotate: -15 }}
                        animate={{ y: 0, opacity: 1, rotate: -5 }}
                        className="absolute -top-1 -right-1 w-10 h-10 z-30 pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Hat body */}
                          <path d="M20,80 Q50,10 85,75" fill="#e11d48" stroke="#be123c" strokeWidth="1"/>
                          {/* Pom pom */}
                          <circle cx="85" cy="70" r="10" fill="#fff" />
                          <circle cx="85" cy="70" r="10" fill="url(#snow-grad)" opacity="0.4" />
                          {/* Trim */}
                          <rect x="15" y="72" width="65" height="18" rx="8" fill="#fff" />
                          <rect x="15" y="72" width="65" height="18" rx="8" fill="url(#snow-grad)" opacity="0.3" />
                          <defs>
                            <radialGradient id="snow-grad">
                              <stop offset="0%" stopColor="white" />
                              <stop offset="100%" stopColor="#e2e8f0" />
                            </radialGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    )}

                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20">
                      <span className="text-[10px] sm:text-xs font-pixel text-white/80 drop-shadow-md">{tile}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Snowflake className="w-6 h-6 text-white" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-10 z-30 pointer-events-none opacity-80 scale-110 origin-bottom">
          <SnowPile />
        </div>

        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center relative z-20"
            >
              <div className="inline-flex items-center gap-3 text-white bg-gradient-to-r from-red-500/20 to-green-500/20 px-6 py-3 rounded-full border border-white/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <p className="font-display font-bold text-lg">Merry Christmas!</p>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-blue-100/70 text-sm mt-3 font-pixel animate-pulse">Gift Unlocked! 🎁</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={initPuzzle}
          className="w-full mt-6 py-2 text-[10px] text-blue-200/40 hover:text-white/80 transition-colors font-pixel relative z-20 tracking-widest uppercase"
        >
          Reset Magic Puzzle
        </button>
      </div>
    </motion.div>
  );
}
