"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/lobbies", label: "Lobbies" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14]/90 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-icon.svg"
              alt="Megames"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-display text-2xl font-bold text-gradient hidden sm:block">
              MEGAMES
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-[#00BFFF] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden sm:block"
                >
                  <Input
                    placeholder="Search games..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-300 hover:text-[#00BFFF]"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Link href="/login">
              <Button
                variant="ghost"
                className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-[#00BFFF]"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>

            <Link href="/signup">
              <Button className="hidden sm:flex bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-black font-semibold">
                Sign Up
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
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
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-300 hover:text-[#00BFFF] transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full border-white/20 text-gray-300">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-black font-semibold">
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
