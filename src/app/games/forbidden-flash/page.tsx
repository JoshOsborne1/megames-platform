"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ForbiddenFlashHub } from "@/components/games/forbidden-flash/ForbiddenFlashHub";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForbiddenFlashPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a14] overflow-x-hidden">
      <Header />
      
      <main className="flex-1 pt-24 pb-20 relative">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-[#ff006e] rounded-full filter blur-[150px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-[#00f5ff] rounded-full filter blur-[150px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <Link 
              href="/"
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors font-space text-sm uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Arcade
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="font-pixel text-[10px] text-white/70 uppercase">Local Party Mode</span>
            </div>
          </div>

          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display font-black text-6xl md:text-8xl text-white mb-4 tracking-tighter uppercase italic"
            >
              Forbidden <span className="text-[#00f5ff]">Flash</span>
            </motion.h1>
            <p className="text-white/40 font-space text-lg md:text-xl max-w-2xl mx-auto uppercase tracking-widest leading-loose">
              Describe the word, ignore the forbidden, race against the clock.
            </p>
          </div>

          <ForbiddenFlashHub />
        </div>
      </main>

      <Footer />
    </div>
  );
}
