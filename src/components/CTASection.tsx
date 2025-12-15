"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/20 via-[#9370DB]/20 to-[#FF4500]/20" />
      <div className="absolute inset-0 bg-[#0a0a14]/80" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 border border-[#FFD700]/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm text-[#FFD700]">Join thousands of players today!</span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Play?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Create your free account in seconds and start playing your favorite board games with friends online.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00BFFF] to-[#9370DB] hover:opacity-90 text-white font-bold text-lg px-10 py-6 rounded-xl"
                >
                  Sign Up Free
                </Button>
              </motion.div>
            </Link>
            <Link href="/games">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/20 text-white hover:bg-white/10 font-bold text-lg px-10 py-6 rounded-xl"
                >
                  Browse Games
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
