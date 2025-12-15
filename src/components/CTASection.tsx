"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
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
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight"
          >
            <span className="block glitch">READY TO</span>
            <span className="block text-gradient-neon">DOMINATE?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-3xl text-white/80 mb-12 max-w-3xl mx-auto font-space font-medium leading-relaxed"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -2, 2, -2, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="relative font-display font-black text-xl px-12 py-8 rounded-2xl bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] text-white overflow-hidden group pulse-glow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] via-[#fb00ff] to-[#ff006e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-3">
                    <Play className="w-6 h-6 fill-white" />
                    SIGN UP FREE
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </Button>
              </motion.div>
            </Link>

            <Link href="/games">
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-[#00f5ff] text-[#00f5ff] hover:bg-[#00f5ff]/20 font-display font-black text-xl px-12 py-8 rounded-2xl neon-glow-cyan backdrop-blur-sm"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
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
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50"
          >
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
              <span className="text-sm font-display font-bold">NO CREDIT CARD</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
              <span className="text-sm font-display font-bold">FREE FOREVER</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff006e] animate-pulse" />
              <span className="text-sm font-display font-bold">INSTANT ACCESS</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent" />
    </section>
  );
}