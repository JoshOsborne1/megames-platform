"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Trophy, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Star },
    { href: "/games", label: "Games", icon: Trophy },
    { href: "/lobbies", label: "Lobbies", icon: Zap },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0015]/95 backdrop-blur-xl border-b-2 border-[#ff006e]/30 shadow-[0_0_30px_rgba(255,0,110,0.2)]"
          : "bg-[#0a0015]/70 backdrop-blur-md border-b border-[#8338ec]/20"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/logo-icon.svg"
                alt="Megames"
                width={50}
                height={50}
                className="w-12 h-12 drop-shadow-[0_0_15px_rgba(255,0,110,0.6)]"
              />
            </motion.div>
              <span className="font-display text-2xl font-black text-gradient-neon hidden min-[450px]:block tracking-wider">
                MEGAMES
              </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="relative group px-6 py-6 text-white/80 hover:text-white hover:bg-transparent font-display font-semibold text-sm overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#ff006e]/0 via-[#8338ec]/10 to-[#00f5ff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <Icon className="w-4 h-4 mr-2 inline-block" />
                      <span className="relative">{link.label}</span>
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </div>

            <div className="flex items-center gap-2 md:gap-3">
              <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block"
                >
                  <Input
                    placeholder="Search games..."
                    className="bg-[#1a0f2e] border-[#8338ec]/40 text-white placeholder:text-[#c4b5fd]/50 focus:border-[#ff006e] focus:ring-[#ff006e]/30 font-space"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white/70 hover:text-[#00f5ff] hover:bg-[#00f5ff]/10 rounded-full"
              >
                <Search className="w-5 h-5" />
              </Button>
            </motion.div>

            <ThemeToggle />

            <Link href="/login" className="hidden sm:block">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-[#8338ec] text-white hover:bg-[#8338ec]/20 hover:border-[#ff006e] font-display font-semibold text-sm md:text-base px-3 md:px-4 py-2 touch-manipulation"
                >
                  Login
                </Button>
              </motion.div>
            </Link>

            <Link href="/signup" className="hidden sm:block">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="relative font-display font-bold text-sm md:text-base px-3 md:px-4 py-2 bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#00f5ff] text-white overflow-hidden group touch-manipulation">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] via-[#fb00ff] to-[#ff006e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Sign Up
                  </span>
                </Button>
              </motion.div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/70 hover:text-[#ff006e] rounded-full touch-manipulation min-w-[44px] min-h-[44px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 space-y-3 pb-safe">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-4 text-white/80 hover:text-white hover:bg-[#ff006e]/10 rounded-lg transition-all font-display font-semibold border border-transparent hover:border-[#ff006e]/30 touch-manipulation min-h-[44px]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="flex gap-3 pt-4 px-4 border-t border-[#8338ec]/30">
                  <Link href="/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-[#8338ec] text-white font-display py-4 touch-manipulation min-h-[44px]"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white font-display font-bold py-4 touch-manipulation min-h-[44px]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}