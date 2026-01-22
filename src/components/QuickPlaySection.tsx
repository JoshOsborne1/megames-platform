"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Wifi } from "lucide-react";

export function QuickPlaySection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
        >
            <h2 className="font-display text-lg font-bold text-white mb-3">
                Quick Play
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {/* Local Play */}
                <Link href="/lobby?mode=local">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="bg-linear-to-br from-neon-pink/20 to-neon-pink/5 border border-neon-pink/30 rounded-xl p-4 h-full cursor-pointer hover:border-neon-pink/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-neon-pink/20 rounded-lg">
                                <Users className="w-5 h-5 text-neon-pink" />
                            </div>
                            <span className="font-display font-bold text-white">
                                Play Local
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Pass & play on one device
                        </p>
                    </motion.div>
                </Link>

                {/* Multiplayer */}
                <Link href="/multiplayer">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="bg-linear-to-br from-neon-purple/20 to-neon-purple/5 border border-neon-purple/30 rounded-xl p-4 h-full cursor-pointer hover:border-neon-purple/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-neon-purple/20 rounded-lg">
                                <Wifi className="w-5 h-5 text-neon-purple" />
                            </div>
                            <span className="font-display font-bold text-white">
                                Create Lobby
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Play with friends online
                        </p>
                    </motion.div>
                </Link>
            </div>
        </motion.div>
    );
}
