"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PlanCard } from "@/components/shop/PlanCard";
import { SUBSCRIPTION_PLANS, ONE_TIME_PASSES } from "@/lib/subscription";
import { Crown, Tv, ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState<"pro" | "passes">("pro");
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Reset scroll when category changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            setActiveIndex(0);
        }
    }, [selectedCategory]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const itemWidth = container.firstElementChild?.clientWidth || container.clientWidth;
            const newIndex = Math.round(container.scrollLeft / itemWidth);
            setActiveIndex(newIndex);
        }
    };

    const handleSelectPlan = (planId: string) => {
        toast.info("Connecting to secure checkout...");
    };

    const handleWatchAd = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Watching Ad...',
                success: 'Reward Granted: +1 Lobby Slot!',
                error: 'Ad failed to load',
            }
        );
    };

    const items = selectedCategory === "pro" ? SUBSCRIPTION_PLANS : ONE_TIME_PASSES;
    const totalItems = items.length + 1; // +1 for info card

    return (
        <AppShell>
            {/* Main Container - Adjusted to match Home Page exact dimensions */}
            <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto flex flex-col">

                {/* Header - Matching Home Page typography */}
                <header className="text-center mb-6">
                    <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Store</h1>
                    <p className="text-xs text-white/50 font-medium">Upgrade your game night</p>
                </header>

                {/* Category Toggles */}
                <div className="mb-6">
                    <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 w-full">
                        <button
                            onClick={() => setSelectedCategory("pro")}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === "pro"
                                    ? "bg-[#FFD700] text-black shadow-lg"
                                    : "text-white/50 hover:text-white"
                                }`}
                        >
                            GamePro
                        </button>
                        <button
                            onClick={() => setSelectedCategory("passes")}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === "passes"
                                    ? "bg-[#ff006e] text-white shadow-lg"
                                    : "text-white/50 hover:text-white"
                                }`}
                        >
                            Day Passes
                        </button>
                    </div>
                </div>

                {/* Horizontal Carousel */}
                <div className="flex-1 w-full relative">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {/* INFO CARD (Index 0) */}
                        <div className="snap-center w-[90%] flex-shrink-0 h-[420px]">
                            <div className={`h-full p-8 rounded-[2rem] border flex flex-col justify-center items-center text-center transition-all ${selectedCategory === "pro"
                                    ? "bg-[#FFD700]/10 border-[#FFD700]/20"
                                    : "bg-[#ff006e]/10 border-[#ff006e]/20"
                                }`}>
                                <div className={`mb-6 p-4 rounded-full ${selectedCategory === "pro" ? "bg-[#FFD700]/20" : "bg-[#ff006e]/20"
                                    }`}>
                                    {selectedCategory === "pro" ? (
                                        <Crown className={`w-10 h-10 ${selectedCategory === "pro" ? "text-[#FFD700]" : "text-[#ff006e]"}`} />
                                    ) : (
                                        <Zap className={`w-10 h-10 ${selectedCategory === "pro" ? "text-[#FFD700]" : "text-[#ff006e]"}`} />
                                    )}
                                </div>
                                <h3 className={`font-display font-bold text-2xl mb-4 ${selectedCategory === "pro" ? "text-[#FFD700]" : "text-[#ff006e]"
                                    }`}>
                                    {selectedCategory === "pro" ? "Why Go Pro?" : "Instant Access"}
                                </h3>
                                <p className="text-white/70 font-medium leading-relaxed max-w-[260px] text-sm">
                                    {selectedCategory === "pro"
                                        ? "Unlock 8-player lobbies, exclusive monthly decks, and massive content packs for all games."
                                        : "Perfect for parties! Get full access to everything for 24 hours. No commitment."
                                    }
                                </p>
                            </div>
                        </div>

                        {/* PLAN CARDS */}
                        {items.map((plan, index) => (
                            <div
                                key={plan.id}
                                className="snap-center w-[90%] flex-shrink-0 h-[420px]"
                            >
                                <PlanCard
                                    plan={plan}
                                    onSelect={handleSelectPlan}
                                    variant={selectedCategory === "pro" ? "gold" : "neon"}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalItems }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex
                                        ? (selectedCategory === "pro" ? "bg-[#FFD700] w-4" : "bg-[#ff006e] w-4")
                                        : "bg-white/20"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6">
                    <button
                        onClick={handleWatchAd}
                        className="w-full relative group overflow-hidden rounded-2xl bg-[#00f5ff]/5 border border-[#00f5ff]/20 p-px"
                    >
                        <div className="absolute inset-0 bg-[#00f5ff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <div className="relative p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#00f5ff]/20 text-[#00f5ff]">
                                    <Tv className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-[#00f5ff] text-sm">Watch & Win</h4>
                                    <p className="text-[10px] text-white/50">Get free rewards</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#00f5ff]" />
                        </div>
                    </button>
                </div>

            </div>
        </AppShell>
    );
}
