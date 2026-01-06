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

export function useAppShell() {
    const context = useContext(AppShellContext);
    if (!context) {
        throw new Error("useAppShell must be used within AppShell");
    }
    return context;
}

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
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
            <div className="min-h-screen flex flex-col bg-[#0a0a14] relative">
                {/* Animated Background */}
                <AnimatedBackground />

                {/* Minimal App Header */}
                {!isFullscreen && <AppHeader title={headerTitle} showBack={showBackButton} />}

                {/* Main Content */}
                <main className={`flex-1 relative z-10 ${!isFullscreen ? "pt-14 pb-20" : ""}`}>
                    {children}
                </main>

                {/* Room Banner - Shows when in active room */}
                <RoomBanner />

                {/* Bottom Navigation */}
                <BottomNav hidden={isFullscreen} />
            </div>
        </AppShellContext.Provider>
    );
}
