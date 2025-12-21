"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme] = useState<"dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force dark mode
    document.documentElement.classList.remove("light");
    localStorage.removeItem("megames-theme");
  }, []);

  const toggleTheme = () => {
    // No-op
  };

  return { theme, toggleTheme, mounted };
}
