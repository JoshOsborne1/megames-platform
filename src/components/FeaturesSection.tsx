"use client";

import { motion } from "framer-motion";
import { Wifi, Shield, Smartphone, Trophy, MessageSquare, Zap, Sparkles } from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "REAL-TIME MULTIPLAYER",
    description: "Play with friends anywhere in the world with seamless real-time synchronization.",
    color: "#ff006e",
    gradient: "from-[#ff006e] to-[#8338ec]",
  },
  {
    icon: Shield,
    title: "SECURE & FAIR",
    description: "Anti-cheat systems and secure lobbies ensure a fair gaming experience for everyone.",
    color: "#39ff14",
    gradient: "from-[#39ff14] to-[#00f5ff]",
  },
  {
    icon: Smartphone,
    title: "PLAY ANYWHERE",
    description: "Fully responsive design works perfectly on desktop, tablet, and mobile devices.",
    color: "#8338ec",
    gradient: "from-[#8338ec] to-[#fb00ff]",
  },
  {
    icon: Trophy,
    title: "RANKINGS & STATS",
    description: "Track your progress, climb the leaderboards, and show off your achievements.",
    color: "#fb00ff",
    gradient: "from-[#fb00ff] to-[#ff006e]",
  },
  {
    icon: MessageSquare,
    title: "IN-GAME CHAT",
    description: "Communicate with players through text chat and reactions during gameplay.",
    color: "#00f5ff",
    gradient: "from-[#00f5ff] to-[#8338ec]",
  },
  {
    icon: Zap,
    title: "INSTANT MATCHES",
    description: "Quick matchmaking gets you into games fast. No waiting, just playing.",
    color: "#39ff14",
    gradient: "from-[#39ff14] to-[#ff006e]",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#8338ec] rounded-full filter blur-[180px]"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-[#00f5ff] rounded-full filter blur-[180px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, bounce: 0.5 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] border-2 border-[#fb00ff]/40 rounded-full px-6 py-3 mb-8 neon-glow-purple"
          >
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-[#fb00ff]" />
            </motion.div>
            <span className="font-pixel text-[10px] text-white tracking-wider">FEATURES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            <span className="block">WHY CHOOSE</span>
            <span className="block text-gradient-neon glitch">MEGAMES?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-xl md:text-2xl max-w-3xl mx-auto font-space font-medium"
          >
            Built for gamers, by gamers.{" "}
            <span className="text-gradient-neon font-bold">Every feature designed to maximize fun.</span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="relative group"
            >
              <div
                className="relative h-full rounded-3xl p-8 backdrop-blur-md overflow-hidden transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}10 0%, ${feature.color}03 100%)`,
                  border: `1px solid ${feature.color}20`,
                  boxShadow: `0 8px 32px ${feature.color}10`,
                }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient}`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${feature.color}60`,
                      `0 0 40px ${feature.color}90`,
                      `0 0 20px ${feature.color}60`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <feature.icon className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </motion.div>

                <h3 className="font-display text-xl font-black text-white mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm font-space leading-relaxed">
                  {feature.description}
                </p>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.color}60 0%, transparent 70%)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}