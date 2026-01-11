"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/context/RoomContext";
import { AppShellProvider } from "./AppShell";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <RoomProvider>
            <AppShellProvider>
                {children}
            </AppShellProvider>
        </RoomProvider>
    );
}
