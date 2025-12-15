export interface HSVColor {
  h: number;
  s: number;
  v: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorWithPosition {
  hsv: HSVColor;
  rgb: RGBColor;
  hex: string;
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isSignalGiver: boolean;
  markers: ColorWithPosition[];
}

export interface Clue {
  text: string;
  type: "first" | "second";
  timestamp: number;
}

export interface GameRound {
  roundNumber: number;
  signalGiverId: string;
  targetColor: ColorWithPosition;
  colorOptions: ColorWithPosition[];
  clues: Clue[];
  guesses: Record<string, ColorWithPosition[]>;
  scores: Record<string, number>;
  completed: boolean;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  effect: "double_points" | "steal_point" | "extra_clue" | "skip_turn";
}

export interface GameState {
  gameId: string;
  mode: "online" | "local";
  players: Player[];
  currentRound: GameRound | null;
  totalRounds: number;
  roundsCompleted: number;
  winner: Player | null;
  started: boolean;
  finished: boolean;
}
