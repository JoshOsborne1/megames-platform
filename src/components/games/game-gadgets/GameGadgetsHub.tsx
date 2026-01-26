"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Dice1, Hash, MessageSquare, Timer, Wrench, Maximize2, Minimize2, Minus, Plus, GripVertical, X } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";
import { LYRIC_WORDS, MAX_DICE, MIN_DICE } from "@/lib/games/game-gadgets/data";
import { ToolType, DiceState, NumberState, WordState, TimerState } from "@/lib/games/game-gadgets/types";
import Link from "next/link";

const ACCENT_COLOR = "#F59E0B";
const TIMER_PRESETS = [15, 30, 60, 120];

const TOOLS: { id: ToolType; name: string; icon: typeof Dice1 }[] = [
  { id: "dice", name: "Dice", icon: Dice1 },
  { id: "number", name: "Number", icon: Hash },
  { id: "word", name: "Word", icon: MessageSquare },
  { id: "timer", name: "Timer", icon: Timer },
];

export function GameGadgetsHub() {
  const { trigger } = useHaptic();
  const [toolOrder, setToolOrder] = useState<ToolType[]>(["dice", "number", "word", "timer"]);
  const [activeTools, setActiveTools] = useState<Set<ToolType>>(new Set(["dice", "timer"]));
  const [fullscreenTool, setFullscreenTool] = useState<ToolType | null>(null);
  const [showTimerComplete, setShowTimerComplete] = useState(false);

  // Double-tap reset tracking for timer only
  const timerLastTapRef = useRef<number>(0);

  // States
  const [diceState, setDiceState] = useState<DiceState>({ values: [1], count: 1, isRolling: false, total: 1 });
  const [numberState, setNumberState] = useState<NumberState>({ min: 1, max: 10, value: null, isGenerating: false });
  const [wordState, setWordState] = useState<WordState>({ word: null, isGenerating: false });
  const [timerState, setTimerState] = useState<TimerState>({ duration: 30, remaining: 30, isRunning: false, isPaused: false });

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState.isRunning && !timerState.isPaused && timerState.remaining > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          const newRemaining = prev.remaining - 1;
          if ([10, 5, 3, 2, 1].includes(newRemaining)) trigger();
          if (newRemaining <= 0) {
            trigger();
            setShowTimerComplete(true);
            return { ...prev, remaining: 0, isRunning: false };
          }
          return { ...prev, remaining: newRemaining };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.isPaused, timerState.remaining, trigger]);

  // Auto-hide timer complete popup
  useEffect(() => {
    if (showTimerComplete) {
      const timeout = setTimeout(() => setShowTimerComplete(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [showTimerComplete]);

  const toggleTool = (tool: ToolType) => {
    trigger();
    setActiveTools(prev => {
      const next = new Set(prev);
      if (next.has(tool)) next.delete(tool);
      else next.add(tool);
      return next;
    });
  };

  // Double-tap to reset for timer ONLY
  const handleTimerDoubleTapReset = () => {
    const now = Date.now();
    if (now - timerLastTapRef.current < 400) {
      // Double-tap detected - reset timer
      trigger();
      setTimerState(prev => ({ ...prev, remaining: prev.duration, isRunning: false, isPaused: false }));
      setShowTimerComplete(false);
      timerLastTapRef.current = 0;
    } else {
      // First tap - toggle timer
      timerLastTapRef.current = now;
      toggleTimer();
    }
  };

  // Dice
  const rollDice = useCallback(() => {
    if (diceState.isRolling) return;
    trigger();
    setDiceState(prev => ({ ...prev, isRolling: true }));
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceState(prev => {
        const newValues = Array.from({ length: prev.count }, () => Math.floor(Math.random() * 6) + 1);
        return { ...prev, values: newValues, total: newValues.reduce((a, b) => a + b, 0) };
      });
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        trigger();
        setDiceState(prev => ({ ...prev, isRolling: false }));
      }
    }, 100);
  }, [diceState.isRolling, trigger]);

  // Number
  const generateNumber = useCallback(() => {
    if (numberState.isGenerating) return;
    trigger();
    setNumberState(prev => ({ ...prev, isGenerating: true }));
    let count = 0;
    const interval = setInterval(() => {
      setNumberState(prev => ({
        ...prev,
        value: Math.floor(Math.random() * (prev.max - prev.min + 1)) + prev.min,
      }));
      count++;
      if (count >= 15) {
        clearInterval(interval);
        trigger();
        setNumberState(prev => ({ ...prev, isGenerating: false }));
      }
    }, 50);
  }, [numberState.isGenerating, trigger]);

  // Word
  const generateWord = useCallback(() => {
    if (wordState.isGenerating) return;
    trigger();
    setWordState({ word: null, isGenerating: true });
    let count = 0;
    const interval = setInterval(() => {
      setWordState(prev => ({
        ...prev,
        word: LYRIC_WORDS[Math.floor(Math.random() * LYRIC_WORDS.length)],
      }));
      count++;
      if (count >= 12) {
        clearInterval(interval);
        trigger();
        setWordState(prev => ({ ...prev, isGenerating: false }));
      }
    }, 80);
  }, [wordState.isGenerating, trigger]);

  // Timer controls
  const toggleTimer = () => {
    trigger();
    setShowTimerComplete(false);
    if (!timerState.isRunning) {
      setTimerState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    } else if (timerState.isPaused) {
      setTimerState(prev => ({ ...prev, isPaused: false }));
    } else {
      setTimerState(prev => ({ ...prev, isPaused: true }));
    }
  };

  const setCustomDuration = (seconds: number) => {
    const clamped = Math.max(5, Math.min(3600, seconds));
    setTimerState(prev => ({ ...prev, duration: clamped, remaining: clamped, isRunning: false, isPaused: false }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timerProgress = timerState.duration > 0 ? timerState.remaining / timerState.duration : 1;
  const timerIsLow = timerState.remaining <= 10 && timerState.remaining > 0;
  const timerIsVeryLow = timerState.remaining <= 5 && timerState.remaining > 0;

  // Fullscreen view
  if (fullscreenTool) {
    const tool = TOOLS.find(t => t.id === fullscreenTool)!;
    return (
      <div className="min-h-screen text-white flex flex-col pt-safe">
        {/* Pinned timer */}
        {timerState.isRunning && fullscreenTool !== "timer" && (
          <motion.div initial={{ y: -50 }} animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-safe">
            <motion.div animate={{ scale: timerIsVeryLow ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: timerIsVeryLow ? Infinity : 0, duration: 0.5 }}
              onClick={() => setFullscreenTool("timer")}
              className="px-4 py-2 rounded-full cursor-pointer flex items-center gap-2"
              style={{ backgroundColor: timerIsLow ? "rgba(239,68,68,0.95)" : ACCENT_COLOR }}>
              <Timer className="w-4 h-4 text-black" />
              <span className="font-display font-bold text-sm text-black">{formatTime(timerState.remaining)}</span>
            </motion.div>
          </motion.div>
        )}

        <div className="flex items-center justify-between px-4 py-2">
          <button onClick={() => setFullscreenTool(null)} className="flex items-center gap-2 text-white/60 hover:text-white">
            <Minimize2 className="w-5 h-5" /><span className="text-sm">Exit</span>
          </button>
          <div className="flex items-center gap-2">
            <tool.icon className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
            <span className="font-display font-bold text-lg">{tool.name}</span>
          </div>
          <div className="w-16" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-6">
          {fullscreenTool === "dice" && (
            <>
              <div className="flex items-center gap-4">
                <button onClick={() => { trigger(); setDiceState(prev => ({ ...prev, count: Math.max(MIN_DICE, prev.count - 1) })); }}
                  className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><Minus className="w-5 h-5" /></button>
                <span className="text-2xl font-bold w-8 text-center">{diceState.count}</span>
                <button onClick={() => { trigger(); setDiceState(prev => ({ ...prev, count: Math.min(MAX_DICE, prev.count + 1) })); }}
                  className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><Plus className="w-5 h-5" /></button>
              </div>
              <motion.div whileTap={{ scale: 0.95 }} onClick={rollDice} className="flex flex-wrap justify-center gap-6 cursor-pointer">
                {diceState.values.slice(0, diceState.count).map((v, i) => (
                  <motion.div key={i} animate={{ rotate: diceState.isRolling ? [0, 360] : 0 }}
                    transition={{ duration: 0.3, repeat: diceState.isRolling ? Infinity : 0 }}
                    className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center font-display font-black text-5xl"
                    style={{ backgroundColor: `${ACCENT_COLOR}15`, borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}>{v}</motion.div>
                ))}
              </motion.div>
              {diceState.count > 1 && <p className="font-display font-black text-4xl" style={{ color: ACCENT_COLOR }}>= {diceState.total}</p>}
              <p className="text-white/30 text-sm">Tap dice to roll</p>
            </>
          )}

          {fullscreenTool === "number" && (
            <>
              <div className="flex items-center gap-3">
                <input type="number" value={numberState.min} onChange={(e) => setNumberState(prev => ({ ...prev, min: parseInt(e.target.value) || 1 }))}
                  className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center font-bold" />
                <span className="text-white/30">–</span>
                <input type="number" value={numberState.max} onChange={(e) => setNumberState(prev => ({ ...prev, max: parseInt(e.target.value) || 100 }))}
                  className="w-20 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center font-bold" />
              </div>
              <motion.div whileTap={{ scale: 0.9 }} onClick={generateNumber} className="cursor-pointer py-8">
                <motion.p key={numberState.value} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                  className="font-display font-black text-8xl" style={{ color: numberState.value ? ACCENT_COLOR : "rgba(255,255,255,0.2)" }}>
                  {numberState.isGenerating ? "..." : (numberState.value ?? "?")}
                </motion.p>
              </motion.div>
              <p className="text-white/30 text-sm">Tap to generate</p>
            </>
          )}

          {fullscreenTool === "word" && (
            <>
              <motion.div whileTap={{ scale: 0.95 }} onClick={generateWord} className="cursor-pointer py-8">
                <motion.p key={wordState.word} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                  className="font-display font-black text-5xl uppercase tracking-wider text-center"
                  style={{ color: wordState.word ? ACCENT_COLOR : "rgba(255,255,255,0.2)" }}>
                  {wordState.isGenerating ? "..." : (wordState.word ?? "Tap")}
                </motion.p>
              </motion.div>
              <p className="text-white/30 text-sm">Tap to generate</p>
            </>
          )}

          {fullscreenTool === "timer" && (
            <>
              {!timerState.isRunning && (
                <div className="flex gap-2">
                  {TIMER_PRESETS.map(p => (
                    <button key={p} onClick={() => setCustomDuration(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${timerState.duration === p ? "bg-white/15" : "bg-white/5"}`}>
                      {p < 60 ? `${p}s` : `${p / 60}m`}
                    </button>
                  ))}
                </div>
              )}
              {!timerState.isRunning && (
                <div className="flex items-center gap-2">
                  <input type="number" value={timerState.duration} onChange={(e) => setCustomDuration(parseInt(e.target.value) || 30)}
                    className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center font-bold" />
                  <span className="text-white/40">sec</span>
                </div>
              )}
              <motion.div whileTap={{ scale: 0.95 }} onClick={handleTimerDoubleTapReset} className="relative w-48 h-48 cursor-pointer">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <motion.circle cx="96" cy="96" r="88" fill="none" stroke={timerIsLow ? "#ef4444" : ACCENT_COLOR}
                    strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - timerProgress)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span animate={{ scale: timerIsVeryLow ? [1, 1.15, 1] : 1 }}
                    transition={{ repeat: timerIsVeryLow ? Infinity : 0, duration: 0.5 }}
                    className="font-display font-black text-5xl" style={{ color: timerIsLow ? "#ef4444" : ACCENT_COLOR }}>
                    {formatTime(timerState.remaining)}
                  </motion.span>
                  {timerState.isPaused && <span className="text-white/40 text-sm">Paused</span>}
                </div>
              </motion.div>
              <p className="text-white/30 text-sm">Tap to {timerState.isRunning ? (timerState.isPaused ? "resume" : "pause") : "start"} · Double-tap to reset</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Normal view
  const activeToolsList = toolOrder.filter(id => activeTools.has(id));

  return (
    <div className="min-h-screen text-white max-w-md mx-auto px-4 pb-24 pt-safe">
      {/* Timer Complete Popup - positioned from bottom nav area */}
      <AnimatePresence>
        {showTimerComplete && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-amber-400/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-white">Time&apos;s Up!</p>
                  <p className="text-white/80 text-sm">Your timer has finished</p>
                </div>
              </div>
              <button onClick={() => setShowTimerComplete(false)} className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned timer preview */}
      <AnimatePresence>
        {timerState.isRunning && (
          <motion.div initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-safe pointer-events-none">
            <motion.div
              animate={{ scale: timerIsVeryLow ? [1, 1.08, 1] : 1, boxShadow: timerIsVeryLow ? ["0 0 20px rgba(239,68,68,0.5)", "0 0 40px rgba(239,68,68,0.8)", "0 0 20px rgba(239,68,68,0.5)"] : "0 4px 20px rgba(0,0,0,0.3)" }}
              transition={{ repeat: timerIsVeryLow ? Infinity : 0, duration: 0.5 }}
              className="px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto cursor-pointer"
              style={{ backgroundColor: timerIsLow ? "rgba(239,68,68,0.95)" : ACCENT_COLOR }}
              onClick={() => setFullscreenTool("timer")}>
              <Timer className="w-3.5 h-3.5 text-black" />
              <span className="font-display font-bold text-sm text-black">{formatTime(timerState.remaining)}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-3">
        <Link href="/lobby" className="inline-block mb-1">
          <span className="text-white/40 text-sm hover:text-white/60">← Back</span>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <Wrench className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
          <h1 className="font-display font-bold text-lg text-white">Game Gadgets</h1>
        </div>
      </div>

      {/* Compact toggle bar */}
      <div className="flex items-center justify-center gap-1 mb-3">
        {TOOLS.map(tool => {
          const isActive = activeTools.has(tool.id);
          const isTimerRunning = tool.id === "timer" && timerState.isRunning;
          return (
            <motion.button key={tool.id} whileTap={{ scale: 0.9 }} onClick={() => toggleTool(tool.id)}
              className={`p-2 rounded-lg transition-all ${isActive ? (isTimerRunning ? "bg-amber-500/20 border border-amber-500" : "bg-white/10 border border-white/20") : "bg-white/5 border border-transparent opacity-40"}`}>
              <tool.icon className="w-4 h-4" style={{ color: isActive ? (isTimerRunning ? ACCENT_COLOR : "white") : "rgba(255,255,255,0.5)" }} />
            </motion.button>
          );
        })}
      </div>

      {/* Tools */}
      <Reorder.Group axis="y" values={activeToolsList} onReorder={(newOrder) => {
        const inactive = toolOrder.filter(id => !activeTools.has(id));
        setToolOrder([...newOrder, ...inactive]);
      }} className="space-y-2">
        {activeToolsList.map(toolId => {
          const isTimerActive = toolId === "timer" && timerState.isRunning;

          return (
            <Reorder.Item key={toolId} value={toolId} className="touch-none">
              <motion.div layout className={`rounded-xl border transition-colors ${isTimerActive ? "bg-amber-500/5 border-amber-500/30" : "bg-white/5 border-white/10"}`}>
                {/* DICE - Horizontal layout */}
                {toolId === "dice" && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-white/20 cursor-grab" />
                        <Dice1 className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                        <span className="text-sm font-bold">Dice</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setDiceState(prev => ({ ...prev, count: Math.max(MIN_DICE, prev.count - 1) }))} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-bold w-3 text-center">{diceState.count}</span>
                        <button onClick={() => setDiceState(prev => ({ ...prev, count: Math.min(MAX_DICE, prev.count + 1) }))} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => setFullscreenTool("dice")} className="p-1 rounded bg-white/5"><Maximize2 className="w-3 h-3 text-white/40" /></button>
                      </div>
                    </div>
                    <motion.div whileTap={{ scale: 0.95 }} onClick={rollDice}
                      className="flex items-center justify-center gap-2 cursor-pointer py-2">
                      {diceState.values.slice(0, diceState.count).map((v, i) => (
                        <motion.div key={i} animate={{ rotate: diceState.isRolling ? [0, 360] : 0 }}
                          transition={{ duration: 0.2, repeat: diceState.isRolling ? Infinity : 0 }}
                          className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-display font-black text-xl"
                          style={{ backgroundColor: `${ACCENT_COLOR}15`, borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}>{v}</motion.div>
                      ))}
                      {diceState.count > 1 && <span className="font-display font-black text-lg ml-2" style={{ color: ACCENT_COLOR }}>= {diceState.total}</span>}
                    </motion.div>
                    <p className="text-center text-white/20 text-[10px]">Tap to roll</p>
                  </div>
                )}

                {/* NUMBER - Horizontal layout */}
                {toolId === "number" && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-white/20 cursor-grab" />
                        <Hash className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                        <span className="text-sm font-bold">Number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input type="number" value={numberState.min} onChange={(e) => setNumberState(prev => ({ ...prev, min: parseInt(e.target.value) || 1 }))}
                          className="w-12 bg-white/10 border border-white/20 rounded px-1 py-0.5 text-xs text-center font-bold" />
                        <span className="text-white/30 text-xs">–</span>
                        <input type="number" value={numberState.max} onChange={(e) => setNumberState(prev => ({ ...prev, max: parseInt(e.target.value) || 100 }))}
                          className="w-12 bg-white/10 border border-white/20 rounded px-1 py-0.5 text-xs text-center font-bold" />
                        <button onClick={() => setFullscreenTool("number")} className="p-1 rounded bg-white/5 ml-1"><Maximize2 className="w-3 h-3 text-white/40" /></button>
                      </div>
                    </div>
                    <motion.div whileTap={{ scale: 0.9 }} onClick={generateNumber}
                      className="text-center cursor-pointer py-3">
                      <motion.p key={numberState.value} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                        className="font-display font-black text-4xl" style={{ color: numberState.value ? ACCENT_COLOR : "rgba(255,255,255,0.2)" }}>
                        {numberState.isGenerating ? "..." : (numberState.value ?? "?")}
                      </motion.p>
                    </motion.div>
                    <p className="text-center text-white/20 text-[10px]">Tap to generate</p>
                  </div>
                )}

                {/* WORD */}
                {toolId === "word" && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-white/20 cursor-grab" />
                        <MessageSquare className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                        <span className="text-sm font-bold">Word</span>
                      </div>
                      <button onClick={() => setFullscreenTool("word")} className="p-1 rounded bg-white/5"><Maximize2 className="w-3 h-3 text-white/40" /></button>
                    </div>
                    <motion.div whileTap={{ scale: 0.95 }} onClick={generateWord}
                      className="text-center cursor-pointer py-3">
                      <motion.p key={wordState.word} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                        className="font-display font-black text-2xl uppercase tracking-wider"
                        style={{ color: wordState.word ? ACCENT_COLOR : "rgba(255,255,255,0.2)" }}>
                        {wordState.isGenerating ? "..." : (wordState.word ?? "Tap")}
                      </motion.p>
                    </motion.div>
                    <p className="text-center text-white/20 text-[10px]">Tap to generate</p>
                  </div>
                )}

                {/* TIMER - Horizontal layout with double-tap reset */}
                {toolId === "timer" && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-white/20 cursor-grab" />
                        <Timer className="w-4 h-4" style={{ color: ACCENT_COLOR }} />
                        <span className="text-sm font-bold">Timer</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!timerState.isRunning && (
                          <>
                            {TIMER_PRESETS.slice(0, 3).map(p => (
                              <button key={p} onClick={() => setCustomDuration(p)}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium ${timerState.duration === p ? "bg-white/15" : "bg-white/5"}`}>
                                {p < 60 ? `${p}s` : `${p / 60}m`}
                              </button>
                            ))}
                            <input type="number" value={timerState.duration} onChange={(e) => setCustomDuration(parseInt(e.target.value) || 30)}
                              className="w-12 bg-white/10 border border-white/20 rounded px-1 py-0.5 text-xs text-center font-bold ml-1" />
                          </>
                        )}
                        <button onClick={() => setFullscreenTool("timer")} className="p-1 rounded bg-white/5 ml-1"><Maximize2 className="w-3 h-3 text-white/40" /></button>
                      </div>
                    </div>
                    <motion.div whileTap={{ scale: 0.95 }} onClick={handleTimerDoubleTapReset}
                      className="flex items-center justify-center cursor-pointer py-2">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                          <motion.circle cx="32" cy="32" r="28" fill="none" stroke={timerIsLow ? "#ef4444" : ACCENT_COLOR}
                            strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * (1 - timerProgress)} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span animate={{ scale: timerIsVeryLow ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: timerIsVeryLow ? Infinity : 0, duration: 0.5 }}
                            className="font-display font-bold text-sm" style={{ color: timerIsLow ? "#ef4444" : ACCENT_COLOR }}>
                            {formatTime(timerState.remaining)}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                    <p className="text-center text-white/20 text-[10px]">Tap to {timerState.isRunning ? (timerState.isPaused ? "resume" : "pause") : "start"} · Double-tap to reset</p>
                  </div>
                )}
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {activeToolsList.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <p className="text-sm">Tap icons above to enable tools</p>
        </div>
      )}
    </div>
  );
}
