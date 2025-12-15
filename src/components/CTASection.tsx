"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff006e] rounded-full filter blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-[#8338ec] rounded-full filter blur-[160px]"
        />
      </div>

      <div className="absolute inset-0 scanline opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-tight px-4"
          >
            <span className="block glitch">READY TO</span>
            <span className="block text-gradient-neon">DOMINATE?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/80 mb-8 md:mb-12 max-w-3xl mx-auto font-space font-medium leading-relaxed px-4"
          >
            Create your free account in{" "}
            <span className="text-[#39ff14] font-bold drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
              seconds
            </span>{" "}
            and start playing your favorite games with friends online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto relative font-display font-black text-lg md:text-xl px-10 md:px-12 py-6 md:py-8 rounded-2xl bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] text-white overflow-hidden group pulse-glow touch-manipulation"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] via-[#fb00ff] to-[#ff006e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-2 md:gap-3 justify-center">
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                    SIGN UP FREE
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </span>
                </Button>
              </motion.div>
            </Link>

            <Link href="/games" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-3 border-[#00f5ff] text-[#00f5ff] hover:bg-[#00f5ff]/20 font-display font-black text-lg md:text-xl px-10 md:px-12 py-6 md:py-8 rounded-2xl neon-glow-cyan backdrop-blur-sm touch-manipulation"
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                  BROWSE GAMES
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/50 px-4"
          >
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
              <span className="text-xs md:text-sm font-display font-bold">NO CREDIT CARD</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
              <span className="text-xs md:text-sm font-display font-bold">FREE FOREVER</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff006e] animate-pulse" />
              <span className="text-xs md:text-sm font-display font-bold">INSTANT ACCESS</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent" />
    </section>
  );
}