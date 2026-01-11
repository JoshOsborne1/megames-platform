"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { AppHeader } from "./AppHeader";
import { AnimatedBackground } from "./AnimatedBackground";
import { RoomBanner } from "./RoomBanner";

interface AppShellContextType {
    isFullscreen: boolean;
    setFullscreen: (value: boolean) => void;
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
    showBackButton: boolean;
    setShowBackButton: (show: boolean) => void;
}

const AppShellContext = createContext<AppShellContextType | undefined>(undefined);

// Safe hook that returns no-ops when outside provider (for standalone game pages)
export function useAppShell(): AppShellContextType {
    const context = useContext(AppShellContext);
    if (!context) {
        // Return no-op functions for pages that don't use AppShell
        return {
            isFullscreen: true,
            setFullscreen: () => { },
            headerTitle: "",
            setHeaderTitle: () => { },
            showBackButton: false,
            setShowBackButton: () => { },
        };
    }
    return context;
}

// Standalone provider for use in global Providers
export function AppShellProvider({ children }: { children: ReactNode }) {
    const [isFullscreen, setFullscreen] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("");
    const [showBackButton, setShowBackButton] = useState(false);

    return (
        <AppShellContext.Provider
            value={{
                isFullscreen,
                setFullscreen,
                headerTitle,
                setHeaderTitle,
                showBackButton,
                setShowBackButton,
            }}
        >
            {children}
        </AppShellContext.Provider>
    );
}

interface AppShellProps {
    children: ReactNode;
    hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
    const { isFullscreen } = useAppShell();

    const shouldHideNav = isFullscreen || hideNav;

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Minimal App Header */}
            {!shouldHideNav && <AppHeader title="" showBack={false} />}

            {/* Main Content */}
            <main className={`flex-1 relative z-10 ${!shouldHideNav ? "pt-14 pb-20" : ""}`}>
                {children}
            </main>

            {/* Room Banner - Shows when in active room */}
            <RoomBanner />

            {/* Bottom Navigation */}
            <BottomNav hidden={shouldHideNav} />
        </div>
    );
}
