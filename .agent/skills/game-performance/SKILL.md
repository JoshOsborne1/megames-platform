---
name: Next.js Game Performance
description: Optimizing React for high-frequency game state updates and efficiency
---

# Next.js Game Performance Skill

This skill focuses on ensuring smooth gameplay within a React/Next.js environment.

## State Management for Games

### useRef for High-Frequency Data

Data that changes every frame (like cursor position or rapidly changing timers) should stay in `useRef` to avoid re-rendering the entire component tree.

```tsx
const gameTime = useRef(startTime);
// Update in requestAnimationFrame or setInterval
useEffect(() => {
  const id = setInterval(() => {
    gameTime.current -= 1;
  }, 1000);
  return () => clearInterval(id);
}, []);
```

### State Splitting

Separate "Meta State" (menu visibility, player names) from "Active State" (game board, current turn).

```tsx
// ❌ Don't wrap everything in one context/state
// ✅ Use separate states or contexts for volatile data
```

## Rendering Optimizations

### Memoization

Wrap individual game board items or players in `React.memo` to prevent re-renders when other players make moves.

```tsx
const PlayerBadge = memo(({ player }) => {
  return <div className="...">{player.name}</div>;
});
```

### AnimatePresence Performance

Avoid large trees inside `AnimatePresence`. Only wrap the specific elements that are transitioning.

## Hydration Safety

Games often rely on random numbers or client-side timers. Use a `mounted` hook to prevent hydration mismatches.

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // or a static placeholder
```

## Performance Checklist

- Use `requestAnimationFrame` for animations over `setTimeout`.
- Batch state updates using `flushSync` only when strictly necessary for timing.
- Limit the use of CSS `backdrop-filter` inside moving elements; it is expensive.

## Advanced Optimization (Web Games Principles)

### Asset Strategy

- **Compression**: Use WebP for images and WebM/Opus for audio.
- **Progressive Loading**: Startup assets < 2MB; lazy load the rest.
- **KTX2/Draco**: Use for any 3D models or large texture maps.

### Technical Offloading

- **Web Workers**: Move heavy game logic (physics, complex AI) to a separate thread.
- **Object Pooling**: Avoid GC spikes by reusing active game objects (bullets, sparks).
- **WebGPU Readiness**: Prefer `navigator.gpu` where supported; fallback to WebGL.
