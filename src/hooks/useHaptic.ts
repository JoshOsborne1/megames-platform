"use client";

import { useCallback } from "react";

type HapticType = "selection" | "success" | "warning" | "error" | "soft" | "medium" | "heavy";

export function useHaptic() {
    const trigger = useCallback((type: HapticType = "selection") => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            switch (type) {
                case "selection":
                    navigator.vibrate(10);
                    break;
                case "soft":
                    navigator.vibrate(5);
                    break;
                case "medium":
                    navigator.vibrate(15);
                    break;
                case "heavy":
                    navigator.vibrate(20);
                    break;
                case "success":
                    navigator.vibrate([10, 30, 20]);
                    break;
                case "warning":
                    navigator.vibrate([30, 50, 10]);
                    break;
                case "error":
                    navigator.vibrate([50, 50, 50]);
                    break;
                default:
                    navigator.vibrate(10);
            }
        }
    }, []);

    return { trigger };
}
