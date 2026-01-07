"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  players: string;
  slogan?: string;
  color?: string;
  className?: string;
}

export function GameCard({ id, name, description, icon, players, slogan, color, className }: GameCardProps) {
  return (
    <Link href={`/games/${id}`} className={cn("block h-full group", className)}>
      <motion.div
        className="glass-card h-full p-6 rounded-3xl relative overflow-hidden flex flex-col"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow Background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              border: `1px solid ${color}40`
            }}
          >
            <div className="w-6 h-6" style={{ color: color }}>{icon}</div>
          </div>
          <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-auto relative z-10">
          <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-glow transition-all">
            {name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
            {description}
          </p>

          {/* Player count with icon + Slogan */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
              <span>{players}</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            {slogan && (
              <span className="text-[10px] uppercase tracking-wider font-medium italic" style={{ color: color }}>
                {slogan}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

