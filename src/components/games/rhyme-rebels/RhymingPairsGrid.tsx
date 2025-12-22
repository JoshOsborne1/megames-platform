"use client";

import { motion } from "framer-motion";
import { RhymePair } from "@/lib/games/rhyme-rebels/types";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface RhymingPairsGridProps {
  pairs: RhymePair[];
  onMatch: (firstIndex: number, secondIndex: number) => void;
  canInteract: boolean;
}

export function RhymingPairsGrid({
  pairs,
  onMatch,
  canInteract,
}: RhymingPairsGridProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    if (!canInteract || pairs[index].isMatched || pairs[index].isFlipped) return;
    if (selectedIndices.includes(index)) return;

    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      onMatch(newSelected[0], newSelected[1]);
      setTimeout(() => setSelectedIndices([]), 1500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h3 className="font-display font-black text-3xl text-white mb-2">
          RHYMING PAIRS BONUS
        </h3>
        <p className="text-white/70 font-space">
          Match the rhyming halves for +2 points each!
        </p>
      </motion.div>

      <div className="grid grid-cols-6 gap-3">
        {pairs.map((pair, index) => (
          <motion.div
            key={pair.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleCardClick(index)}
            className={`relative aspect-square cursor-pointer ${!canInteract || pair.isMatched ? "cursor-not-allowed" : ""
              }`}
            whileHover={
              canInteract && !pair.isMatched ? { scale: 1.05 } : {}
            }
            whileTap={canInteract && !pair.isMatched ? { scale: 0.95 } : {}}
          >
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{
                rotateY: pair.isFlipped || selectedIndices.includes(index) ? 180 : 0,
              }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center p-2"
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, #9370DB 0%, #FF4500 100%)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <span className="font-display font-black text-white text-4xl">
                  ?
                </span>
              </div>

              <div
                className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 ${pair.isMatched ? "bg-green-500" : "bg-gradient-to-br from-purple-600 to-pink-600"
                  }`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  boxShadow: pair.isMatched
                    ? "0 0 30px #32CD32"
                    : "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {pair.isMatched && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                )}

                <span className="font-space font-bold text-white text-xs text-center leading-tight">
                  {pair.displayHalf}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-white font-space text-sm">
            {pairs.filter((p) => p.isMatched).length} / {pairs.length} matched
          </span>
        </div>
      </div>
    </div>
  );
}
