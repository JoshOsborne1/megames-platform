"use client";

import { motion } from "framer-motion";

interface SnowballExplosionProps {
  onComplete?: () => void;
}

export function SnowballExplosion({ onComplete }: SnowballExplosionProps) {
  const particles = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-visible">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationComplete={onComplete}
        className="w-32 h-32 bg-white rounded-full blur-xl"
      />
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: Math.random() * 2,
            opacity: 0,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white]"
        />
      ))}
      {particles.map((_, i) => (
        <motion.div
          key={`flake-${i}`}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            scale: Math.random() * 1.5,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.05 }}
          className="absolute w-2 h-2 bg-blue-100 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
}
