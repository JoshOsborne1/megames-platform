"use client";

import { motion } from "framer-motion";

export function SnowPile({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute -top-3 left-0 right-0 z-50 pointer-events-none ${className}`}>
      <svg
        width="100%"
        height="30"
        viewBox="0 0 400 30"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      >
        <defs>
          <linearGradient id="snowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Base snow layer */}
        <path
          d="M0,15 Q25,5 50,15 T100,15 T150,15 T200,15 T250,15 T300,15 T350,15 T400,15 L400,30 L0,30 Z"
          fill="url(#snowGrad)"
        />
        
        {/* Secondary layer for depth */}
        <path
          d="M0,18 Q20,10 40,18 T80,18 T120,18 T160,18 T200,18 T240,18 T280,18 T320,18 T360,18 T400,18 L400,30 L0,30 Z"
          fill="white"
          opacity="0.6"
        />

        {/* Small snow clumps */}
        <ellipse cx="30" cy="12" rx="12" ry="6" fill="url(#snowGrad)" />
        <ellipse cx="85" cy="10" rx="15" ry="8" fill="url(#snowGrad)" />
        <ellipse cx="140" cy="13" rx="10" ry="5" fill="url(#snowGrad)" />
        <ellipse cx="195" cy="11" rx="14" ry="7" fill="url(#snowGrad)" />
        <ellipse cx="255" cy="14" rx="11" ry="6" fill="url(#snowGrad)" />
        <ellipse cx="315" cy="11" rx="16" ry="8" fill="url(#snowGrad)" />
        <ellipse cx="375" cy="13" rx="12" ry="6" fill="url(#snowGrad)" />

        {/* Bright highlights */}
        <ellipse cx="30" cy="10" rx="6" ry="2" fill="white" opacity="0.8" />
        <ellipse cx="85" cy="8" rx="8" ry="3" fill="white" opacity="0.8" />
        <ellipse cx="195" cy="9" rx="7" ry="2" fill="white" opacity="0.8" />
        <ellipse cx="315" cy="9" rx="9" ry="3" fill="white" opacity="0.8" />
      </svg>
    </div>
  );
}
