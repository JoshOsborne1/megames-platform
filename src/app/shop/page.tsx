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

// All PRO features with icons
const ALL_PRO_FEATURES = [
    { icon: Users, label: "Local Players", free: "4 players", pro: "10 players", color: "#ff006e" },
    { icon: Globe, label: "Multiplayer", free: "3 players", pro: "10 players", color: "#8338ec" },
    { icon: Layers, label: "Dynamic Decks", free: "100 cards", pro: "500 cards/deck", color: "#00f5ff" },
    { icon: Music, label: "Lyric Legends", free: "100 words", pro: "500 words", color: "#FF00FF" },
    { icon: Palette, label: "Shade Signals", free: "40 colours", pro: "Unlimited", color: "#00FFFF" },
    { icon: HelpCircle, label: "Quiz Quarter", free: "Coming Soon", pro: "3 Quiz Packs", color: "#FFD700", comingSoon: true },
];

const EXCLUSIVE_FEATURES = [
    "Quiz Packs change monthly",
    "50% off all full packs",
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
            <div className="min-h-screen pb-28 px-4 pt-6 max-w-md mx-auto flex flex-col">

                {/* Header */}
                <header className="text-center mb-5">
                    <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Store</h1>
                    <p className="text-xs text-white/50 font-medium">Upgrade your game night</p>
                </header>

                {/* Category Toggles */}
                <div className="mb-5">
                    <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 w-full">
                        <button
                            onClick={() => setSelectedCategory("pro")}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${selectedCategory === "pro"
                                ? "bg-[#FFD700] text-black shadow-lg"
                                : "text-white/50 hover:text-white"
                                }`}
                        >
                            <Crown className="w-3.5 h-3.5" />
                            GamePro
                        </button>
                        <button
                            onClick={() => setSelectedCategory("passes")}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${selectedCategory === "passes"
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
                            {/* Time Period Selector - Pill style */}
                            <div className="flex justify-center mb-5">
                                <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10">
                                    {SUBSCRIPTION_PLANS.map((plan, index) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => setSelectedPlanIndex(index)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all relative ${selectedPlanIndex === index
                                                ? "bg-gradient-to-r from-[#FFD700] to-[#ff006e] text-black"
                                                : "text-white/50 hover:text-white"
                                                }`}
                                        >
                                            {plan.label}
                                            {plan.savings && selectedPlanIndex === index && (
                                                <span className="absolute -top-2 -right-2 bg-[#39ff14] text-black text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                                    BEST
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Card - Single interactive card */}
                            <motion.div
                                key={currentPlan.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative bg-gradient-to-br from-[#1a142e] to-[#0d0a16] border border-[#FFD700]/30 rounded-3xl overflow-hidden shadow-2xl"
                                style={{ boxShadow: "0 0 60px rgba(255, 215, 0, 0.15)" }}
                            >
                                {/* Header */}
                                <div className="p-5 pb-4 border-b border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#ff006e] flex items-center justify-center shadow-lg">
                                                <Crown className="w-6 h-6 text-black" />
                                            </div>
                                            <div>
                                                <h2 className="font-display font-bold text-xl text-white">GamePro</h2>
                                                <p className="text-white/40 text-xs">{currentPlan.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price display */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display font-black text-4xl text-[#FFD700]">
                                            £{currentPlan.price}
                                        </span>
                                        <span className="text-white/40 text-sm">/{currentPlan.period}</span>
                                        {currentPlan.savings && (
                                            <span className="ml-2 bg-[#39ff14]/20 text-[#39ff14] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {currentPlan.savings}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Features Comparison */}
                                <div className="p-5">
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">What you get</p>

                                    <div className="space-y-2.5">
                                        {ALL_PRO_FEATURES.map((feature, index) => (
                                            <motion.div
                                                key={feature.label}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: `${feature.color}20` }}
                                                    >
                                                        <feature.icon className="w-4 h-4" style={{ color: feature.color }} />
                                                    </div>
                                                    <span className="text-white/80 text-sm font-medium">{feature.label}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/30 text-xs line-through">{feature.free}</span>
                                                    <span className="text-[#FFD700] text-xs font-bold">{feature.pro}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Exclusive Features */}
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-[#FFD700] text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3" />
                                            Pro Exclusives
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {EXCLUSIVE_FEATURES.map((feat) => (
                                                <span
                                                    key={feat}
                                                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] font-medium"
                                                >
                                                    {feat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="p-5 pt-0">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSubscribe(currentPlan.id)}
                                        className="w-full py-4 rounded-2xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-[#FFD700] to-[#ff006e] text-black shadow-xl flex items-center justify-center gap-2"
                                        style={{ boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)" }}
                                    >
                                        <Sparkles className="w-5 h-5" />
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
                            {/* Pass Type Selector */}
                            <div className="flex justify-center mb-5">
                                <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10">
                                    {ONE_TIME_PASSES.map((pass, index) => (
                                        <button
                                            key={pass.id}
                                            onClick={() => setSelectedPassIndex(index)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all relative ${selectedPassIndex === index
                                                ? "bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white"
                                                : "text-white/50 hover:text-white"
                                                }`}
                                        >
                                            {pass.label.replace("GameNight - ", "")}
                                            {pass.highlight && selectedPassIndex === index && (
                                                <span className="absolute -top-2 -right-2 bg-[#39ff14] text-black text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                                    BEST
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pass Card */}
                            <motion.div
                                key={currentPass.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative bg-gradient-to-br from-[#1a142e] to-[#0d0a16] border border-[#ff006e]/30 rounded-3xl overflow-hidden shadow-2xl"
                                style={{ boxShadow: "0 0 60px rgba(255, 0, 110, 0.15)" }}
                            >
                                {/* Header */}
                                <div className="p-5 pb-4 border-b border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center shadow-lg">
                                                <Zap className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="font-display font-bold text-xl text-white">{currentPass.label}</h2>
                                                <p className="text-white/40 text-xs">{currentPass.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price display */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display font-black text-4xl text-[#ff006e]">
                                            £{currentPass.price}
                                        </span>
                                        <span className="text-white/40 text-sm">/ 24 hours</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="p-5">
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-3">Included for 24 hours</p>

                                    <div className="space-y-2.5">
                                        {currentPass.features.map((feature, index) => (
                                            <motion.div
                                                key={feature}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-[#ff006e]/20 flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-3.5 h-3.5 text-[#ff006e]" />
                                                </div>
                                                <span className="text-white/80 text-sm">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Perfect for */}
                                    <div className="mt-4 p-3 rounded-xl bg-[#ff006e]/10 border border-[#ff006e]/20">
                                        <p className="text-[#ff006e] text-xs font-bold mb-1">Perfect for:</p>
                                        <p className="text-white/60 text-xs">
                                            {currentPass.id === "gamenight_mega"
                                                ? "Large parties, house parties, or big game nights with friends"
                                                : "Standard friend groups, family game nights, or casual gatherings"
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="p-5 pt-0">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSubscribe(currentPass.id)}
                                        className="w-full py-4 rounded-2xl font-display font-bold text-lg uppercase tracking-wider bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white shadow-xl flex items-center justify-center gap-2"
                                        style={{ boxShadow: "0 0 30px rgba(255, 0, 110, 0.3)" }}
                                    >
                                        <Zap className="w-5 h-5" />
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
