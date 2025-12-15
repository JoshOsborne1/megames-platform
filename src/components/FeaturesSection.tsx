"use client";

import { motion } from "framer-motion";
import { Wifi, Shield, Smartphone, Trophy, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "Real-Time Multiplayer",
    description: "Play with friends anywhere in the world with seamless real-time synchronization.",
    color: "#00BFFF",
  },
  {
    icon: Shield,
    title: "Secure & Fair",
    description: "Anti-cheat systems and secure lobbies ensure a fair gaming experience for everyone.",
    color: "#32CD32",
  },
  {
    icon: Smartphone,
    title: "Play Anywhere",
    description: "Fully responsive design works perfectly on desktop, tablet, and mobile devices.",
    color: "#FF4500",
  },
  {
    icon: Trophy,
    title: "Rankings & Stats",
    description: "Track your progress, climb the leaderboards, and show off your achievements.",
    color: "#FFD700",
  },
  {
    icon: MessageSquare,
    title: "In-Game Chat",
    description: "Communicate with players through text chat and reactions during gameplay.",
    color: "#9370DB",
  },
  {
    icon: Zap,
    title: "Instant Matches",
    description: "Quick matchmaking gets you into games fast. No waiting, just playing.",
    color: "#00BFFF",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0a0a14] to-[#0f0f1a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-[#FF4500]">Megames</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built for gamers, by gamers. Every feature designed to maximize fun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}22` }}
              >
                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
