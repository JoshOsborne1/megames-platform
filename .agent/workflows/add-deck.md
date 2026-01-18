---
description: Add a new deck or content pack to Dynamic Decks
---

# Add New Deck Workflow

## Step 1: Create Deck Data

Add to `src/lib/games/dynamic-decks/data.ts`:

```typescript
export const newDeckCards: Card[] = [
  {
    id: "deck-001",
    word: "Target Word",
    forbidden: ["Word1", "Word2", "Word3", "Word4"],
    points: 1,
    color: "yellow", // yellow | blue | green | red
    difficulty: "easy", // easy | medium | hard
  },
  // Add 50+ cards for a good deck
];
```

## Step 2: Register Deck

Add deck metadata to `DECKS` array:

```typescript
{
  id: "deck-id",
  name: "Deck Name",
  description: "What makes this deck unique",
  cardCount: newDeckCards.length,
  difficulty: "medium",
  icon: "🎯", // or LucideIcon
  isPro: false, // true for premium decks
}
```

## Step 3: Card Guidelines

- **Easy cards**: Common words, obvious associations
- **Medium cards**: Requires some thought
- **Hard cards**: Obscure or tricky to describe
- **Points**: 1 (easy), 2 (medium), 3 (hard)
- **Forbidden words**: 4 words that clue-giver cannot say

## Step 4: For Rhymes Deck

Use this format instead:

```typescript
{
  id: "rhyme-001",
  clue: "This is read when you're tucked in bed",
  answer: "Story",
  points: 1,
}
```

// turbo

## Step 5: Test

```bash
npm run dev
```

Navigate to `/games/dynamic-decks`, select new deck, play a round.
