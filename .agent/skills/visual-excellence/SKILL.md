---
name: Visual Excellence
description: Project-specific design system enforcement for Neon and Glass aesthetics, including advanced UI/UX patterns
---

# Visual Excellence Skill

This skill ensures that all UI components in the PartyPack project adhere to the premium "Neon & Glass" design system.

## Core Design Tokens

### Standard Colors

Always use these CSS variables or their Tailwind equivalent:

- **Neon Pink**: `#ff006e` (Primary action, high energy)
- **Neon Purple**: `#8338ec` (Secondary action, depth)
- **Electric Cyan**: `#00f5ff` (Accent, interactive elements)
- **Deep Background**: `#0a0015` (Main surface)

### Glassmorphism Pattern

Use these classes for a consistent frosted glass look:

```tsx
<div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-md bg-white/5">
```

## Animation Presets (Framer Motion)

### Hover Glow

```tsx
<motion.button
  whileHover={{
    scale: 1.02,
    boxShadow: "0 0 20px rgba(255, 0, 110, 0.4)",
    borderColor: "rgba(255, 0, 110, 0.6)"
  }}
  whileTap={{ scale: 0.98 }}
>
```

### Entrance Fade & Slide

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
>
```

## UI Best Practices

- **No Borders**: Prefer `border-white/10` or `border-white/20` over solid borders.
- **Radii**: Use `2xl` (1rem) for main cards and `xl` (0.75rem) for buttons.
- **Typography**:
  - `font-display` (Orbitron) for game titles and big numbers.
  - `font-body` (Space Grotesk) for all readable text.
  - `font-pixel` (Press Start 2P) for retro-themed accents and scores.
- **Accessibility**:
  - Contrast: Minimum 4.5:1 for body text, 3:1 for large text against neon backgrounds.
  - Scale: All interactive elements must scale gracefully up to 200% zoom.
  - ARIA: Use `aria-live="polite"` for game state updates (e.g., "It's your turn").
- **Touch Interaction**:
  - Minimum touch target: 44x44px (`touch-target` class).
  - Feedback: Always provide visual feedback (glow/scale) on `pointerdown`.
  - Gestures: Use `touch-none` for custom gesture areas to prevent browser interference.

## Common Components

- **GameCard**: High-contrast, glowing borders on hover.
- **NeonButton**: Full width, saturated background with white text and `drop-shadow`.
