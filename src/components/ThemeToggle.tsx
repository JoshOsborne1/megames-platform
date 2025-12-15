"use client";

import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 flex items-center p-1 cursor-pointer hover:scale-110 transition-transform"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg"
        initial={false}
        animate={{
          x: theme === "dark" ? 0 : 28,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center"
          initial={false}
          animate={{
            rotate: theme === "dark" ? 0 : 180,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          {theme === "dark" ? (
            <FiMoon className="w-3 h-3 text-white" />
          ) : (
            <FiSun className="w-3 h-3 text-white" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
