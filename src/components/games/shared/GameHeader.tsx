"use client";

import { cn } from "@/lib/utils";
import { GameBackButton } from "./GameBackButton";

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBackClick?: () => void;
  backHref?: string;
  className?: string;
  align?: "left" | "center";
}

/**
 * Standardized game header component.
 * Provides consistent spacing, typography, and back button placement.
 */
export function GameHeader({
  title,
  subtitle,
  showBackButton = true,
  backButtonLabel = "Back",
  onBackClick,
  backHref,
  className,
  align = "center",
}: GameHeaderProps) {
  return (
    <div
      className={cn(
        "pt-4 mb-6",
        align === "center" && "text-center",
        className
      )}
    >
      {showBackButton && (
        <div className={cn("mb-3", align === "center" && "flex justify-center")}>
          <GameBackButton
            label={backButtonLabel}
            onClick={onBackClick}
            href={backHref}
          />
        </div>
      )}

      <h1 className="font-display font-bold text-2xl text-white tracking-tight leading-none mb-1">
        {title}
      </h1>

      {subtitle && (
        <p className="text-white/40 text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Compact header for tight spaces or secondary screens
 */
export function GameHeaderCompact({
  title,
  subtitle,
  showBackButton = true,
  className,
}: Omit<GameHeaderProps, 'backButtonLabel' | 'onBackClick' | 'backHref' | 'align'>) {
  return (
    <div className={cn("pt-4 mb-4", className)}>
      {showBackButton && (
        <div className="mb-2">
          <GameBackButton />
        </div>
      )}

      <h1 className="font-display font-bold text-xl text-white tracking-tight leading-none mb-0.5">
        {title}
      </h1>

      {subtitle && (
        <p className="text-white/40 text-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Arcade-style header for games listing
 */
export function ArcadeHeader({
  title,
  subtitle,
  className,
}: Pick<GameHeaderProps, 'title' | 'subtitle' | 'className'>) {
  return (
    <header className={cn("text-center mb-6 pt-6", className)}>
      <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs text-white/50 font-medium mt-1">
          {subtitle}
        </p>
      )}
    </header>
  );
}
