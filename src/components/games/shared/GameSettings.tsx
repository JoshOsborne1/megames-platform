"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

interface GameSettingsProps {
    /** Current number of rounds */
    rounds?: number;
    /** Callback when rounds change */
    onRoundsChange?: (rounds: number) => void;
    /** Min/max rounds */
    minRounds?: number;
    maxRounds?: number;
    /** Current timer duration */
    timerDuration?: number;
    /** Callback when timer changes */
    onTimerChange?: (duration: number) => void;
    /** Min/max timer values */
    minTimer?: number;
    maxTimer?: number;
    /** Current target score */
    targetScore?: number;
    /** Callback when target score changes */
    onTargetScoreChange?: (score: number) => void;
    /** Accent color */
    accentColor?: string;
}

export function GameSettings({
    rounds,
    onRoundsChange,
    minRounds = 1,
    maxRounds = 10,
    timerDuration,
    onTimerChange,
    minTimer = 15,
    maxTimer = 120,
    targetScore,
    onTargetScoreChange,
    accentColor = "#00f5ff",
}: GameSettingsProps) {
    const hasRounds = rounds !== undefined && onRoundsChange;
    const hasTimer = timerDuration !== undefined && onTimerChange;
    const hasScore = targetScore !== undefined && onTargetScoreChange;

    if (!hasRounds && !hasTimer && !hasScore) return null;

    return (
        <section>
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4" style={{ color: accentColor }}>
                <Settings className="w-5 h-5" />
                <h3 className="font-display font-bold text-xl uppercase tracking-wider">
                    Game Settings
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hasRounds && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                        <label className="block text-white/50 text-xs font-space uppercase tracking-wider mb-2">
                            Rounds
                        </label>
                        <input
                            type="number"
                            min={minRounds}
                            max={maxRounds}
                            value={rounds}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || minRounds;
                                onRoundsChange(Math.min(maxRounds, Math.max(minRounds, val)));
                            }}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white font-display font-bold text-xl text-center outline-none focus:border-white/30"
                        />
                    </motion.div>
                )}

                {hasTimer && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                        <label className="block text-white/50 text-xs font-space uppercase tracking-wider mb-2">
                            Timer (sec)
                        </label>
                        <input
                            type="number"
                            min={minTimer}
                            max={maxTimer}
                            step={5}
                            value={timerDuration}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || minTimer;
                                onTimerChange(Math.min(maxTimer, Math.max(minTimer, val)));
                            }}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white font-display font-bold text-xl text-center outline-none focus:border-white/30"
                        />
                    </motion.div>
                )}

                {hasScore && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                        <label className="block text-white/50 text-xs font-space uppercase tracking-wider mb-2">
                            Target Score
                        </label>
                        <input
                            type="number"
                            min={10}
                            max={200}
                            step={5}
                            value={targetScore}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 10;
                                onTargetScoreChange(Math.min(200, Math.max(10, val)));
                            }}
                            className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white font-display font-bold text-xl text-center outline-none focus:border-white/30"
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
