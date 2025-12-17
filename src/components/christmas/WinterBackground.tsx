"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function WinterBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a1a2f]">
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a2f] via-[#162a44] to-[#2c4c70]" />

      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ opacity: Math.random() }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute top-[10%] right-[15%] w-32 h-32 rounded-full bg-[#fefcd7] shadow-[0_0_50px_rgba(254,252,215,0.4)]">
        <div className="absolute top-4 left-6 w-6 h-6 rounded-full bg-black/5" />
        <div className="absolute top-12 left-12 w-8 h-8 rounded-full bg-black/5" />
        <div className="absolute top-20 left-6 w-4 h-4 rounded-full bg-black/5" />
      </div>

      {/* Santa Sleigh */}
      <motion.div
        initial={{ x: "-20%", y: "20%", opacity: 0 }}
        animate={{
          x: "120%",
          y: "15%",
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="absolute z-10"
      >
        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 30C10 30 20 35 40 35C60 35 70 30 70 30L75 25H30L10 30Z" fill="#c41e3a" />
          <path d="M70 30L80 20H90L85 30H70Z" fill="#c41e3a" />
          <circle cx="25" cy="20" r="8" fill="#ffffff" /> {/* Santa head */}
          <rect x="22" y="15" width="6" height="4" fill="#ffccaa" /> {/* Santa face */}
          <path d="M22 15L25 10L28 15H22Z" fill="#c41e3a" /> {/* Santa hat */}
          {/* Reindeers */}
          <circle cx="50" cy="25" r="4" fill="#8b4513" />
          <circle cx="65" cy="25" r="4" fill="#8b4513" />
          <circle cx="80" cy="25" r="4" fill="#8b4513" />
        </svg>
      </motion.div>

      {/* Distant Mountains */}
      <svg className="absolute bottom-0 w-full h-[40%] opacity-40" preserveAspectRatio="none" viewBox="0 0 1000 400">
        <path d="M0 400L200 150L400 350L600 100L800 300L1000 400H0Z" fill="#1a365d" />
      </svg>

      {/* Middle Hills */}
      <svg className="absolute bottom-0 w-full h-[30%] opacity-60" preserveAspectRatio="none" viewBox="0 0 1000 300">
        <path d="M0 300C200 200 400 350 600 220C800 100 1000 300 1000 300V300H0Z" fill="#2d4a6d" />
      </svg>

      {/* Front Snow Hills */}
      <svg className="absolute bottom-0 w-full h-[20%]" preserveAspectRatio="none" viewBox="0 0 1000 200">
        <path d="M0 200C150 150 350 180 500 130C650 80 850 160 1000 120V200H0Z" fill="#ffffff" />
        <path d="M0 200C200 180 400 220 600 170C800 120 1000 180 1000 180V200H0Z" fill="#f0f4f8" />
      </svg>

      {/* Christmas Trees */}
      <div className="absolute bottom-[5%] left-[5%] flex gap-8 items-end">
        <Tree size={120} lights={["#ff0000", "#00ff00", "#ffff00", "#0000ff"]} />
        <Tree size={80} lights={["#ffff00", "#ff00ff", "#00ffff"]} delay={1} />
      </div>

      <div className="absolute bottom-[8%] right-[10%] flex gap-12 items-end">
        <Tree size={100} lights={["#ff0000", "#ffff00", "#00ff00"]} delay={0.5} />
        <Tree size={140} lights={["#ffffff", "#ff0000", "#00ff00", "#0000ff"]} delay={1.5} />
      </div>

      {/* Snowfall Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`snow-${i}`}
            className="absolute bg-white rounded-full opacity-70"
            initial={{
              top: -10,
              left: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
            }}
            animate={{
              top: "105%",
              left: `${(Math.random() - 0.5) * 20 + (i % 10) * 10}%`,
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Tree({ size, lights, delay = 0 }: { size: number; lights: string[]; delay?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L15 110H85L50 10Z" fill="#0f4d19" />
        <path d="M50 30L25 100H75L50 30Z" fill="#1a6326" />
        <path d="M50 10L35 60H65L50 10Z" fill="#2d8a3c" />
        <rect x="45" y="110" width="10" height="10" fill="#3e2723" />
      </svg>
      {/* Lights */}
      {lights.map((color, i) => (
        <motion.div
          key={`light-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            delay: delay + i * 0.2,
          }}
          style={{
            color,
            backgroundColor: color,
            top: `${20 + Math.random() * 70}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  );
}
