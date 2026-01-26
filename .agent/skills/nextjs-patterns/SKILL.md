---
name: NextJS Patterns
description: Next.js 15 and React 19 principles. Server Actions, data fetching, and optimistic UI.
---

# NextJS Patterns Skill

This skill ensures the project uses modern React and Next.js features effectively.

## 1. Server Components vs Client Components

- **Server (Default)**: Use for data fetching, layouts, and static content. No `useState` or `useEffect`.
- **Client ('use client')**: Use for interactivity, forms, and browser-only APIs.

## 2. Server Actions (Mutations)

Always validate input using Zod and handle errors gracefully.

```tsx
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  gameId: z.string().uuid(),
  score: z.number().min(0),
});

export async function updateScore(formData: FormData) {
  const validated = schema.parse(Object.fromEntries(formData));
  // Update Supabase...
  revalidatePath("/leaderboard");
}
```

## 3. React 19 Patterns

### useOptimistic

Use for immediate UI feedback during server mutations (e.g., submitting a guess).

### useActionState

Use for form submission states, handling pending and error states automatically.

## 4. Caching & Revalidation

- **Static (Default)**: Cached at build time.
- **ISR**: Use `revalidate` in `fetch` or route config for time-based refresh.
- **Dynamic**: Use `no-store` or `export const dynamic = 'force-dynamic'` for real-time pages.

## 5. Metadata

- Always implement `generateMetadata` for dynamic game pages to ensure correct social previews.
- Include Open Graph (OG) tags and descriptive titles.
