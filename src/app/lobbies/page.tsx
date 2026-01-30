"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Globe, Loader2, Gamepad2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GAMES } from "@/config/games";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PublicLobby {
    id: string;
    code: string;
    host_id: string;
    host_name: string;
    game_id: string | null;
    player_count: number;
    max_players: number;
    created_at: string;
}

export default function LobbiesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [lobbies, setLobbies] = useState<PublicLobby[]>([]);
    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    const supabase = createClient();

    // Fetch lobbies on mount
    useEffect(() => {
        const fetchLobbies = async () => {
            setLoading(true);
            
            // Fetch public, waiting rooms with player counts
            const { data: rooms, error } = await supabase
                .from("rooms")
                .select(`
                    id,
                    code,
                    host_id,
                    game_id,
                    max_players,
                    created_at,
                    room_players(count)
                `)
                .eq("is_public", true)
                .eq("status", "waiting")
                .order("created_at", { ascending: false })
                .limit(20);

            if (error) {
                console.error("Error fetching lobbies:", error);
                setLoading(false);
                return;
            }

            // Use RPC for efficient joined query instead of N+1
            const { data: lobbiesData, error: lobbiesError } = await supabase
                .rpc("get_public_obbies_with_hosts");

            if (lobbiesError) {
                console.error("Error fetching lobbies:", lobbiesError);
                setLoading(false);
                return;
            }

            const formattedLobbies: PublicLobby[] = (lobbiesData || []).map((room: { id: string; code: string; host_id: string; host_name: string; game_id: string | null; max_players: number; created_at: string; player_count: number }) => ({
                id: room.id,
                code: room.code,
                host_id: room.host_id,
                host_name: room.host_name || "Player",
                game_id: room.game_id,
                player_count: room.player_count || 0,
                max_players: room.max_players,
                created_at: room.created_at,
            }));

            setLobbies(formattedLobbies);
            setLoading(false);
        };

        fetchLobbies();

        // Subscribe to room changes for real-time updates
        const roomChannel = supabase
            .channel("public_lobbies")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "rooms" },
                () => {
                    // Refetch on any change
                    fetchLobbies();
                }
            )
            .subscribe();

        setChannel(roomChannel);

        return () => {
            if (roomChannel) {
                supabase.removeChannel(roomChannel);
            }
        };
    }, []);

    // Cleanup channel on unmount
    useEffect(() => {
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [channel, supabase]);

    const filteredLobbies = lobbies.filter(
        (lobby) => {
            const game = GAMES.find(g => g.id === lobby.game_id);
            const gameName = game?.name || "Unknown Game";
            return gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lobby.host_name.toLowerCase().includes(searchQuery.toLowerCase());
        }
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                            Game <span className="text-[#FF4500]">Lobbies</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Join an existing game or create your own lobby
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid md:grid-cols-2 gap-6 mb-12"
                    >
                        <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6">
                            <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-[#00BFFF]" />
                                Join by Code
                            </h2>
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Enter 5-character code"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    maxLength={5}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 uppercase font-mono text-lg tracking-wider"
                                />
                                <Link href={joinCode.length === 5 ? `/multiplayer?join=${joinCode}` : "#"}>
                                    <Button
                                        disabled={joinCode.length !== 5}
                                        className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black font-semibold px-6"
                                    >
                                        Join
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6">
                            <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#32CD32]" />
                                Create New Lobby
                            </h2>
                            <p className="text-gray-400 mb-4">Start a new game and invite friends!</p>
                            <Link href="/multiplayer">
                                <Button className="w-full bg-[#32CD32] hover:bg-[#32CD32]/90 text-black font-semibold">
                                    Create Lobby
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-2xl font-bold text-white">
                                Public Lobbies
                                {!loading && (
                                    <span className="ml-2 text-sm font-normal text-white/40">
                                        ({lobbies.length} active)
                                    </span>
                                )}
                            </h2>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    placeholder="Search lobbies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-[#00f5ff]" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredLobbies.map((lobby, index) => {
                                    const game = GAMES.find(g => g.id === lobby.game_id);
                                    const GameIcon = game?.icon || Gamepad2;
                                    const gameColor = game?.color || "#666";
                                    const gameName = game?.name || "No Game Selected";

                                    return (
                                        <motion.div
                                            key={lobby.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-[#16162a] border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: `${gameColor}22` }}
                                                >
                                                    <GameIcon className="w-6 h-6" style={{ color: gameColor }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-display font-bold text-white">{gameName}</span>
                                                        <Globe className="w-4 h-4 text-[#32CD32]" />
                                                    </div>
                                                    <p className="text-sm text-gray-400">Hosted by {lobby.host_name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Users className="w-4 h-4" />
                                                    <span>
                                                        {lobby.player_count}/{lobby.max_players}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray-400">
                                                    {lobby.code}
                                                </span>
                                                <Link href={`/multiplayer?join=${lobby.code}`}>
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black font-semibold"
                                                    >
                                                        Join
                                                    </Button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {filteredLobbies.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">
                                            {lobbies.length === 0 
                                                ? "No public lobbies available. Create one to get started!" 
                                                : "No lobbies match your search."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
