"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Twitter, MessageCircle, Heart, Zap, Sparkles } from "lucide-react";

export function Footer() {
  const footerLinks = {
    games: [
      { href: "/games", label: "ALL GAMES" },
      { href: "/games/card-clash", label: "CARD CLASH" },
      { href: "/games/trivia-royale", label: "TRIVIA ROYALE" },
      { href: "/games/kingdom-quest", label: "KINGDOM QUEST" },
    ],
    support: [
      { href: "/help", label: "HELP CENTER" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "CONTACT US" },
      { href: "/feedback", label: "FEEDBACK" },
    ],
    legal: [
      { href: "/privacy", label: "PRIVACY POLICY" },
      { href: "/terms", label: "TERMS OF SERVICE" },
      { href: "/cookies", label: "COOKIE POLICY" },
    ],
  };

  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter", color: "#00f5ff" },
    { href: "https://github.com", icon: Github, label: "GitHub", color: "#ff006e" },
    { href: "https://discord.com", icon: MessageCircle, label: "Discord", color: "#8338ec" },
  ];

  return (
    <footer className="relative bg-[#0a0015] border-t-2 border-[#ff006e]/30 mt-auto overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-48 left-1/4 w-96 h-96 bg-[#ff006e] rounded-full filter blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-48 right-1/4 w-96 h-96 bg-[#8338ec] rounded-full filter blur-[130px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}>
                <Image
                  src="/logo-icon.svg"
                  alt="Megames"
                  width={48}
                  height={48}
                  className="w-12 h-12 drop-shadow-[0_0_15px_rgba(255,0,110,0.6)]"
                />
              </motion.div>
              <span className="font-display text-2xl font-black text-gradient-neon">MEGAMES</span>
            </Link>
            <p className="text-white/60 text-sm font-space mb-6 leading-relaxed">
              All your favorite board games in one digital deck. Play with friends, no cards needed!
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all holographic-card"
                  style={{
                    background: `linear-gradient(135deg, ${social.color}20, ${social.color}10)`,
                    border: `2px solid ${social.color}40`,
                    boxShadow: `0 0 20px ${social.color}30`,
                  }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-black text-[#ff006e] mb-6 tracking-wider neon-text-pink flex items-center gap-2">
              <Zap className="w-4 h-4" />
              GAMES
            </h3>
            <ul className="space-y-3">
              {footerLinks.games.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#ff006e] transition-all text-sm font-display font-semibold hover:translate-x-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-black text-[#8338ec] mb-6 tracking-wider neon-text-cyan flex items-center gap-2">
              <Heart className="w-4 h-4" />
              SUPPORT
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#8338ec] transition-all text-sm font-display font-semibold hover:translate-x-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-black text-[#00f5ff] mb-6 tracking-wider neon-text-cyan flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              LEGAL
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#00f5ff] transition-all text-sm font-display font-semibold hover:translate-x-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-8 border-t-2 border-[#8338ec]/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-white/50 text-sm font-display font-semibold">
            © {new Date().getFullYear()} MEGAMES. ALL RIGHTS RESERVED.
          </p>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-white/50 text-sm font-display font-semibold flex items-center gap-2"
          >
            MADE WITH{" "}
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-[#ff006e] fill-current drop-shadow-[0_0_10px_rgba(255,0,110,0.8)]" />
            </motion.span>{" "}
            FOR GAME LOVERS
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff]" />
    </footer>
  );
}
