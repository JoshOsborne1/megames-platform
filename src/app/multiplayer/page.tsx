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
    Plus, Search, Users, Globe, Lock, Copy, ArrowRight, Check, X,
    Loader2, Gamepad2, Crown, Activity, Play, LogOut, ChevronDown
} from "lucide-react";

type LobbyView = "main" | "join";

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
        setIsPublic,
        setMaxPlayers,
        setReady,
        startGame
    } = useRoom();

    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Local UI state
    const [view, setView] = useState<LobbyView>("main");
    const [joinCode, setJoinCode] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showGameSelector, setShowGameSelector] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);

            if (!user) {
                router.push("/login");
            }
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

    const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Player";

    const handleCreateRoom = async () => {
        setIsCreating(true);
        const code = await createRoom(username);
        setIsCreating(false);
        if (!code) {
            // Handle error - could show a message
        }
    };

    const handleJoinRoom = async () => {
        if (joinCode.length !== 5) return;

        setIsJoining(true);
        const success = await joinRoom(joinCode, username);
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

        const success = await startGame();
        if (success) {
            router.push(`${room.selectedGame.route}?mode=online&room=${room.roomCode}`);
        }
    };

    const handleLeaveRoom = async () => {
        await leaveRoom();
        setView("main");
    };

    const handleSelectGame = async (game: GameConfig) => {
        await setSelectedGame(game);
        setShowGameSelector(false);
    };

    const handleTogglePublic = async () => {
        await setIsPublic(!room.isPublic);
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

    // Not logged in
    if (!user) {
        return (
            <AppShell>
                <div className="min-h-screen px-4 pt-6 max-w-md mx-auto flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="widget-card !p-8 text-center flex flex-col items-center gap-6 relative overflow-hidden"
                    >
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#8338ec]/30 blur-3xl rounded-full" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00f5ff]/30 blur-3xl rounded-full" />

                        <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#8338ec] to-[#00f5ff] flex items-center justify-center shadow-2xl">
                            <Globe className="w-10 h-10 text-white" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="font-display text-2xl font-bold text-white mb-2">Multiplayer</h2>
                            <p className="text-white/50 text-sm">Sign in to play with friends online</p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/login")}
                            className="relative z-10 w-full py-4 rounded-xl bg-gradient-to-r from-[#8338ec] to-[#00f5ff] text-white font-bold uppercase tracking-wider"
                        >
                            Sign In to Continue
                        </motion.button>
                    </motion.div>
                </div>
            </AppShell>
        );
    }

    // ROOM IS ACTIVE - Show room view
    if (room.isActive) {
        return (
            <AppShell>
                <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto">

                    {/* TOP BAR - Room code + Actions */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Room Code */}
                        <div
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <span className="text-[10px] text-white/40 uppercase">Room</span>
                            <span className="font-mono font-bold text-white tracking-wider">{room.roomCode}</span>
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
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
                                    className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Play className="w-4 h-4" />
                                    <span className="text-sm">Start</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {roomError && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {roomError}
                        </div>
                    )}

                    {/* HEADER */}
                    <header className="text-center mb-4">
                        <h1 className="font-display font-bold text-lg uppercase tracking-wider text-white">
                            {room.isHost ? "Your Room" : "Room Lobby"}
                        </h1>
                        <p className="text-xs text-white/50 font-medium">
                            {room.players.length} player{room.players.length !== 1 ? 's' : ''} • {room.isPublic ? 'Public' : 'Private'}
                        </p>
                    </header>

                    {/* GAME SELECTION - Entire card clickable */}
                    <motion.div
                        whileTap={room.isHost ? { scale: 0.98 } : undefined}
                        onClick={() => room.isHost && setShowGameSelector(!showGameSelector)}
                        className={`p-4 rounded-xl border mb-4 transition-all ${room.isHost ? 'cursor-pointer' : ''}`}
                        style={{
                            background: room.selectedGame
                                ? `linear-gradient(135deg, ${room.selectedGame.color}15, transparent)`
                                : 'rgba(255,255,255,0.05)',
                            borderColor: room.selectedGame ? `${room.selectedGame.color}40` : 'rgba(255,255,255,0.1)'
                        }}
                    >
                        {room.selectedGame ? (
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${room.selectedGame.color}20`, boxShadow: `0 0 20px ${room.selectedGame.color}30` }}
                                >
                                    <room.selectedGame.icon className="w-7 h-7" style={{ color: room.selectedGame.color }} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-display font-bold text-lg text-white">{room.selectedGame.name}</h4>
                                    <p className="text-xs text-white/50">{room.selectedGame.playerCount} • {room.selectedGame.duration}</p>
                                </div>
                                {room.isHost && (
                                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${showGameSelector ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white/30">
                                    <Gamepad2 className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">No Game Selected</h4>
                                    <p className="text-xs text-white/40">{room.isHost ? "Tap to pick a game" : "Waiting for host..."}</p>
                                </div>
                                {room.isHost && (
                                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${showGameSelector ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        )}

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
                                            disabled={roomLoading}
                                            className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${room.selectedGame?.id === game.id
                                                ? 'bg-white/10 border-white/30'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${game.color}20` }}
                                            >
                                                <game.icon className="w-5 h-5" style={{ color: game.color }} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h5 className="font-bold text-sm text-white">{game.name}</h5>
                                                <p className="text-[10px] text-white/40">{game.playerCount} • {game.duration}</p>
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

                    {/* PLAYERS */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-white/40 text-xs uppercase tracking-wider">Players</p>
                            <span className="text-xs text-white/40">{room.players.length}/{room.maxPlayers}</span>
                        </div>
                        <div className="space-y-2">
                            {room.players.map((player) => (
                                <div
                                    key={player.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8338ec] to-[#ff006e] flex items-center justify-center text-white text-sm font-bold">
                                            {player.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium text-sm">{player.name}</span>
                                            {player.isHost && <Crown className="w-3 h-3 text-amber-400" />}
                                        </div>
                                    </div>
                                    {player.isReady && (
                                        <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                                            Ready
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Empty slots - show max 2 */}
                            {Array.from({ length: Math.min(2, room.maxPlayers - room.players.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-dashed border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <span className="text-white/30 text-sm">Waiting...</span>
                                </div>
                            ))}
                            {room.maxPlayers - room.players.length > 2 && (
                                <p className="text-center text-white/20 text-xs">+{room.maxPlayers - room.players.length - 2} more slots</p>
                            )}
                        </div>
                    </div>

                    {/* ROOM SETTINGS - Host only */}
                    {room.isHost && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Room Settings</p>

                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {room.isPublic ? <Globe className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-white/40" />}
                                    <span className="text-sm text-white">{room.isPublic ? "Public" : "Private"}</span>
                                </div>
                                <button
                                    onClick={handleTogglePublic}
                                    disabled={roomLoading}
                                    className={`w-10 h-5 rounded-full transition-colors ${room.isPublic ? 'bg-emerald-500' : 'bg-white/20'}`}
                                >
                                    <motion.div
                                        animate={{ x: room.isPublic ? 20 : 2 }}
                                        className="w-4 h-4 rounded-full bg-white"
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white">Max Players</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleMaxPlayersChange(-1)}
                                        disabled={roomLoading || room.maxPlayers <= 2}
                                        className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-50"
                                    >-</button>
                                    <span className="w-6 text-center font-bold text-white">{room.maxPlayers}</span>
                                    <button
                                        onClick={() => handleMaxPlayersChange(1)}
                                        disabled={roomLoading || room.maxPlayers >= 10}
                                        className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-50"
                                    >+</button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <WatchAdButton
                                    variant="card"
                                    label="Unlock Bonus Slot"
                                    description="Watch ad to add +1 player capacity"
                                    onReward={() => handleMaxPlayersChange(1)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Non-host ready button */}
                    {!room.isHost && (
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleToggleReady}
                            disabled={roomLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${room.players.find(p => p.id === user?.id)?.isReady
                                ? 'bg-emerald-500 text-white'
                                : 'bg-[#00f5ff] text-black'
                                }`}
                        >
                            {room.players.find(p => p.id === user?.id)?.isReady ? "Ready!" : "Ready Up"}
                        </motion.button>
                    )}
                </div>
            </AppShell>
        );
    }

    // NO ACTIVE ROOM - Show create/join view
    return (
        <AppShell>
            <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">

                {/* HEADER */}
                <header className="text-center mb-6">
                    <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">Multiplayer</h1>
                    <p className="text-xs text-white/50 font-medium">
                        {view === "main" ? "Create or join a room" : "Enter room code"}
                    </p>
                </header>

                {/* Error Message */}
                {roomError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {roomError}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* MAIN VIEW */}
                    {view === "main" && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {/* Create Room */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateRoom}
                                disabled={isCreating || roomLoading}
                                className="w-full p-5 rounded-xl border transition-all text-left relative overflow-hidden group bg-gradient-to-br from-[#8338ec]/20 to-[#8338ec]/5 border-[#8338ec]/40 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#8338ec]/10" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <h3 className="font-display font-bold text-lg text-white mb-1">Create Room</h3>
                                        <p className="text-sm text-white/50">Host a lobby for friends</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-[#8338ec]/30 flex items-center justify-center text-[#8338ec]">
                                        {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                                    </div>
                                </div>
                            </motion.button>

                            {/* Join Room */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setView("join")}
                                className="w-full p-5 rounded-xl border bg-white/5 border-white/10 transition-all text-left hover:bg-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display font-bold text-lg text-white mb-1">Join Room</h3>
                                        <p className="text-sm text-white/50">Enter a code to join</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                                        <Search className="w-6 h-6" />
                                    </div>
                                </div>
                            </motion.button>

                            {/* Online Status */}
                            <div className="flex items-center justify-center gap-2 pt-4 text-white/30 text-xs font-medium uppercase tracking-widest">
                                <Activity className="w-3 h-3" />
                                <span>Real-time Sync Active</span>
                            </div>
                        </motion.div>
                    )}

                    {/* JOIN VIEW */}
                    {view === "join" && (
                        <motion.div
                            key="join"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <button onClick={() => setView("main")} className="flex items-center gap-2 text-white/50 hover:text-white mb-4">
                                <ArrowRight className="w-4 h-4 rotate-180" /> Back
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="font-display font-bold text-xl text-white mb-2">Enter Room Code</h2>
                                <p className="text-white/50 text-sm">5-character code from host</p>
                            </div>

                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
                                placeholder="XXXXX"
                                maxLength={5}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center text-3xl font-display font-bold text-white placeholder-white/20 tracking-[0.3em] focus:outline-none focus:border-[#00f5ff]/50 transition-colors uppercase"
                            />

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleJoinRoom}
                                disabled={joinCode.length !== 5 || isJoining || roomLoading}
                                className="w-full py-4 rounded-xl bg-[#00f5ff] text-black font-display font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isJoining ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>Join Room <ArrowRight className="w-5 h-5" /></>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
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
