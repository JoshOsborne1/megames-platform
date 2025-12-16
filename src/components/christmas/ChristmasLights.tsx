"use client";

import { motion } from "framer-motion";

export function ChristmasLights() {
  const lights = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    color: ["#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff"][i % 5],
    left: (100 / 16) * (i + 1),
  }));

  return (
    <div className="fixed top-0 left-0 w-full pointer-events-none z-10">
      <svg width="100%" height="60" className="absolute top-0">
        <path
          d="M 0,20 Q 50,35 100,20 T 200,20 T 300,20 T 400,20 T 500,20 T 600,20 T 700,20 T 800,20 T 900,20 T 1000,20 T 1100,20 T 1200,20 T 1300,20 T 1400,20 T 1500,20"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          opacity="0.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      
      {lights.map((light, i) => (
        <motion.div
          key={light.id}
          className="absolute rounded-full"
          style={{
            left: `${light.left}%`,
            top: "20px",
            width: "12px",
            height: "16px",
            backgroundColor: light.color,
            boxShadow: `0 0 10px ${light.color}, 0 0 20px ${light.color}`,
            borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
