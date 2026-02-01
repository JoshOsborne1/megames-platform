"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

interface GameBackButtonProps {
  label?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}

/**
 * Standardized back button for game screens.
 * Uses router.back() by default to return to previous page,
 * or navigates to specific href if provided.
 */
export function GameBackButton({
  label = "Back",
  className,
  onClick,
  href,
}: GameBackButtonProps) {
  const router = useRouter();
  const { trigger } = useHaptic();

  const handleClick = () => {
    trigger();
    
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group inline-flex items-center gap-1.5",
        "transition-colors duration-200",
        className
      )}
    >
      <ChevronLeft className="w-3 h-3 text-white/30 group-hover:text-white transition-colors" />
      <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
        {label}
      </span>
    </button>
  );
}

/**
 * Compact version for tight spaces
 */
export function GameBackButtonCompact({
  className,
  onClick,
  href,
}: Omit<GameBackButtonProps, 'label'>) {
  const router = useRouter();
  const { trigger } = useHaptic();

  const handleClick = () => {
    trigger();
    
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-8 h-8 rounded-lg",
        "bg-white/5 border border-white/10",
        "flex items-center justify-center",
        "text-white/50 hover:text-white hover:bg-white/10",
        "transition-all duration-200",
        className
      )}
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
}
