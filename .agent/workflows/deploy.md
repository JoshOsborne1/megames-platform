---
description: Build and deploy PartyPack to production
---

# Deploy Workflow

// turbo-all

## Step 1: Lint Check

```bash
npm run lint
```

Fix any errors before proceeding.

## Step 2: Type Check

```bash
npx tsc --noEmit
```

Ensure no TypeScript errors.

## Step 3: Build Production

```bash
npm run build
```

Verify build completes without errors.

## Step 4: Test Build Locally (Optional)

```bash
npm run start
```

Open http://localhost:3000 and verify core flows.

## Step 5: Commit Changes

```bash
git add .
git commit -m "feat: description of changes"
```

## Step 6: Push to Remote

```bash
git push origin main
```

## Step 7: Deploy

If using Vercel (auto-deploys on push to main):

- Check Vercel dashboard for deployment status
- Verify preview URL before promoting to production

## Post-Deploy Checklist

- [ ] Test home page loads
- [ ] Test at least one game flow
- [ ] Test authentication (login/signup)
- [ ] Test on iOS Safari (PWA mode)
- [ ] Check Supabase dashboard for any errors
