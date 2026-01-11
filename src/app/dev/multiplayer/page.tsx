"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useMultiplayer, RoomPlayer } from "@/lib/multiplayer";
import {
    Users, Wifi, WifiOff, Play, Copy, Check,
    Plus, Trash2, Send, Eye, Bug, Zap, Radio
} from "lucide-react";

// Dev Panel - Simulates a second player in the same browser
function SimulatedPlayer({
    roomCode,
    onClose
}: {
    roomCode: string;
    onClose: () => void;
}) {
    const [playerName] = useState(`Bot_${Math.random().toString(36).substring(2, 6)}`);

    const {
        isConnected,
        players,
        playerId,
        joinRoom,
        leaveRoom,
        sendPlayerAction,
    } = useMultiplayer({
        playerName,
        onGameStateChange: (state) => {
            console.log(`[${playerName}] Received game state:`, state);
        },
        onPlayerAction: (pId, action, data) => {
            console.log(`[${playerName}] Player ${pId} action: ${action}`, data);
        },
    });

    useEffect(() => {
        if (roomCode) {
            joinRoom(roomCode);
        }
        return () => leaveRoom();
    }, [roomCode, joinRoom, leaveRoom]);

    return (
        <div className="bg-[#2d1b4e] border border-[#8338ec]/40 rounded-xl p-4 text-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-[#8338ec]" />
                    <span className="font-bold text-white">{playerName}</span>
                    <span className="text-[10px] text-white/40">{playerId.slice(0, 12)}...</span>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
                {isConnected ? (
                    <span className="flex items-center gap-1 text-green-400 text-xs">
                        <Wifi className="w-3 h-3" /> Connected
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-red-400 text-xs">
                        <WifiOff className="w-3 h-3" /> Disconnected
                    </span>
                )}
                <span className="text-white/40 text-xs">| {players.length} players</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => sendPlayerAction("TEST_ACTION", { timestamp: Date.now() })}
                    className="flex-1 py-2 bg-[#8338ec]/20 border border-[#8338ec]/40 rounded-lg text-[#8338ec] text-xs font-bold hover:bg-[#8338ec]/30 transition-colors flex items-center justify-center gap-1"
                >
                    <Send className="w-3 h-3" /> Send Action
                </button>
            </div>
        </div>
    );
}

