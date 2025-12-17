"use client";

import { motion } from "framer-motion";

export function WinterBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050510]">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#050510" />
            <stop offset="60%" stopColor="#0c0c25" />
            <stop offset="100%" stopColor="#1a1a4a" />
          </linearGradient>
          
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect fill="url(#skyGradient)" width="1440" height="900"/>

        {/* Moon */}
        <circle cx="1200" cy="150" r="100" fill="url(#moonGlow)" />
        <circle cx="1200" cy="150" r="40" fill="#f0f0ff" opacity="0.8" />
        
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 1440}
            cy={Math.random() * 500}
            r={Math.random() * 1.5}
            fill="white"
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Distant Mountains */}
        <g opacity="0.4">
          <path d="M-100 600 L200 350 L500 550 L800 300 L1100 500 L1540 320 L1540 900 L-100 900 Z" fill="#1a1a3a"/>
          {/* Snow caps */}
          <path d="M200 350 L250 400 L150 400 Z" fill="white" opacity="0.5" />
          <path d="M800 300 L870 380 L730 380 Z" fill="white" opacity="0.5" />
          <path d="M1540 320 L1450 380 L1540 450 Z" fill="white" opacity="0.5" />
        </g>

        {/* Midground Hills */}
        <path d="M-100 700 Q300 600 700 700 T1540 700 L1540 900 L-100 900 Z" fill="#ffffff" opacity="0.05"/>
        
        {/* Christmas Trees */}
        <g className="trees">
          {[
            { x: 150, y: 750, s: 1.2 },
            { x: 350, y: 820, s: 0.8 },
            { x: 1100, y: 780, s: 1.1 },
            { x: 1300, y: 850, s: 0.9 },
            { x: 600, y: 880, s: 0.7 },
            { x: 850, y: 840, s: 1.0 }
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              {/* Trunk */}
              <rect x="-10" y="0" width="20" height="40" fill="#2d1810" />
              {/* Leaves */}
              <path d="M0 -120 L-50 0 L50 0 Z" fill="#062d06" />
              <path d="M0 -100 L-60 20 L60 20 Z" fill="#083d08" />
              <path d="M0 -80 L-70 40 L70 40 Z" fill="#0a4d0a" />
              {/* Snow on tree */}
              <path d="M0 -120 L-10 -95 L10 -95 Z" fill="white" opacity="0.4" />
              <path d="M-30 -10 L-10 0 L10 0 L30 -10 Z" fill="white" opacity="0.3" />
              
              {/* Christmas Lights on Tree */}
              {[...Array(12)].map((_, li) => {
                const colors = ["#ff0000", "#00ff00", "#ffff00", "#00ffff", "#ff00ff"];
                const lx = (Math.random() - 0.5) * 80;
                const ly = -Math.random() * 100;
                return (
                  <motion.circle
                    key={li}
                    cx={lx}
                    cy={ly}
                    r="2"
                    fill={colors[li % colors.length]}
                    filter="url(#glow)"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                  />
                );
              })}
            </g>
          ))}
        </g>
        
        {/* Foreground Snowy Hills */}
        <path d="M-100 820 Q400 750 800 820 T1540 820 L1540 900 L-100 900 Z" fill="#ffffff" opacity="0.1"/>
        <path d="M-100 860 Q400 820 800 860 T1540 860 L1540 900 L-100 900 Z" fill="#ffffff" opacity="0.15"/>
      </svg>
    </div>
  );
}
