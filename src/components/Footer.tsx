"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Twitter, MessageCircle, Heart, Zap, Sparkles } from "lucide-react";

export function Footer() {
  const footerLinks = {
    games: [
      { href: "/games", label: "ALL GAMES" },
      { href: "/games/lyric-legends", label: "LYRIC LEGENDS" },
      { href: "/games/dynamic-decks", label: "DYNAMIC DECKS" },
      { href: "/games/shade-signals", label: "SHADE SIGNALS" },
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 md:gap-3 mb-4 md:group">
              <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}>
                <Image
                  src="/logo.svg"
                  alt="PartyPack"
                  width={34}
                  height={40}
                  className="w-8 h-10 md:w-10 md:h-12 drop-shadow-[0_0_15px_rgba(255,0,110,0.6)]"
                />
              </motion.div>
              <span className="font-display text-xl md:text-2xl font-black text-gradient-neon uppercase tracking-tight">PartyPack</span>
            </Link>
            <p className="text-white/60 text-xs md:text-sm font-space mb-6 leading-relaxed max-w-sm">
              All your favorite board games in one digital deck. Play with friends, no cards needed!
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3, rotate: [0, -5, 5, 0] }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white transition-all holographic-card"
                  style={{
                    background: `linear-gradient(135deg, ${social.color}20, ${social.color}10)`,
                    border: `1.5px solid ${social.color}40`,
                    boxShadow: `0 0 20px ${social.color}30`,
                  }}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-display text-[10px] md:text-sm font-black text-[#ff006e] mb-4 md:mb-6 tracking-widest neon-text-pink flex items-center gap-2">
              <Zap className="w-3 h-3 md:w-4 md:h-4" />
              GAMES
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.games.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#ff006e] transition-all text-[11px] md:text-sm font-display font-semibold hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-display text-[10px] md:text-sm font-black text-[#8338ec] mb-4 md:mb-6 tracking-widest neon-text-cyan flex items-center gap-2">
              <Heart className="w-3 h-3 md:w-4 md:h-4" />
              SUPPORT
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#8338ec] transition-all text-[11px] md:text-sm font-display font-semibold hover:translate-x-1 inline-block"
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
          className="pt-6 md:pt-8 border-t border-[#8338ec]/20 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/40 text-[10px] md:text-sm font-display font-bold uppercase tracking-widest">
            © 2025 PARTYPACK. ALL RIGHTS RESERVED.
          </p>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-white/40 text-[10px] md:text-sm font-display font-bold flex items-center gap-2 uppercase tracking-widest"
          >
            MADE WITH{" "}
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-3 h-3 md:w-4 md:h-4 text-[#ff006e] fill-current drop-shadow-[0_0_10px_rgba(255,0,110,0.8)]" />
            </motion.span>{" "}
            FOR GAME LOVERS
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff]" />
    </footer>
  );
}
