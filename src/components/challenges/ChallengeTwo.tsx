"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ChallengeTwoProps {
  onComplete: (answer: string | number) => void;
  completedAnswers: (string | number)[];
}

const GRID_SIZE = 4;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const IMAGE_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1766011648601.png?width=800&height=800&resize=contain";

export function ChallengeTwo({ onComplete }: ChallengeTwoProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  const initPuzzle = useCallback(() => {
    // Start with solved state
    const newTiles = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);
    
    // Shuffle by making valid moves to ensure solvability
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

      // Check if solved
      const solved = newTiles.every((tile, i) => tile === i + 1);
      if (solved) {
        setIsSolved(true);
        setTimeout(() => onComplete(4), 1500); // 4 is the next number
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-[#1a0f2e]/80 to-[#0a0015]/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border-2 border-[#8338ec]/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-display text-lg text-white font-bold">
            Tile Slide Puzzle
          </h3>
          <div className="text-[#8338ec] font-pixel text-sm">
            Moves: {moves}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-1 sm:gap-2 aspect-square w-full bg-black/40 p-1 sm:p-2 rounded-2xl border border-white/10">
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
                  isEmpty ? "opacity-0 cursor-default" : "border border-white/10"
                }`}
                whileHover={!isEmpty && !isSolved ? { scale: 1.02, zIndex: 10 } : {}}
                whileTap={!isEmpty && !isSolved ? { scale: 0.95 } : {}}
              >
                {!isEmpty && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${IMAGE_URL})`,
                        backgroundPosition: `${bgX}% ${bgY}%`,
                        backgroundSize: '400% 400%'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 bg-black/60 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20">
                      <span className="text-[10px] sm:text-xs font-pixel text-white">{tile}</span>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
                <Sparkles className="w-5 h-5" />
                <p className="font-display font-bold">Puzzle Solved!</p>
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-gray-400 text-sm mt-2">Next challenge starting...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={initPuzzle}
          className="w-full mt-4 py-2 text-xs text-gray-500 hover:text-white transition-colors font-pixel"
        >
          Reset Puzzle
        </button>
      </div>
    </motion.div>
  );
}
