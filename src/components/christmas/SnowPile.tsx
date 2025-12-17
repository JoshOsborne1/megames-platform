"use client";

import { motion } from "framer-motion";

export function SnowPile({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-[110%] pointer-events-none z-[60] ${className}`}>
      <svg 
        viewBox="0 0 200 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
      >
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          d="M0 40C0 40 10 25 30 25C50 25 60 35 80 35C100 35 110 20 130 20C150 20 160 30 180 30C200 30 200 40 200 40H0Z"
          fill="white"
        />
        <path
          d="M20 40C20 40 30 30 50 30C70 30 80 38 100 38C120 38 130 25 150 25C170 25 180 35 190 35"
          stroke="#f0f4f8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Sparkles */}
        <motion.circle
          cx="40" cy="30" r="1" fill="#fff"
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="120" cy="25" r="1.2" fill="#fff"
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        />
        <motion.circle
          cx="160" cy="28" r="0.8" fill="#fff"
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
      </svg>
    </div>
  );
}
