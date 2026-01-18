"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus, Smartphone } from "lucide-react";

export function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

    useEffect(() => {
        // Check if already in standalone mode (PWA)
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

        // Check if dismissed before
        const dismissed = localStorage.getItem("install-prompt-dismissed");
        const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
        const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

        // Show again after 7 days
        if (isStandalone || (dismissed && daysSinceDismiss < 7)) {
            return;
        }

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
        setIsIOS(iOS);

        // For Android/Chrome - listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        // For iOS - show custom prompt after slight delay
        if (iOS) {
            const timer = setTimeout(() => setShowPrompt(true), 2000);
            return () => {
                clearTimeout(timer);
                window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            };
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("install-prompt-dismissed", Date.now().toString());
    };

    const handleInstall = async () => {
        if (deferredPrompt && "prompt" in (deferredPrompt as BeforeInstallPromptEvent)) {
            const promptEvent = deferredPrompt as BeforeInstallPromptEvent;
            promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            if (outcome === "accepted") {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
            >
                <div className="bg-[#1a142e] border border-[#8338ec]/40 rounded-2xl p-4 shadow-2xl"
                    style={{ boxShadow: "0 0 40px rgba(131, 56, 236, 0.2)" }}
                >
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8338ec] to-[#ff006e] flex items-center justify-center shrink-0">
                            <Smartphone className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold text-white text-sm mb-1">
                                Add to Home Screen
                            </h3>

                            {isIOS ? (
                                <div className="text-white/60 text-xs space-y-1">
                                    <p className="flex items-center gap-1.5">
                                        <span>1. Tap</span>
                                        <Share className="w-3.5 h-3.5 text-[#00f5ff]" />
                                        <span>Share</span>
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <span>2. Tap</span>
                                        <Plus className="w-3.5 h-3.5 text-[#00f5ff]" />
                                        <span>Add to Home Screen</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-white/60 text-xs">
                                    Install PartyPack for quick access and the best experience!
                                </p>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Install button for Android */}
                    {!isIOS && deferredPrompt && (
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleInstall}
                            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-[#8338ec] to-[#ff006e] text-white font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Install App
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
