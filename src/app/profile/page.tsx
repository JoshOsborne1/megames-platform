"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Gamepad2,
  Medal,
  Star,
  Edit,
  Settings,
  Crown,
} from "lucide-react";

const mockUser = {
  username: "GameMaster99",
  email: "player@example.com",
  avatar: "#00BFFF",
  joinDate: "December 2024",
  rank: "Gold",
  elo: 1450,
};

const mockStats = {
  gamesPlayed: 127,
  wins: 68,
  losses: 59,
  winRate: 53.5,
  hoursPlayed: 42,
  currentStreak: 5,
  bestStreak: 12,
};

const mockGameStats = [
  { game: "Card Clash", played: 45, wins: 28, color: "#00BFFF" },
  { game: "Trivia Royale", played: 52, wins: 25, color: "#FF4500" },
  { game: "Kingdom Quest", played: 30, wins: 15, color: "#32CD32" },
];

const mockAchievements = [
  { id: 1, name: "First Win", description: "Win your first game", icon: Trophy, unlocked: true },
  { id: 2, name: "Streak Master", description: "Win 10 games in a row", icon: TrendingUp, unlocked: true },
  { id: 3, name: "Card Collector", description: "Play 50 Card Clash games", icon: Target, unlocked: false },
  { id: 4, name: "Trivia King", description: "Win 25 Trivia Royale games", icon: Crown, unlocked: false },
];

const rankColors: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#C0C0C0",
  Gold: "#FFD700",
  Platinum: "#00BFFF",
  Diamond: "#9370DB",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#16162a] border border-white/10 rounded-2xl p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-black"
                  style={{ backgroundColor: mockUser.avatar }}
                >
                  {mockUser.username.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-display text-3xl font-bold text-white">
                      {mockUser.username}
                    </h1>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                      style={{ backgroundColor: `${rankColors[mockUser.rank]}22`, color: rankColors[mockUser.rank] }}
                    >
                      <Medal className="w-3 h-3" />
                      {mockUser.rank}
                    </div>
                  </div>
                  <p className="text-gray-400 mt-1">Member since {mockUser.joinDate}</p>
                  <p className="text-gray-500 text-sm mt-1">ELO: {mockUser.elo}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Games Played", value: mockStats.gamesPlayed, icon: Gamepad2, color: "#00BFFF" },
              { label: "Total Wins", value: mockStats.wins, icon: Trophy, color: "#32CD32" },
              { label: "Win Rate", value: `${mockStats.winRate}%`, icon: TrendingUp, color: "#FF4500" },
              { label: "Hours Played", value: mockStats.hoursPlayed, icon: Clock, color: "#9370DB" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#16162a] border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#16162a] border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00BFFF]" />
                Game Statistics
              </h2>
              <div className="space-y-4">
                {mockGameStats.map((game) => (
                  <div key={game.game} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{game.game}</span>
                      <span className="text-gray-400 text-sm">
                        {game.wins}/{game.played} wins
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(game.wins / game.played) * 100}%`,
                          backgroundColor: game.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#16162a] border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFD700]" />
                Achievements
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {mockAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border ${
                      achievement.unlocked
                        ? "border-[#FFD700]/30 bg-[#FFD700]/10"
                        : "border-white/10 bg-white/5 opacity-50"
                    }`}
                  >
                    <achievement.icon
                      className={`w-6 h-6 mb-2 ${
                        achievement.unlocked ? "text-[#FFD700]" : "text-gray-500"
                      }`}
                    />
                    <p className="font-display font-bold text-white text-sm">{achievement.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-[#9370DB]/20 to-[#00BFFF]/20 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/20 px-2 py-1 rounded-full">
                  [PREMIUM_FEATURE]
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-2">
                  Unlock Premium Features
                </h3>
                <p className="text-gray-400 mt-1">
                  Get custom avatars, exclusive games, and more!
                </p>
              </div>
              <Button className="bg-gradient-to-r from-[#9370DB] to-[#00BFFF] text-white font-bold">
                Upgrade Now
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
