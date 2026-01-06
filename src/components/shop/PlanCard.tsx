"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Star, Zap } from "lucide-react";
import { PricingTier } from "@/lib/subscription";

interface PlanCardProps {
    plan: PricingTier;
    onSelect: (planId: string) => void;
    variant?: "default" | "gold" | "neon";
}

export function PlanCard({ plan, onSelect, variant = "default" }: PlanCardProps) {
    const isGold = variant === "gold" || plan.highlight;
    const accentColor = isGold ? "#FFD700" : variant === "neon" ? "#ff006e" : "#00f5ff";

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative p-1 rounded-[2rem] h-full ${isGold ? "bg-gradient-to-br from-[#FFD700]/50 via-[#ff006e]/50 to-[#8338ec]/50" :
                    "bg-white/10"
                }`}
        >
            <div className="bg-[#16162a]/95 backdrop-blur-xl h-full rounded-[1.8rem] p-6 lg:p-8 flex flex-col relative overflow-hidden">
                {/* Highlight Badge */}
                {plan.highlight && (
                    <div className="absolute top-0 right-0 p-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="bg-[#FFD700] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                        >
                            Best Value
                        </motion.div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <h3 className="font-display font-bold text-2xl text-white mb-2">{plan.label}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-display font-bold" style={{ color: accentColor }}>
                            £{plan.price}
                        </span>
                        <span className="text-white/50 text-sm font-space">
                            /{plan.period}
                        </span>
                    </div>
                    {plan.savings && (
                        <span className="text-[#39ff14] text-xs font-bold uppercase tracking-wider mt-2 block">
                            {plan.savings}
                        </span>
                    )}
                    <p className="text-white/50 text-xs mt-2 min-h-[40px]">
                        {plan.description}
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-6" />

                {/* Features */}
                <div className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1 rounded-full bg-${isGold ? 'yellow-500' : 'white'}/10`}>
                                <Check className="w-3 h-3" style={{ color: accentColor }} />
                            </div>
                            <span className="text-sm text-white/80 leading-tight">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <button
                    onClick={() => onSelect(plan.id)}
                    className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
                    style={{
                        background: isGold
                            ? `linear-gradient(135deg, ${accentColor}, #ff006e)`
                            : "rgba(255, 255, 255, 0.1)",
                        color: isGold ? "black" : "white",
                        border: isGold ? "none" : "1px solid rgba(255,255,255,0.1)"
                    }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isGold ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5 text-[#00f5ff]" />}
                        Select
                    </span>
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
