"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Twitter, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  const footerLinks = {
    games: [
      { href: "/games", label: "All Games" },
      { href: "/games/uno", label: "Card Clash" },
      { href: "/games/trivia", label: "Trivia Royale" },
      { href: "/games/strategy", label: "Kingdom Quest" },
    ],
    support: [
      { href: "/help", label: "Help Center" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact Us" },
      { href: "/feedback", label: "Feedback" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  };

  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://discord.com", icon: MessageCircle, label: "Discord" },
  ];

  return (
    <footer className="bg-[#0a0a14] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo-icon.svg"
                alt="Megames"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <span className="font-display text-xl font-bold text-gradient">MEGAMES</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              All your favorite board games in one digital deck. Play with friends, no cards needed!
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#00BFFF] hover:bg-white/10 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Games</h3>
            <ul className="space-y-2">
              {footerLinks.games.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#00BFFF] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#FF4500] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#32CD32] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Megames. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#FF4500] fill-current" /> for game lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
