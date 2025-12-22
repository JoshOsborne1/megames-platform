"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RefreshCcw } from "lucide-react";

interface ChallengeFourProps {
  onComplete: (answer: string | number) => void;
}

const WORDS = [
  "CHRISTMAS",
  "FAMILY",
  "CODE",
  "QUINN",
  "SECRET",
  "SANTA",
  "SNOW",
  "NEPHEW",
  "OSBORNE",
  "TREE",
  "ELVES",
  "SNOWMAN"
];

const GRID_SIZE = 12;

type Cell = {
  char: string;
  row: number;
  col: number;
};

export function ChallengeFour({ onComplete }: ChallengeFourProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selecting, setSelecting] = useState<{ start: Cell, current: Cell } | null>(null);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const generateGrid = useCallback(() => {
    const newGrid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(""));
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [-1, 1],  // diagonal up-right
      [0, -1],  // horizontal back
      [-1, 0],  // vertical up
    ];

    // Place words
    WORDS.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);

        if (canPlace(word, startRow, startCol, dir, newGrid)) {
          place(word, startRow, startCol, dir, newGrid);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty spots
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const finalGrid: Cell[][] = newGrid.map((row, r) =>
      row.map((char, c) => ({
        char: char || alphabet[Math.floor(Math.random() * alphabet.length)],
        row: r,
        col: c
      }))
    );

    setGrid(finalGrid);
    setFoundWords([]);
    setFoundCells(new Set());
    setSelecting(null);
  }, []);

  function canPlace(word: string, row: number, col: number, dir: number[], grid: string[][]) {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dir[0];
      const c = col + i * dir[1];
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  function place(word: string, row: number, col: number, dir: number[], grid: string[][]) {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dir[0];
      const c = col + i * dir[1];
      grid[r][c] = word[i];
    }
  }

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const getSelectedCells = (start: Cell, end: Cell) => {
    const cells: Cell[] = [];
    const dr = end.row - start.row;
    const dc = end.col - start.col;
    const dist = Math.max(Math.abs(dr), Math.abs(dc));

    if (dist === 0) return [start];

    // Check if it's a valid direction (horizontal, vertical, or 45deg diagonal)
    const isHorizontal = dr === 0;
    const isVertical = dc === 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc);

    if (!isHorizontal && !isVertical && !isDiagonal) return [];

    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    for (let i = 0; i <= dist; i++) {
      const r = start.row + i * stepR;
      const c = start.col + i * stepC;
      cells.push(grid[r][c]);
    }
    return cells;
  };

  const handlePointerDown = (cell: Cell) => {
    setSelecting({ start: cell, current: cell });
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!selecting) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element) {
      const row = element.getAttribute('data-row');
      const col = element.getAttribute('data-col');
      if (row !== null && col !== null) {
        const r = parseInt(row);
        const c = parseInt(col);
        const cell = grid[r][c];
        if (cell && (cell.row !== selecting.current.row || cell.col !== selecting.current.col)) {
          setSelecting(prev => prev ? { ...prev, current: cell } : null);
        }
      }
    }
  }, [selecting, grid]);

  useEffect(() => {
    if (selecting) {
      window.addEventListener("pointermove", handlePointerMove);
      return () => window.removeEventListener("pointermove", handlePointerMove);
    }
  }, [selecting, handlePointerMove]);

  const handlePointerUp = () => {
    if (!selecting) return;

    const selected = getSelectedCells(selecting.start, selecting.current);
    const word = selected.map(c => c.char).join("");
    const revWord = word.split("").reverse().join("");

    if (WORDS.includes(word) && !foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word]);
      const newFoundCells = new Set(foundCells);
      selected.forEach(c => newFoundCells.add(`${c.row}-${c.col}`));
      setFoundCells(newFoundCells);
    } else if (WORDS.includes(revWord) && !foundWords.includes(revWord)) {
      setFoundWords(prev => [...prev, revWord]);
      const newFoundCells = new Set(foundCells);
      selected.forEach(c => newFoundCells.add(`${c.row}-${c.col}`));
      setFoundCells(newFoundCells);
    }

    setSelecting(null);
  };

  useEffect(() => {
    if (foundWords.length === WORDS.length) {
      setTimeout(() => onComplete(8), 1000);
    }
  }, [foundWords, onComplete]);

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerUp]);

  const selectedCells = selecting ? getSelectedCells(selecting.start, selecting.current) : [];
  const selectedKeys = new Set(selectedCells.map(c => `${c.row}-${c.col}`));

  return (
    <div
      className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <p className="text-gray-400 text-sm">Find all the festive words!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md">
        {WORDS.map(word => (
          <div
            key={word}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center justify-between ${foundWords.includes(word)
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'bg-white/5 border-white/10 text-white/40'
              }`}
          >
            {word}
            {foundWords.includes(word) && <CheckCircle2 className="w-3 h-3" />}
          </div>
        ))}
      </div>

      <div
        className="relative bg-white/5 p-2 rounded-xl border border-white/10 select-none touch-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '2px'
        }}
      >
        {grid.map((row, r) => row.map((cell, c) => {
          const key = `${r}-${c}`;
          const isSelected = selectedKeys.has(key);
          const isFound = foundCells.has(key);

          return (
            <motion.div
              key={key}
              data-row={r}
              data-col={c}
              onPointerDown={() => handlePointerDown(cell)}
              className={`
                  w-[26px] h-[26px] sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-sm font-bold rounded-md cursor-pointer transition-colors relative z-10
                  ${isSelected ? 'bg-red-600 text-white' : ''}
                  ${isFound && !isSelected ? 'bg-green-600/60 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}
                  ${!isSelected && !isFound ? 'text-white/60 hover:bg-white/10' : ''}
                `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {cell.char}
            </motion.div>
          );

        }))}
      </div>

      <button
        onClick={generateGrid}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs"
      >
        <RefreshCcw className="w-3 h-3" /> Reset Grid
      </button>
    </div>
  );
}
