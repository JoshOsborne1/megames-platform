---
name: Testing Strategies
description: Standardized testing patterns for game logic, multiplayer flows, and performance benchmarks.
---

# Testing Strategies Skill

This skill provides patterns for ensuring the reliability and performance of PartyPack games.

## 1. Game Logic (Unit Testing)

Pure game logic (calculating scores, determining winners) should be tested with Vitest/Jest.

```typescript
// example.test.ts
import { calculateScore } from "./gameLogic";

test("calculates correct score for bullseye", () => {
  expect(calculateScore({ distance: 0 })).toBe(100);
});
```

## 2. Multiplayer Flows (Integration)

Test the `RoomManager` and `useMultiplayerRoom` hook using mocked Supabase channels.

- Verify host promotion on disconnect.
- Verify state synchronization across simulated clients.

## 3. Performance Benchmarking

- **FPS Check**: Ensure games maintain 60 FPS on mid-range mobile devices.
- **Payload Size**: Monitor broadcast payloads; aim for < 1KB per update.
- **Memory**: Check for leaks in long-running sessions using Chrome DevTools.

## 4. UI/UX Verification

- **Touch Targets**: Automate checks for 44x44px targets.
- **Contrast**: Use automated accessibility audits (axe-core) to verify neon theme contrast.

## 5. Deployment Verification

Always run a build check before deployment to catch lint/type errors early.

```bash
npm run build
```
