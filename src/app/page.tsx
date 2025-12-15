"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { GamesGrid } from "@/components/GamesGrid";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <HeroSection />
        <GamesGrid />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
