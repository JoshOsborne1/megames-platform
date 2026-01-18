---
name: Game UI Patterns
description: Consistent UI patterns and shared components for PartyPack games
---

# Game UI Patterns Skill

## Design System Tokens

### Colors

```css
--background: #0a0015 /* Deep purple-black */ --primary: #ff006e /* Neon Pink */
  --secondary: #8338ec /* Neon Purple */ --accent: #00f5ff /* Electric Cyan */
  /* Per-game accents (from config/games.ts) */ --dynamic-decks: #ff006e
  --lyric-legends: #ff00ff --shade-signals: #00ffff --quiz-quarter: #22c55e;
```

### Fonts

```css
--font-display: "Orbitron" /* Headers, titles */ --font-body: "Space Grotesk"
  /* Body text */ --font-pixel: "Press Start 2P" /* Retro accents */;
```

## Shared Components

### InGameNav

Top navigation bar during gameplay:

```tsx
import { InGameNav } from "@/components/games/shared";

<InGameNav
  gameName="Game Name"
  timer={timeRemaining} // optional
  onLeave={handleLeave}
/>;
```

### PlayersModal

Modal for adding/managing players:

```tsx
import { PlayersModal } from "@/components/games/shared";

<PlayersModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  players={players}
  onAddPlayer={addPlayer}
  onRemovePlayer={removePlayer}
  maxPlayers={10}
/>;
```

### InfoButton

Collapsible help/rules section:

```tsx
import { InfoButton } from "@/components/games/shared";

<InfoButton title="How to Play">
  <p>Game rules go here...</p>
</InfoButton>;
```

### GameModeSelector

Toggle between game modes:

```tsx
import { GameModeSelector } from "@/components/games/shared";

<GameModeSelector
  modes={[
    { id: "classic", label: "Classic", description: "Standard rules" },
    { id: "qm", label: "Quiz Master", description: "One reader, all guess" },
  ]}
  selected={gameMode}
  onChange={setGameMode}
/>;
```

### WatchAdButton

Rewarded ad button for boosts:

```tsx
import { WatchAdButton } from "@/components/games/shared";

<WatchAdButton label="Watch Ad for Boost" onComplete={() => grantBoost()} />;
```

## Hooks

### usePlayerSetup

```tsx
import { usePlayerSetup } from "@/hooks/usePlayerSetup";

const {
  players, // PlayerSetupPlayer[]
  newName, // string (input value)
  setNewName, // setter for input
  addPlayer, // () => void
  removePlayer, // (id: string) => void
  canStart, // boolean (min players met)
  canAddMore, // boolean (under max)
} = usePlayerSetup({ minPlayers: 2, maxPlayers: 10 });
```

### useHaptic

```tsx
import { useHaptic } from "@/hooks/useHaptic";

const { trigger } = useHaptic();
trigger("light"); // iOS haptic feedback
```

## UI Classes

### Cards

```tsx
// Glassmorphism card
<div className="glass-card rounded-2xl p-6">

// Interactive widget card
<div className="widget-card">
```

### Buttons

```tsx
// Primary action
<button className="w-full py-4 rounded-xl bg-[#00FFFF] text-black font-display font-bold">

// Secondary action
<button className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white">

// Danger action
<button className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400">
```

### Text

```tsx
// Display heading
<h1 className="font-display font-bold text-2xl text-white">

// Muted label
<p className="text-white/40 text-xs uppercase tracking-wider">

// Gradient text
<span className="text-gradient-primary">
```

## Game Phase Pattern

Games follow this phase structure:

```typescript
type GamePhase =
  | "setup"         // Player selection, settings
  | "instructions"  // Show turn order, rules
  | "playing"       // Active gameplay
  | "round-end"     // Round summary
  | "game-over"     // Final leaderboard

// Phase transitions via AnimatePresence
<AnimatePresence mode="wait">
  {phase === "setup" && <SetupScreen key="setup" />}
  {phase === "playing" && <PlayScreen key="playing" />}
  {phase === "game-over" && <GameOverScreen key="game-over" />}
</AnimatePresence>
```

## Mobile Considerations

- All touch targets minimum 44x44px (`.touch-target`)
- Use `touch-none` on canvas/draggable elements
- Safe area padding: `pb-safe` or `env(safe-area-inset-bottom)`
- Prevent iOS zoom: inputs must be 16px+ font size
