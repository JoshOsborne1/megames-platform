"use client";

import { Tv, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface WatchAdButtonProps {
    onReward?: () => void;
    label?: string;
    description?: string;
    variant?: "default" | "compact" | "card";
}

export function WatchAdButton({
    onReward,
    label = "Watch Ad",
    description,
    variant = "default"
}: WatchAdButtonProps) {
    const [isWatching, setIsWatching] = useState(false);
    const [rewarded, setRewarded] = useState(false);

    const handleWatch = () => {
        setIsWatching(true);
        // Simulate ad viewing delay (2 seconds)
        setTimeout(() => {
            setIsWatching(false);
            setRewarded(true);
            if (onReward) onReward();
        }, 2000);
    };

    if (rewarded) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-xs ${variant === 'card' ? 'w-full justify-center' : ''}`}
            >
                <Sparkles className="w-4 h-4" />
                Reward Active
            </motion.div>
        );
    }

    if (variant === "compact") {
        return (
            <button
                onClick={handleWatch}
                disabled={isWatching}
                className="p-2.5 rounded-xl bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30 hover:bg-[#00f5ff]/20 transition-all disabled:opacity-50"
                title="Watch Ad for Rewards"
            >
                {isWatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Tv className="w-5 h-5" />}
            </button>
        );
    }

    if (variant === "card") {
        return (
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleWatch}
                disabled={isWatching}
                className="w-full p-4 rounded-xl bg-gradient-to-br from-[#00f5ff]/10 to-transparent border border-[#00f5ff]/20 hover:border-[#00f5ff]/40 transition-all text-left flex items-center justify-between group disabled:opacity-50"
            >
                <div>
                    <h4 className="font-display font-bold text-[#00f5ff] text-sm flex items-center gap-2">
                        <Tv className="w-4 h-4" /> {label}
                    </h4>
                    {description && <p className="text-xs text-[#00f5ff]/60 mt-1">{description}</p>}
                </div>
                {isWatching ? (
                    <Loader2 className="w-5 h-5 text-[#00f5ff] animate-spin" />
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#00f5ff]/20 flex items-center justify-center group-hover:bg-[#00f5ff]/30 text-[#00f5ff]">
                        <Tv className="w-4 h-4" />
                    </div>
                )}
            </motion.button>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleWatch}
            disabled={isWatching}
            className="w-full py-3 rounded-xl bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-[#00f5ff]/20 transition-all disabled:opacity-50"
        >
            {isWatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tv className="w-4 h-4" />}
            {isWatching ? "Watching..." : label}
        </motion.button>
    );
}
