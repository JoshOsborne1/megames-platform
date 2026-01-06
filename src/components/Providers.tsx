"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/context/RoomContext";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <RoomProvider>
            {children}
        </RoomProvider>
    );
}
