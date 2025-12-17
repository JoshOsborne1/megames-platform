"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Snowflake } from "lucide-react";
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
      {/* Local snow effect */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-3xl">
        <Snowflakes />
      </div>

      <div className="bg-gradient-to-br from-[#1a0f2e]/90 via-[#2a1b4e]/80 to-[#0a0015]/90 backdrop-blur-md p-4 sm:p-6 rounded-3xl border-2 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden">
        {/* Snowy background accent */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex justify-between items-center mb-4 px-2 relative z-20">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-blue-200 animate-pulse" />
            <h3 className="font-display text-lg text-white font-bold">
              Christmas Puzzle
            </h3>
          </div>
          <div className="text-blue-200 font-pixel text-sm flex items-center gap-2">
            <span>Moves: {moves}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-1 sm:gap-2 aspect-square w-full bg-blue-900/20 p-1 sm:p-2 rounded-2xl border border-white/20 relative z-20">
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
                  isEmpty ? "opacity-0 cursor-default" : "border border-white/20 shadow-lg"
                }`}
                whileHover={!isEmpty && !isSolved ? { scale: 1.02, zIndex: 10 } : {}}
                whileTap={!isEmpty && !isSolved ? { scale: 0.95 } : {}}
              >
                {!isEmpty && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-110 brightness-110 saturate-110"
                      style={{
                        backgroundImage: `url(${IMAGE_URL})`,
                        backgroundPosition: `${bgX}% ${bgY}%`,
                        backgroundSize: '400% 400%',
                        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))'
                      }}
                    />
                    
                    {/* Santa Hat Overlay */}
                    {HAT_TILES.includes(tile) && (
                      <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute -top-1 -right-1 w-8 h-8 z-30 pointer-events-none"
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                          <path d="M20,80 Q50,20 80,80" fill="#ff0000" stroke="#fff" strokeWidth="2"/>
                          <circle cx="50" cy="20" r="10" fill="#fff" />
                          <rect x="15" y="75" width="70" height="15" rx="5" fill="#fff" />
                        </svg>
                      </motion.div>
                    )}

                    <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center border border-white/30">
                      <span className="text-[10px] sm:text-xs font-pixel text-white drop-shadow-md">{tile}</span>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-8 z-30 pointer-events-none opacity-60">
          <SnowPile />
        </div>

        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center relative z-20"
            >
              <div className="inline-flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <p className="font-display font-bold">Merry Christmas!</p>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-blue-100 text-sm mt-2">Puzzle Solved! Unlocking...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={initPuzzle}
          className="w-full mt-4 py-2 text-xs text-blue-200/50 hover:text-white transition-colors font-pixel relative z-20"
        >
          Reset Festive Puzzle
        </button>
      </div>
    </motion.div>
  );
}
