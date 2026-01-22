"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { GAMES, GameConfig } from "@/config/games";
import { WatchAdButton } from "@/components/games/shared";
import { useRoom } from "@/context/RoomContext";
import {
    Plus, Users, Copy, ArrowRight, Check, X,
    Loader2, Gamepad2, Crown, Activity, Play, LogOut, ChevronDown
} from "lucide-react";

function MultiplayerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedGameId = searchParams.get("game");

    const {
        room,
        isLoading: roomLoading,
        error: roomError,
        createRoom,
        joinRoom,
        leaveRoom,
        setSelectedGame,
        setMaxPlayers,
        setReady,
        startGame,
        kickPlayer
    } = useRoom();

    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);


    // Local UI state
    const [joinCode, setJoinCode] = useState("");
    const [guestName, setGuestName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showGameSelector, setShowGameSelector] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
            setUser(user);
            setLoading(false);
            // No redirect - allow guests to view the page
        });
    }, []);

    // Pre-select game if coming from game page
    useEffect(() => {
        if (preselectedGameId && room.isActive) {
            const game = GAMES.find(g => g.id === preselectedGameId);
            if (game) {
                setSelectedGame(game);
            }
        }
    }, [preselectedGameId, room.isActive, setSelectedGame]);

    // Watch for game start - auto-navigate ALL players when status changes to "playing"
    useEffect(() => {
        if (room.status === "playing" && room.selectedGame) {
            // Navigate to the game route for all players (host and guests)
            router.push(`${room.selectedGame.route}?mode=online&room=${room.roomCode}`);
        }
    }, [room.status, room.selectedGame, room.roomCode, router]);

    const username = user?.user_metadata?.username || user?.email?.split("@")[0] || guestName || "Guest";

    const handleCreateRoom = async () => {
        // Require login to create
        if (!user) {
            router.push("/login?redirect=/multiplayer");
            return;
        }
        
        setIsCreating(true);
        const code = await createRoom(username);
        setIsCreating(false);
        if (!code) {
            // Handle error - could show a message
        }
    };

    const handleJoinRoom = async () => {
        if (joinCode.length !== 5) return;
        
        // For guests, require a name
        const playerName = user ? username : guestName.trim();
        if (!playerName) return;

        setIsJoining(true);
        const success = await joinRoom(joinCode, playerName);
        setIsJoining(false);

        if (!success) {
            // Handle error - could show a message
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(room.roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartGame = async () => {
        if (!room.selectedGame) return;
        // Just update the status - the useEffect watching room.status will handle navigation for all players
        await startGame();
    };

    const handleLeaveRoom = async () => {
        await leaveRoom();
    };

    const handleSelectGame = async (game: GameConfig) => {
        await setSelectedGame(game);
        setShowGameSelector(false);
    };

    const handleMaxPlayersChange = async (delta: number) => {
        const newMax = Math.max(2, Math.min(10, room.maxPlayers + delta));
        await setMaxPlayers(newMax);
    };

    const handleToggleReady = async () => {
        const myPlayer = room.players.find(p => p.id === user?.id);
        if (myPlayer) {
            await setReady(!myPlayer.isReady);
        }
    };

    if (loading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
            </AppShell>
        );
    }

    // Unified render with Lobby Shell - Actions Integrated into Slots
    return (
        <AppShell>
            <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto">
                {/* TOP BAR - Unified shell */}
                <div className="flex items-center justify-between mb-4">
                    {/* Room Code Indicator - Only show when active */}
                    <AnimatePresence mode="wait">
                        {room.isActive && (
                            <motion.div
                                key="active-code"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleCopyCode}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
                            >
                                <span className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Room</span>
                                <span className="font-mono font-bold text-white tracking-wider">{room.roomCode}</span>
                                {copied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Actions Slot */}
                    <div className="flex items-center gap-2">
                        <AnimatePresence>
                            {room.isActive && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2"
                                >
                                    <button
                                        onClick={handleLeaveRoom}
                                        disabled={roomLoading}
                                        className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                    {room.isHost && (
                                        <button
                                            onClick={handleStartGame}
                                            disabled={!room.selectedGame || roomLoading}
                                            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Play className="w-4 h-4" />
                                            <span className="text-sm">Start</span>
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {roomError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                        >
                            <Activity className="w-4 h-4" />
                            {roomError}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HEADER / STATUS */}
                <header className="text-center mb-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={room.isActive ? "active-header" : "inactive-header"}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                                {room.isActive ? (room.isHost ? "Your Room" : "Room Lobby") : "Multiplayer"}
                            </h1>
                            {room.isActive && (
                                <div className="flex items-center justify-center gap-2 mt-1">
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                        {room.players.length} player{room.players.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </header>

                {/* SLOT 1: Primary Action / Game Selection */}
                <div className="relative mb-4">
                    <AnimatePresence mode="wait">
                        {!room.isActive ? (
                            <motion.button
                                key="create-slot"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateRoom}
                                disabled={isCreating || roomLoading}
                                className="w-full p-5 rounded-2xl border-2 bg-linear-to-br from-neon-purple/20 to-neon-purple/5 border-neon-purple/30 text-left relative overflow-hidden group shadow-xl shadow-neon-purple/10"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-neon-purple/10" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex-1">
                                        <h3 className="font-display font-bold text-lg text-white mb-0.5">Create Room</h3>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Host a lobby for friends</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-neon-purple/30 flex items-center justify-center text-neon-purple border border-neon-purple/30 shadow-[0_0_15px_rgba(131,56,236,0.2)]">
                                        {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                                    </div>
                                </div>
                            </motion.button>
                        ) : (
                            <motion.div
                                key="game-slot"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                whileTap={room.isHost ? { scale: 0.98 } : undefined}
                                onClick={() => room.isHost && setShowGameSelector(!showGameSelector)}
                                className={`p-4 rounded-xl border-2 transition-all ${room.isHost ? 'cursor-pointer' : ''}`}
                                style={{
                                    background: room.selectedGame
                                        ? `linear-gradient(135deg, ${room.selectedGame.color}20, transparent)`
                                        : 'rgba(255,255,255,0.05)',
                                    borderColor: room.selectedGame ? `${room.selectedGame.color}40` : 'rgba(255,255,255,0.1)'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    {room.selectedGame ? (
                                        <>
                                            <div
                                                className="w-14 h-14 rounded-xl flex items-center justify-center border"
                                                style={{ 
                                                    backgroundColor: `${room.selectedGame.color}20`, 
                                                    boxShadow: `0 0 20px ${room.selectedGame.color}30`,
                                                    borderColor: `${room.selectedGame.color}40`
                                                }}
                                            >
                                                <room.selectedGame.icon className="w-7 h-7" style={{ color: room.selectedGame.color }} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-display font-bold text-lg text-white">{room.selectedGame.name}</h4>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{room.selectedGame.playerCount} • {room.selectedGame.duration}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                                                <Gamepad2 className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white">No Game Selected</h4>
                                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{room.isHost ? "Tap to pick a game" : "Waiting for host..."}</p>
                                            </div>
                                        </>
                                    )}
                                    {room.isHost && (
                                        <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${showGameSelector ? 'rotate-180' : ''}`} />
                                    )}
                                </div>

                                {/* Game Selector Dropdown */}
                                <AnimatePresence>
                                    {showGameSelector && room.isHost && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-white/10 space-y-2 overflow-hidden"
                                        >
                                            {GAMES.map(game => (
                                                <motion.button
                                                    key={game.id}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectGame(game);
                                                    }}
                                                    className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${room.selectedGame?.id === game.id
                                                        ? 'bg-white/10 border-white/30'
                                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center border"
                                                        style={{ backgroundColor: `${game.color}20`, borderColor: `${game.color}30` }}
                                                    >
                                                        <game.icon className="w-5 h-5" style={{ color: game.color }} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <h5 className="font-bold text-sm text-white">{game.name}</h5>
                                                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">{game.playerCount}</p>
                                                    </div>
                                                    {room.selectedGame?.id === game.id && (
                                                        <Check className="w-4 h-4 text-emerald-400" />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* SLOT 2: Join Action / Player List */}
                <div className="mb-4 min-h-[160px]">
                    <AnimatePresence mode="wait">
                        {!room.isActive ? (
                            <motion.div
                                key="join-slot"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-5 rounded-2xl bg-white/5 border-2 border-white/10 shadow-xl"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-display font-bold text-lg text-white mb-0.5">Join Room</h3>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Enter code to play</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
                                            placeholder="CODE"
                                            maxLength={5}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-display font-bold text-white placeholder-white/10 tracking-[0.2em] focus:outline-none focus:border-neon-cyan/50 transition-colors uppercase"
                                        />
                                        {!user && (
                                            <input
                                                type="text"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value.slice(0, 15))}
                                                placeholder="Nickname"
                                                maxLength={15}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 transition-colors"
                                            />
                                        )}
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleJoinRoom}
                                        disabled={joinCode.length !== 5 || isJoining || roomLoading || (!user && !guestName.trim())}
                                        className="w-14 h-auto rounded-xl bg-neon-cyan text-black flex items-center justify-center disabled:opacity-30 shadow-lg shadow-neon-cyan/20"
                                    >
                                        {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="players-slot"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Lobby Members</p>
                                    <span className="text-[10px] text-white/30 font-black tracking-widest leading-none">{room.players.length} / {room.maxPlayers}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {room.players.map((player) => (
                                        <div
                                            key={player.id}
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 group transition-colors hover:bg-white/8"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-neon-purple to-neon-pink flex items-center justify-center text-white text-[10px] font-black shadow-md">
                                                    {player.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-xs truncate max-w-[100px]">{player.name}</span>
                                                    {player.isHost && <Crown className="w-3 h-3 text-amber-300" />}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {player.isReady ? (
                                                    <div className="px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                        Ready
                                                    </div>
                                                ) : (
                                                    <div className="px-1.5 py-0.5 rounded-sm bg-white/5 text-white/20 text-[8px] font-black uppercase tracking-tighter">
                                                        Waiting
                                                    </div>
                                                )}
                                                {room.isHost && !player.isHost && (
                                                    <button
                                                        onClick={() => kickPlayer(player.id)}
                                                        className="p-1 px-1.5 rounded-md bg-red-500/10 border border-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Empty Slot Placeholder */}
                                    {room.players.length < room.maxPlayers && (
                                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/2 border border-dashed border-white/10 opacity-50">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/10">
                                                <Users className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-white/10 text-xs font-bold uppercase tracking-widest italic">Slot Open</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* SLOT 3: Settings / Ready / Info */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {!room.isActive ? null : room.isHost ? (
                            <motion.div
                                key="active-settings"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black leading-none">Settings</p>
                                    <div className="h-0.5 flex-1 mx-3 bg-white/5 rounded-full" />
                                </div>

                                <div className="flex items-center justify-between mb-4 bg-white/2 p-2 rounded-xl border border-white/5">
                                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Max Players</span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleMaxPlayersChange(-1)}
                                            disabled={roomLoading || room.maxPlayers <= 2}
                                            className="w-7 h-7 rounded-lg bg-white/5 text-white/60 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 transition-all border border-white/5"
                                        >-</button>
                                        <span className="w-6 text-center font-black text-white text-sm">{room.maxPlayers}</span>
                                        <button
                                            onClick={() => handleMaxPlayersChange(1)}
                                            disabled={roomLoading || room.maxPlayers >= 10}
                                            className="w-7 h-7 rounded-lg bg-white/5 text-white/60 flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-30 transition-all border border-white/5"
                                        >+</button>
                                    </div>
                                </div>

                                <WatchAdButton
                                    variant="card"
                                    label="Bonus Slot"
                                    description="+1 Player Capacity"
                                    onReward={() => handleMaxPlayersChange(1)}
                                />
                            </motion.div>
                        ) : (
                            <motion.button
                                key="ready-cta"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleToggleReady}
                                disabled={roomLoading}
                                className={`w-full py-5 rounded-2xl font-display font-black text-xl transition-all shadow-2xl uppercase tracking-widest border-b-4 ${
                                    room.players.find(p => p.id === user?.id)?.isReady
                                        ? 'bg-emerald-500 text-white border-emerald-700 shadow-emerald-500/30'
                                        : 'bg-neon-cyan text-black border-neon-cyan-dark shadow-neon-cyan/30'
                                }`}
                            >
                                {room.players.find(p => p.id === user?.id)?.isReady ? "Ready!" : "Ready Up"}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-20" />
            </div>
        </AppShell>
    );
}

export default function MultiplayerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Multiplayer...</div>}>
            <MultiplayerContent />
        </Suspense>
    );
}
