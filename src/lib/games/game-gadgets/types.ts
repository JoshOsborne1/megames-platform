export type ToolType = "dice" | "number" | "word" | "timer";

export interface DiceState {
  values: number[]; // Array of dice values (1-6)
  count: number; // Number of dice to roll
  isRolling: boolean;
  total: number;
}

export interface NumberState {
  min: number;
  max: number;
  value: number | null;
  isGenerating: boolean;
}

export interface WordState {
  word: string | null;
  isGenerating: boolean;
}

export interface TimerState {
  duration: number; // seconds
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface ActiveTool {
  type: ToolType;
  id: string;
}
