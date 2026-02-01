"use client";

import { cn } from "@/lib/utils";

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean;
  noPadding?: boolean;
}

/**
 * Standardized game layout wrapper that handles mobile-safe padding
 * and removes unnecessary empty space.
 */
export function GameLayout({
  children,
  className,
  showBottomNav = false,
  noPadding = false,
}: GameLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen text-white",
        // Mobile-safe bottom padding to account for bottom navigation
        showBottomNav && "pb-[calc(5rem+env(safe-area-inset-bottom))]",
        // Standard horizontal padding
        !noPadding && "px-4",
        className
      )}
    >
      <div className="max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
}

/**
 * Game layout with constrained height - use for game setup screens
 * that shouldn't scroll unnecessarily.
 */
export function GameSetupLayout({
  children,
  className,
  showBottomNav = false,
}: Omit<GameLayoutProps, 'noPadding'>) {
  return (
    <div
      className={cn(
        "min-h-screen text-white flex flex-col",
        showBottomNav && "pb-[calc(5rem+env(safe-area-inset-bottom))]",
        className
      )}
    >
      <div className="flex-1 flex flex-col px-4 max-w-lg mx-auto w-full">
        {children}
      </div>
    </div>
  );
}

/**
 * Content area for game setup screens with proper scrolling
 */
export function GameContent({
  children,
  className,
  scrollable = true,
}: {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1",
        scrollable && "overflow-y-auto",
        // Remove fixed min-height constraints that cause empty space
        "min-h-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Action bar container for bottom-fixed elements
 * Properly handles safe areas on mobile
 */
export function GameActionBar({
  children,
  className,
  visible = true,
}: {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "pb-[calc(0.5rem+env(safe-area-inset-bottom))]",
        "px-4",
        className
      )}
    >
      <div className="max-w-xs mx-auto">
        {children}
      </div>
    </div>
  );
}
