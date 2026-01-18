---
description: Add a new party game to PartyPack
---

# Add New Game Workflow

## Step 1: Define Game Configuration

Add the game to `src/config/games.ts`:

```typescript
{
  id: "game-name",
  name: "Game Name",
  description: "Short description",
  fullDescription: "Detailed description for game page",
  icon: IconComponent, // from lucide-react
  color: "#HEX",
  route: "/games/game-name",
  playerCount: "2-10",
  slogan: "Catchy tagline",
  tags: ["Tag1", "Tag2"],
}
```

## Step 2: Create Game Library Files

Create folder `src/lib/games/[game-name]/`:

### types.ts

```typescript
export interface GamePlayer {
  id: string;
  name: string;
  score: number;
  // game-specific fields
}

export interface GameState {
  phase: GamePhase;
  players: GamePlayer[];
  currentRound: number;
  // game-specific state
}

export type GamePhase = "setup" | "playing" | "round-end" | "game-over";
```

### gameLogic.ts

- State transitions
- Scoring calculations
- Win conditions

### data.ts

- Cards, questions, or game content

## Step 3: Create Game Component

Create `src/app/games/[game-name]/page.tsx`:

- Use `AppShell` wrapper
- Use `InGameNav` for in-game navigation
- Use `usePlayerSetup` for player management
- Follow existing game patterns (see Shade Signals)

## Step 4: Add Subscription Limits

Update `src/lib/subscription.ts`:

- Add limit to `GameLimits` interface
- Add values for Free, Pro, and GameNight tiers

// turbo

## Step 5: Verify

```bash
npm run dev
```

Navigate to `/games/[game-name]` and test all phases.
