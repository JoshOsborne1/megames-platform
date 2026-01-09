"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { SUBSCRIPTION_PLANS, ONE_TIME_PASSES } from "@/lib/subscription";
import {
    Crown, Zap, Check, Sparkles, Users, Palette,
    Music, Layers, HelpCircle, Globe
} from "lucide-react";
import { toast } from "sonner";

// All PRO features with icons - compact version
const ALL_PRO_FEATURES = [
    { icon: Users, label: "10 Local Players", color: "#ff006e" },
    { icon: Globe, label: "10 Online Players", color: "#8338ec" },
    { icon: Layers, label: "500 Cards/Deck", color: "#00f5ff" },
    { icon: Music, label: "500 Lyrics", color: "#FF00FF" },
    { icon: Palette, label: "Unlimited Colours", color: "#00FFFF" },
    { icon: HelpCircle, label: "Quiz Packs", color: "#FFD700" },
];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<"pro" | "passes">("pro");
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(1); // Default to Monthly (highlighted)
    const [selectedPassIndex, setSelectedPassIndex] = useState(0);

    const handleSubscribe = (planId: string) => {
        toast.info("Connecting to secure checkout...");
    };

    const currentPlan = SUBSCRIPTION_PLANS[selectedPlanIndex];
    const currentPass = ONE_TIME_PASSES[selectedPassIndex];

    return (
        <AppShell>
            <div className="min-h-[calc(100vh-8rem)] pb-20 px-4 pt-4 max-w-md mx-auto flex flex-col">

                {/* Header - Compact */}
                <header className="text-center mb-3">
                    <h1 className="font-display font-bold text-lg uppercase tracking-wider text-white">Store</h1>
                </header>

                {/* Category Toggles - Compact */}
                <div className="mb-3">
                    <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 w-full">
                        <button
                            onClick={() => setSelectedCategory("pro")}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${selectedCategory === "pro"
                                ? "bg-[#FFD700] text-black shadow-lg"
                                : "text-white/50 hover:text-white"
                                }`}
                        >
                            <Crown className="w-3.5 h-3.5" />
                            GamePro
                        </button>
                        <button
                            onClick={() => setSelectedCategory("passes")}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${selectedCategory === "passes"
                                ? "bg-[#ff006e] text-white shadow-lg"
                                : "text-white/50 hover:text-white"
                                }`}
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Day Passes
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedCategory === "pro" ? (
                        <motion.div
                            key="pro"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Plan Card - Compact */}
                            <motion.div
                                key={currentPlan.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative bg-gradient-to-br from-[#1a142e] to-[#0d0a16] border border-[#FFD700]/30 rounded-2xl overflow-hidden"
                                style={{ boxShadow: "0 0 40px rgba(255, 215, 0, 0.1)" }}
                            >
                                {/* Header with price */}
                                <div className="p-4 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#ff006e] flex items-center justify-center">
                                                <Crown className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                                <h2 className="font-display font-bold text-lg text-white">GamePro</h2>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-display font-black text-2xl text-[#FFD700]">
                                                    £{currentPlan.price}
                                                </span>
                                                <span className="text-white/40 text-xs">/{currentPlan.period}</span>
                                            </div>
                                            {currentPlan.savings && (
                                                <span className="text-[#39ff14] text-[10px] font-bold">
                                                    {currentPlan.savings}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Period Selector - Inside card */}
                                <div className="px-4 py-3 border-b border-white/5">
                                    <div className="flex p-0.5 rounded-lg bg-white/5">
                                        {SUBSCRIPTION_PLANS.map((plan, index) => (
                                            <button
                                                key={plan.id}
                                                onClick={() => setSelectedPlanIndex(index)}
                                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${selectedPlanIndex === index
                                                    ? "bg-gradient-to-r from-[#FFD700] to-[#ff006e] text-black"
                                                    : "text-white/50 hover:text-white"
                                                    }`}
                                            >
                                                {plan.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Features Grid - Compact 2x3 */}
                                <div className="p-4 pt-3">
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {ALL_PRO_FEATURES.map((feature) => (
                                            <div
                                                key={feature.label}
                                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                                            >
                                                <feature.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: feature.color }} />
                                                <span className="text-white/70 text-[10px] font-medium truncate">{feature.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Exclusive perks - inline */}
                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                        <span className="text-[#FFD700] text-[9px] font-bold uppercase flex items-center gap-1">
                                            <Sparkles className="w-2.5 h-2.5" />
                                            Plus:
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700]">
                                            Monthly Quiz Packs
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD700]/10 text-[#FFD700]">
                                            50% off all packs
                                        </span>
                                    </div>

                                    {/* CTA Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSubscribe(currentPlan.id)}
                                        className="w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#FFD700] to-[#ff006e] text-black flex items-center justify-center gap-2"
                                        style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.25)" }}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Subscribe Now
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="passes"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Pass Card - Compact */}
                            <motion.div
                                key={currentPass.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative bg-gradient-to-br from-[#1a142e] to-[#0d0a16] border border-[#ff006e]/30 rounded-2xl overflow-hidden"
                                style={{ boxShadow: "0 0 40px rgba(255, 0, 110, 0.1)" }}
                            >
                                {/* Header with price */}
                                <div className="p-4 pb-3 border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="font-display font-bold text-lg text-white">{currentPass.label}</h2>
                                                <p className="text-white/40 text-[10px]">{currentPass.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-display font-black text-2xl text-[#ff006e]">
                                                    £{currentPass.price}
                                                </span>
                                            </div>
                                            <span className="text-white/40 text-[10px]">24 hours</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pass Type Selector - Inside card */}
                                <div className="px-4 py-3 border-b border-white/5">
                                    <div className="flex p-0.5 rounded-lg bg-white/5">
                                        {ONE_TIME_PASSES.map((pass, index) => (
                                            <button
                                                key={pass.id}
                                                onClick={() => setSelectedPassIndex(index)}
                                                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${selectedPassIndex === index
                                                    ? "bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white"
                                                    : "text-white/50 hover:text-white"
                                                    }`}
                                            >
                                                {pass.label.replace("GameNight - ", "")}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Features - Compact grid */}
                                <div className="p-4 pt-3">
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {currentPass.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                                            >
                                                <Check className="w-3 h-3 text-[#ff006e] flex-shrink-0" />
                                                <span className="text-white/70 text-[10px] font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Perfect for - inline */}
                                    <div className="p-2 rounded-lg bg-[#ff006e]/10 border border-[#ff006e]/20 mb-4">
                                        <p className="text-[#ff006e] text-[10px]">
                                            <span className="font-bold">Perfect for: </span>
                                            {currentPass.id === "gamenight_mega"
                                                ? "Large parties & house parties"
                                                : "Family game nights & casual gatherings"
                                            }
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSubscribe(currentPass.id)}
                                        className="w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white flex items-center justify-center gap-2"
                                        style={{ boxShadow: "0 0 20px rgba(255, 0, 110, 0.25)" }}
                                    >
                                        <Zap className="w-4 h-4" />
                                        Get Pass
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </AppShell>
    );
}
