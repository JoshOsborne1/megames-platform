"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

export function Snowflakes() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const snowflakes = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: (Math.sin(i * 0.5) + 1) * 2 + 2,
    left: (i * 17.3) % 100,
    delay: (i * 0.3) % 5,
    duration: (i * 0.7) % 10 + 15,
    opacity: (Math.cos(i * 0.4) + 1) * 0.3 + 0.3,
  })), []);
  
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            width: flake.size,
            height: flake.size,
            left: `${flake.left}%`,
            top: "-10px",
            opacity: flake.opacity,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(flake.id) * 100, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
