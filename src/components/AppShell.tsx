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
    hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
    const [isFullscreen, setFullscreen] = useState(hideNav);
    const [headerTitle, setHeaderTitle] = useState("");
    const [showBackButton, setShowBackButton] = useState(false);

    const shouldHideNav = isFullscreen || hideNav;

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
            <div className="min-h-screen flex flex-col relative">
                {/* Animated Background */}
                <AnimatedBackground />

                {/* Minimal App Header */}
                {!shouldHideNav && <AppHeader title={headerTitle} showBack={showBackButton} />}

                {/* Main Content */}
                <main className={`flex-1 relative z-10 ${!shouldHideNav ? "pt-14 pb-20" : ""}`}>
                    {children}
                </main>

                {/* Room Banner - Shows when in active room */}
                <RoomBanner />

                {/* Bottom Navigation */}
                <BottomNav hidden={shouldHideNav} />
            </div>
        </AppShellContext.Provider>
    );
}

