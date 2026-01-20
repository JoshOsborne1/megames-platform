"use client";

import { motion } from "framer-motion";
import { Crown, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING, QUIZPRO_BENEFITS } from "@/lib/subscription";
import Link from "next/link";

interface QuizProBannerProps {
    compact?: boolean;
}

export function QuizProBanner({ compact = false }: QuizProBannerProps) {
    if (compact) {
        return (
            <Link href="/shop" className="block">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <div
                        className="bg-linear-to-r from-[#FFD700]/20 to-neon-pink/20 border border-[#FFD700]/30 rounded-xl p-4 cursor-pointer hover:border-[#FFD700]/50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#FFD700]/20 rounded-lg">
                                    <Crown className="w-5 h-5 text-[#FFD700]" />
                                </div>
                                <div>
                                    <span className="font-display font-bold text-white block">
                                        PartyPro
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        Unlock all content
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[#FFD700] font-bold">
                                    {PRICING.yearly.label}
                                </span>
                                <span className="text-[#39ff14] text-xs block">
                                    {PRICING.yearly.savings}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    }

    return (
        <Link href="/shop" className="block">
            <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
        >
            <div className="bg-linear-to-br from-[#1a0f2e] to-[#0a0015] border border-[#FFD700]/30 rounded-2xl p-6 relative overflow-hidden">
                {/* Sparkle decoration */}
                <div className="absolute top-4 right-4 text-[#FFD700]/20">
                    <Sparkles className="w-24 h-24" />
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-[#FFD700]/20 rounded-xl">
                        <Crown className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <div>
                        <h2 className="font-display text-2xl font-bold text-white">
                            PartyPro
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Unlock the full experience
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                    {QUIZPRO_BENEFITS.slice(0, 4).map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                            <Check className="w-4 h-4 text-[#39ff14]" />
                            <span>{benefit.text}</span>
                        </div>
                    ))}
                    <div className="text-gray-500 text-sm pl-6">
                        + more benefits...
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-white font-bold">£2.99</div>
                        <div className="text-gray-500 text-xs">weekly</div>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-white font-bold">£7.99</div>
                        <div className="text-gray-500 text-xs">monthly</div>
                    </div>
                    <div className="text-center p-2 bg-[#FFD700]/10 rounded-lg border border-[#FFD700]/30 relative">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#39ff14] text-black text-[10px] font-bold rounded-full">
                            BEST
                        </div>
                        <div className="text-[#FFD700] font-bold">£18.99</div>
                        <div className="text-gray-500 text-xs">yearly</div>
                    </div>
                </div>

                <Button
                    className="w-full bg-linear-to-r from-[#FFD700] to-neon-pink text-black font-bold py-6 text-lg"
                >
                    <Crown className="w-5 h-5 mr-2" />
                    Get PartyPro
                </Button>
            </div>
            </motion.div>
        </Link>
    );
}
