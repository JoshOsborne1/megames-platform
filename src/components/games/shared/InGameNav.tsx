"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, LayoutGrid, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface InGameNavProps {
    /** Game name to display in sidebar */
    gameName: string;
    /** Accent color for the game (default: #ff006e) */
    accentColor?: string;
    /** Icon to show for the current game */
    gameIcon?: React.ReactNode;
    /** Callback when user confirms navigation away */
    onConfirmLeave?: () => void;
    /** Whether to show confirmation dialog before leaving (default: true when game is active) */
    showConfirmation?: boolean;
}

export function InGameNav({
    gameName,
    accentColor = "#ff006e",
    gameIcon,
    onConfirmLeave,
    showConfirmation = true,
}: InGameNavProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

    const handleNavigate = (path: string) => {
        if (showConfirmation) {
            setConfirmTarget(path);
            setIsOpen(false);
        } else {
            onConfirmLeave?.();
            router.push(path);
        }
    };

    const confirmNavigation = () => {
        if (confirmTarget) {
            onConfirmLeave?.();
            router.push(confirmTarget);
        }
    };

    const navLinks = [
        { href: "/", label: "Home", icon: Home, color: "#00f5ff" },
        { href: "/lobby?mode=local", label: "All Games", icon: LayoutGrid, color: "#ff006e" },
    ];

    return (
        <>
            {/* Burger Button - Fixed position */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all shadow-lg"
                style={{ boxShadow: isOpen ? `0 0 20px ${accentColor}40` : undefined }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <Menu className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-72 bg-[#0a0015]/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
                        >
                            {/* Game Info Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    {gameIcon && (
                                        <div className="w-10 h-10" style={{ color: accentColor }}>
                                            {gameIcon}
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-[10px] font-pixel text-white/40 uppercase tracking-widest block">Now Playing</span>
                                        <h3 className="font-display font-bold text-white text-lg">{gameName}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 p-4 space-y-2">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.href}
                                        onClick={() => handleNavigate(link.href)}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                                    >
                                        <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: link.color }} />
                                        <span className="font-display font-bold text-white/80 group-hover:text-white">{link.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Close Button */}
                            <div className="p-4 border-t border-white/10">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/60 hover:text-white"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="font-display font-bold text-sm">Back to Game</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmTarget && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                             onClick={() => setConfirmTarget(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-100"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed inset-0 z-100 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-[#1a142e] border-2 border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto">
                                <h3 className="font-display font-black text-2xl text-white mb-3 text-center">Leave Game?</h3>
                                <p className="text-white/60 text-center mb-6 font-space">
                                    Your current progress will be lost. Are you sure?
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setConfirmTarget(null)}
                                        className="py-3 px-4 rounded-xl bg-white/10 text-white font-display font-bold hover:bg-white/20 transition-colors"
                                    >
                                        Stay
                                    </button>
                                    <button
                                        onClick={confirmNavigation}
                                        className="py-3 px-4 rounded-xl font-display font-bold text-white transition-colors"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        Leave
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