export default function MultiplayerTestPage() {
    // Main player state
    const [playerName, setPlayerName] = useState("DevPlayer");
    const [joinCode, setJoinCode] = useState("");
    const [copiedCode, setCopiedCode] = useState(false);
    const [simulatedPlayers, setSimulatedPlayers] = useState<string[]>([]);
    const [eventLog, setEventLog] = useState<string[]>([]);
    const [testGameState, setTestGameState] = useState({ counter: 0, lastAction: "" });

    const addLog = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setEventLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
    }, []);

    const {
        isConnected,
        isHost,
        roomCode,
        players,
        playerId,
        createRoom,
        joinRoom,
        leaveRoom,
        broadcastGameState,
        sendPlayerAction,
        startGame,
        error,
    } = useMultiplayer({
        playerName,
        onGameStateChange: (state) => {
            addLog(`📦 Game state updated: ${JSON.stringify(state)}`);
            if (state && typeof state === 'object') {
                setTestGameState(state as typeof testGameState);
            }
        },
        onPlayerAction: (pId, action, data) => {
            addLog(`🎮 Player action from ${pId.slice(0, 8)}: ${action}`);
        },
    });

    const handleCreateRoom = async () => {
        const code = await createRoom("test-game");
        addLog(`🏠 Created room: ${code}`);
    };

    const handleJoinRoom = async () => {
        if (joinCode.length === 6) {
            const success = await joinRoom(joinCode.toUpperCase());
            if (success) {
                addLog(`✅ Joined room: ${joinCode}`);
            } else {
                addLog(`❌ Failed to join room: ${joinCode}`);
            }
        }
    };

    const handleLeaveRoom = () => {
        leaveRoom();
        setSimulatedPlayers([]);
        addLog("👋 Left room");
    };

    const copyRoomCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const addSimulatedPlayer = () => {
        if (roomCode) {
            setSimulatedPlayers(prev => [...prev, `sim_${Date.now()}`]);
            addLog("🤖 Added simulated player");
        }
    };

    const removeSimulatedPlayer = (id: string) => {
        setSimulatedPlayers(prev => prev.filter(p => p !== id));
        addLog("🗑️ Removed simulated player");
    };

    const testBroadcast = () => {
        const newState = {
            counter: testGameState.counter + 1,
            lastAction: `broadcast_${Date.now()}`
        };
        broadcastGameState(newState);
        addLog(`📡 Broadcasted state: counter=${newState.counter}`);
    };

    const testAction = () => {
        sendPlayerAction("INCREMENT", { value: 1 });
        addLog(`📤 Sent INCREMENT action`);
    };

    const testStartGame = () => {
        startGame({ counter: 0, lastAction: "game_started", startedAt: Date.now() });
        addLog("🚀 Started game");
    };

    return (
        <div className="min-h-screen bg-[#0f0a1e] text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center">
                        <Radio className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black">Multiplayer Dev Test</h1>
                        <p className="text-white/50 text-sm">Test real-time sync with Supabase Realtime</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Connection Controls */}
                    <div className="space-y-4">
                        {/* Connection Status */}
                        <div className="bg-[#1a0f2e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-display font-bold text-lg">Connection</h2>
                                {isConnected ? (
                                    <span className="flex items-center gap-1.5 text-green-400 text-sm">
                                        <Wifi className="w-4 h-4" /> Connected
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-white/40 text-sm">
                                        <WifiOff className="w-4 h-4" /> Disconnected
                                    </span>
                                )}
                            </div>

                            {!isConnected ? (
                                <div className="space-y-4">
                                    {/* Player Name */}
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Your Name</label>
                                        <input
                                            type="text"
                                            value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#00f5ff] focus:outline-none"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    {/* Create Room */}
                                    <button
                                        onClick={handleCreateRoom}
                                        className="w-full py-3 bg-gradient-to-r from-[#ff006e] to-[#8338ec] rounded-xl font-display font-bold flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" /> Create Room
                                    </button>

                                    <div className="flex items-center gap-2 text-white/30">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-xs">or</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    {/* Join Room */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                            maxLength={6}
                                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white uppercase font-mono tracking-wider placeholder:text-white/30 focus:border-[#00f5ff] focus:outline-none"
                                            placeholder="ROOM CODE"
                                        />
                                        <button
                                            onClick={handleJoinRoom}
                                            disabled={joinCode.length !== 6}
                                            className="px-4 py-3 bg-[#00f5ff] text-[#0f0a1e] rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Room Info */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-white/40">Room Code</span>
                                            {isHost && (
                                                <span className="text-[10px] bg-[#ff006e]/20 text-[#ff006e] px-2 py-0.5 rounded font-bold">
                                                    HOST
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-2xl font-bold tracking-wider">{roomCode}</span>
                                            <button
                                                onClick={copyRoomCode}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Your ID */}
                                    <div>
                                        <label className="text-xs text-white/40 mb-1 block">Your Player ID</label>
                                        <code className="text-xs text-white/60 break-all">{playerId}</code>
                                    </div>

                                    <button
                                        onClick={handleLeaveRoom}
                                        className="w-full py-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 font-bold hover:bg-red-500/30 transition-colors"
                                    >
                                        Leave Room
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Players List */}
                        {isConnected && (
                            <div className="bg-[#1a0f2e] border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-[#00f5ff]" />
                                    <h2 className="font-display font-bold text-lg">Players ({players.length})</h2>
                                </div>

                                <div className="space-y-2">
                                    {players.map((player) => (
                                        <div
                                            key={player.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl ${player.id === playerId
                                                ? "bg-[#00f5ff]/10 border border-[#00f5ff]/30"
                                                : "bg-white/5"
                                                }`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center font-bold text-sm">
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-sm">
                                                    {player.name}
                                                    {player.isHost && (
                                                        <span className="ml-2 text-[10px] text-[#ff006e]">HOST</span>
                                                    )}
                                                    {player.id === playerId && (
                                                        <span className="ml-2 text-[10px] text-[#00f5ff]">YOU</span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-white/30 font-mono">
                                                    {player.id.slice(0, 16)}...
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle Column - Test Actions */}
                    <div className="space-y-4">
                        {isConnected && (
                            <>
                                {/* Test Actions */}
                                <div className="bg-[#1a0f2e] border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="w-5 h-5 text-[#39ff14]" />
                                        <h2 className="font-display font-bold text-lg">Test Actions</h2>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={testBroadcast}
                                            className="w-full py-3 bg-[#39ff14]/10 border border-[#39ff14]/40 rounded-xl text-[#39ff14] font-bold hover:bg-[#39ff14]/20 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" /> Broadcast State
                                        </button>

                                        <button
                                            onClick={testAction}
                                            className="w-full py-3 bg-[#8338ec]/10 border border-[#8338ec]/40 rounded-xl text-[#8338ec] font-bold hover:bg-[#8338ec]/20 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Zap className="w-4 h-4" /> Send Player Action
                                        </button>

                                        {isHost && (
                                            <button
                                                onClick={testStartGame}
                                                className="w-full py-3 bg-[#ff006e]/10 border border-[#ff006e]/40 rounded-xl text-[#ff006e] font-bold hover:bg-[#ff006e]/20 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Play className="w-4 h-4" /> Start Game (Host)
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Current Game State */}
                                <div className="bg-[#1a0f2e] border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Eye className="w-5 h-5 text-[#00f5ff]" />
                                        <h2 className="font-display font-bold text-lg">Game State</h2>
                                    </div>

                                    <pre className="bg-black/50 rounded-xl p-4 text-xs text-green-400 font-mono overflow-x-auto">
                                        {JSON.stringify(testGameState, null, 2)}
                                    </pre>
                                </div>

                                {/* Simulated Players */}
                                <div className="bg-[#1a0f2e] border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Bug className="w-5 h-5 text-[#8338ec]" />
                                            <h2 className="font-display font-bold text-lg">Simulated Players</h2>
                                        </div>
                                        <button
                                            onClick={addSimulatedPlayer}
                                            className="p-2 rounded-lg bg-[#8338ec]/20 text-[#8338ec] hover:bg-[#8338ec]/30 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-xs text-white/40 mb-4">
                                        Add simulated players to test multiplayer sync in the same browser.
                                    </p>

                                    <div className="space-y-3">
                                        {simulatedPlayers.map((simId) => (
                                            <SimulatedPlayer
                                                key={simId}
                                                roomCode={roomCode!}
                                                onClose={() => removeSimulatedPlayer(simId)}
                                            />
                                        ))}

                                        {simulatedPlayers.length === 0 && (
                                            <div className="text-center py-6 text-white/30 text-sm">
                                                No simulated players yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column - Event Log */}
                    <div className="bg-[#1a0f2e] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-display font-bold text-lg">Event Log</h2>
                            <button
                                onClick={() => setEventLog([])}
                                className="text-xs text-white/40 hover:text-white"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="h-[600px] overflow-y-auto space-y-1 font-mono text-xs">
                            {eventLog.length === 0 ? (
                                <div className="text-white/30 text-center py-8">
                                    No events yet. Create or join a room to start.
                                </div>
                            ) : (
                                eventLog.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="py-1 px-2 rounded bg-white/5 text-white/70"
                                    >
                                        {log}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
