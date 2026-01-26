"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRoom } from "@/context/RoomContext";
import { useRouter, usePathname } from "next/navigation";
import { Users, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function RoomBanner() {
    const { room, leaveRoom } = useRoom();
    const router = useRouter();
    const pathname = usePathname();

    // Don't show on multiplayer page or game pages (games handle their own UI)
    const hideOnPaths = ["/multiplayer", "/lobby", "/games"];
    const shouldHide = hideOnPaths.some(p => pathname.startsWith(p));

    if (!room.isActive || shouldHide) return null;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(room.roomCode);
        toast.success("Code copied!");
    };

    const handleLeave = (e: React.MouseEvent) => {
        e.stopPropagation();
        leaveRoom();
        toast.success("Left room");
    };

    const handleGoToRoom = () => {
        router.push("/multiplayer");
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-24 left-3 right-3 z-40 max-w-sm mx-auto"
            >
                <div
                    onClick={handleGoToRoom}
                    className="bg-[#0a0015]/95 backdrop-blur-xl border border-neon-purple/30 rounded-xl px-3 py-2.5 shadow-xl cursor-pointer flex items-center gap-3"
                    style={{ boxShadow: '0 0 20px rgba(131, 56, 236, 0.2)' }}
                >
                    {/* Room Info */}
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="text-[9px] font-bold text-neon-purple uppercase tracking-wide shrink-0">
                            {room.isHost ? "HOST" : "ROOM"}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="font-mono font-bold text-white text-xs bg-white/10 px-1.5 py-0.5 rounded hover:bg-white/20"
                        >
                            {room.roomCode}
                        </button>
                        {room.selectedGame && (
                            <>
                                <span className="text-white/20">•</span>
                                <room.selectedGame.icon className="w-3.5 h-3.5 shrink-0" style={{ color: room.selectedGame.color }} />
                                <span className="text-white/70 text-xs truncate">{room.selectedGame.name}</span>
                            </>
                        )}
                        <span className="text-white/20">•</span>
                        <div className="flex items-center gap-1 text-white/40 text-xs shrink-0">
                            <Users className="w-3 h-3" />
                            <span>{room.players.length}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={handleLeave}
                            className="p-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="p-1.5 rounded-md bg-neon-purple/20 text-neon-purple">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
