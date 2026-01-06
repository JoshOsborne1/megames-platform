"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                <Link href="/games">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-br from-[#ff006e]/20 to-[#ff006e]/5 border border-[#ff006e]/30 rounded-xl p-4 h-full cursor-pointer hover:border-[#ff006e]/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#ff006e]/20 rounded-lg">
                                <Users className="w-5 h-5 text-[#ff006e]" />
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
                <Link href="/lobbies">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-br from-[#8338ec]/20 to-[#8338ec]/5 border border-[#8338ec]/30 rounded-xl p-4 h-full cursor-pointer hover:border-[#8338ec]/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#8338ec]/20 rounded-lg">
                                <Wifi className="w-5 h-5 text-[#8338ec]" />
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
