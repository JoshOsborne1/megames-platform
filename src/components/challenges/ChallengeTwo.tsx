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
const IMAGE_URL = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop";

export function ChallengeTwo({ onComplete }: ChallengeTwoProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  const initPuzzle = useCallback(() => {
    const newTiles = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);
    let currentTiles = [...newTiles];
    let emptyIndex = TILE_COUNT - 1;
    
    // Shuffle with valid moves to ensure solvability
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
          setTimeout(() => onComplete(9), 1500);
        }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto relative"
    >
      <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border-2 border-[#8338ec]/30 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 relative z-10">

          <div className="text-white/60 font-pixel text-sm">
            Moves: {moves}
          </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 aspect-square w-full bg-black/40 p-3 rounded-2xl border border-white/10 touch-none">
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
                className={`relative aspect-square rounded-lg cursor-pointer overflow-hidden ${
                  isEmpty ? "bg-white/5 border border-white/5" : "border border-white/20 shadow-lg"
                }`}
                whileHover={!isEmpty && !isSolved ? { scale: 1.02 } : {}}
                whileTap={!isEmpty && !isSolved ? { scale: 0.95 } : {}}
              >
                {!isEmpty && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${IMAGE_URL})`,
                        backgroundPosition: `${bgX}% ${bgY}%`,
                        backgroundSize: '400% 400%',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-1 left-1 w-6 h-6 bg-black/40 backdrop-blur-md rounded-md flex items-center justify-center border border-white/10">
                      <span className="text-[10px] font-pixel text-white/80">{tile}</span>
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
              <div className="inline-flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                <Sparkles className="w-4 h-4" />
                <p className="font-display font-bold">Puzzle Solved!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={initPuzzle}
          className="w-full mt-6 py-2 text-[10px] text-white/20 hover:text-white/60 transition-colors font-pixel tracking-widest uppercase"
        >
          Reset Puzzle
        </button>
      </div>
    </motion.div>
  );
}
