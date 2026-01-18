"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a full implementation, you'd verify the session here
        // For now, we just show success after a brief delay
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [sessionId]);

    return (
        <AppShell>
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-4 border-[#FFD700] border-t-transparent animate-spin" />
                            <p className="text-white/60">Processing your purchase...</p>
                        </div>
                    ) : (
                        <>
                            {/* Success Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#39ff14] to-[#00f5ff] flex items-center justify-center"
                            >
                                <Check className="w-12 h-12 text-black" strokeWidth={3} />
                            </motion.div>

                            {/* Title */}
                            <h1 className="font-display font-bold text-3xl text-white mb-2">
                                Payment Successful!
                            </h1>
                            <p className="text-white/60 mb-8">
                                Thank you for your purchase. Your account has been upgraded.
                            </p>

                            {/* Features unlocked */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-[#FFD700]" />
                                    <span className="font-bold text-white">Features Unlocked</span>
                                </div>
                                <ul className="space-y-2 text-left text-sm text-white/70">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#39ff14]" />
                                        Extended player limits
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#39ff14]" />
                                        Full game content access
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#39ff14]" />
                                        Premium features enabled
                                    </li>
                                </ul>
                            </motion.div>

                            {/* CTA */}
                            <Link href="/games">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-[#FFD700] to-[#ff006e] text-black flex items-center justify-center gap-2"
                                >
                                    Start Playing
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>
        </AppShell>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
