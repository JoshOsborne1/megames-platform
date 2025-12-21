"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Key, 
  Cpu, 
  Shield, 
  Database, 
  Terminal, 
  Wifi, 
  Fingerprint,
  RefreshCw,
  Trophy,
  AlertCircle
} from "lucide-react";

interface Card {
  id: number;
  icon: any;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// To use images later: Change SYMBOLS to use image URLs and swap <card.icon /> for <img src={card.icon} />
const SYMBOLS = [
  { icon: Lock, value: "lock" },
  { icon: Key, value: "key" },
  { icon: Cpu, value: "cpu" },
  { icon: Shield, value: "shield" },
  { icon: Database, value: "database" },
  { icon: Terminal, value: "terminal" },
  { icon: Wifi, value: "wifi" },
  { icon: Fingerprint, value: "fingerprint" },
];

interface ChallengeThreeProps {
  onComplete: (answer: string | number) => void;
}

export function ChallengeThree({ onComplete }: ChallengeThreeProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [maxMoves] = useState(20);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);

  const initializeGame = useCallback(() => {
    const gameCards: Card[] = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        icon: symbol.icon,
        value: symbol.value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedIndices([]);
    setMoves(0);
    setGameState("playing");
    setStartTime(Date.now());
    setTime(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval: any;
    if (gameState === "playing" && startTime) {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const handleCardClick = (index: number) => {
    if (
      gameState !== "playing" ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length === 2
    ) {
      return;
    }

    // Trigger flip sound here
    // new Audio('/sounds/flip.mp3').play().catch(() => {});

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match!
        setTimeout(() => {
          // Trigger match sound here
          // new Audio('/sounds/match.mp3').play().catch(() => {});
          
          setCards(prev => {
            const updated = [...prev];
            updated[firstIndex].isMatched = true;
            updated[secondIndex].isMatched = true;
            
            if (updated.every(c => c.isMatched)) {
              setGameState("won");
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 600);
      } else {
        // No match
        if (moves + 1 >= maxMoves) {
          setGameState("lost");
        }
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIndex].isFlipped = false;
            updated[secondIndex].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Moves</span>
          <span className={`text-lg font-pixel ${moves > maxMoves - 5 ? 'text-red-400' : 'text-white'}`}>
            {moves}/{maxMoves}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Code Breaker</span>
          <div className="flex gap-1">
            {cards.filter(c => c.isMatched).length / 2} / {SYMBOLS.length}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Time</span>
          <span className="text-lg font-pixel text-[#00f5ff]">{formatTime(time)}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 relative">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            whileHover={gameState === "playing" && !card.isFlipped ? { scale: 1.05 } : {}}
            whileTap={gameState === "playing" && !card.isFlipped ? { scale: 0.95 } : {}}
            onClick={() => handleCardClick(index)}
            className="aspect-square relative cursor-pointer perspective-1000"
          >
            <motion.div
              initial={false}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Back of card (Hidden) */}
              <div className="absolute inset-0 bg-white/5 border-2 border-white/10 rounded-xl flex items-center justify-center backface-hidden overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f5ff]/5 to-transparent opacity-50" />
                <div className="text-[#00f5ff]/20 font-pixel text-xs">?</div>
              </div>

              {/* Front of card (Revealed) */}
              <div 
                className={`absolute inset-0 rounded-xl flex items-center justify-center backface-hidden rotate-y-180 border-2 ${
                  card.isMatched 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-[#1a0f2e] border-[#00f5ff]/50 text-[#00f5ff]'
                }`}
              >
                <card.icon className="w-6 h-6" />
                {card.isMatched && (
                   <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                   />
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}

        <AnimatePresence>
          {gameState !== "playing" && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              className="absolute inset-0 z-50 rounded-2xl flex items-center justify-center p-4 bg-black/60"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1a0f2e] border-2 border-white/10 p-6 rounded-2xl w-full text-center"
              >
                {gameState === "won" ? (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                      <Trophy className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">Code Cracked!</h3>
                    <p className="text-gray-400 text-sm mb-6">You've unlocked the third digit:</p>
                    <div className="text-5xl font-pixel text-[#00f5ff] mb-6 drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]">
                      3
                    </div>
                    <button
                      onClick={() => onComplete(3)}
                      className="w-full py-3 bg-white text-[#0a0015] rounded-xl font-bold hover:bg-gray-100 transition-colors"
                    >
                      Retrieve Digit
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">System Locked</h3>
                    <p className="text-gray-400 text-sm mb-6">Exceeded maximum move limit.</p>
                    <button
                      onClick={initializeGame}
                      className="w-full py-3 bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Retry
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
