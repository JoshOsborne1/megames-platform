"use client";

import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import { useEffect, useState } from "react";

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: string; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    // Generate snowflakes only on client side
    const flakes = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 10,
      size: Math.random() * 8 + 8,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ top: -20, left: flake.left, opacity: 0 }}
          animate={{ 
            top: "110%", 
            opacity: [0, 0.4, 0.4, 0],
            rotate: 360 
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
          className="absolute text-white"
        >
          <Snowflake size={flake.size} />
        </motion.div>
      ))}
    </div>
  );
}
