"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHaptic } from "@/hooks/useHaptic";
import React from "react";

interface PremiumButtonProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "glass" | "ghost";
    className?: string;
    disabled?: boolean;
}

export function PremiumButton({
    children,
    onClick,
    variant = "primary",
    className,
    disabled = false,
    ...props
}: PremiumButtonProps) {
    const { trigger } = useHaptic();

    const handleClick = () => {
        if (disabled) {
            trigger("error");
            return;
        }
        trigger("medium");
        onClick?.();
    };

    const getVariantStyles = () => {
        switch (variant) {
            case "primary":
                return "bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white shadow-lg shadow-[#ff006e]/30";
            case "secondary":
                return "bg-white/10 text-white border border-white/10 hover:bg-white/20";
            case "glass":
                return "glass-card text-white hover:border-white/20";
            case "ghost":
                return "bg-transparent text-gray-400 hover:text-white hover:bg-white/5";
            default:
                return "";
        }
    };

    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
                "relative overflow-hidden cursor-pointer rounded-2xl p-4 font-display font-bold select-none touch-manipulation",
                "flex items-center justify-center gap-2",
                getVariantStyles(),
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            {...props}
        >
            {/* Sheen effect */}
            <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            {children}
        </motion.div>
    );
}
