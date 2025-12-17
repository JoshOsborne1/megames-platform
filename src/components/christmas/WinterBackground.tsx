"use client";

import { motion } from "framer-motion";

export function WinterBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#050510]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a20] to-[#1a1a3a] opacity-50" />
    </div>
  );
}
