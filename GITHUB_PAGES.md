# GitHub Pages Hosting Guide

## How It Works

This repo uses **GitHub Pages** with **GitHub Actions** to automatically build and deploy the app every time you push to `master`.

### The Pipeline

```
Push to master
    ↓
GitHub Actions triggers (.github/workflows/deploy.yml)
    ↓
1. Checkout code
2. Install Node.js 20
3. npm ci (install dependencies)
4. npm run build (Vite builds to dist/)
    ↓
5. Upload dist/ as a Pages artifact
6. Deploy to GitHub Pages
    ↓
Live at: https://gogi7.github.io/sydney-property-calculator/
```

### Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | The Actions workflow — defines the build & deploy steps |
| `sydney-property-calculator/vite.config.ts` | Has `base: '/sydney-property-calculator/'` so asset paths work on Pages |
| `sydney-property-calculator/dist/` | Build output (generated, not committed) |

### First-Time Setup

After pushing the workflow, you need to enable Pages in the repo:

1. Go to **Settings → Pages** on GitHub
2. Under **Source**, select **GitHub Actions**
3. That's it — next push will trigger a deploy

---

## Pros

- **Free forever** — no limits for public repos, 1GB storage, 100GB/month bandwidth
- **Zero config hosting** — no server to manage, no accounts to create
- **Auto-deploys** — push code, it's live in ~2 minutes
- **Custom domains** — can add your own domain for free (Settings → Pages → Custom domain)
- **SSL included** — HTTPS out of the box
- **Version controlled** — your deployment IS your repo, full history
- **CDN-backed** — GitHub serves from a global CDN, decent performance

## Cons

- **Static only** — no server-side code, no API routes, no backend
- **No environment variables at runtime** — everything is baked into the build
- **Build time limits** — 10 minutes max per build (plenty for this app)
- **Bandwidth cap** — 100GB/month (fine for personal projects, not for viral apps)
- **No serverless functions** — can't add API endpoints
- **Single page app routing** — needs a 404.html hack for client-side routing (not an issue for this app currently)
- **Public repos only** (for free) — private repos need GitHub Pro for Pages
- **Cold starts** — no concept of cold starts (it's static files), but also no dynamic content

## Limitations

- **No databases** — can't run SQLite, PostgreSQL, or any DB
- **No server-side logic** — can't process forms, handle auth, or call APIs that need secrets
- **No SSR** — no server-side rendering, everything is client-side
- **No WebSockets** — no real-time server push
- **Soft limit of 1GB** for published site size
- **Rate limiting** — GitHub may throttle if you deploy too frequently (>10 builds/hour)
- **No analytics built in** — need to add something like Plausible or Google Analytics yourself

---

## When to Move: If the App Evolves

### Adding a Database

If you need to store user data, saved calculations, or user accounts:

**Option 1: Keep frontend on Pages + separate backend**
- Host a backend API on **Railway**, **Render**, or **Fly.io** (all have free tiers)
- Frontend calls the API from GitHub Pages
- DB lives on the backend service
- Pros: Simple split, frontend stays free
- Cons: CORS setup, two things to manage

**Option 2: Move everything to Vercel/Netlify**
- Both support serverless API routes alongside your frontend
- Connect to a managed DB like **Supabase** (free tier: 500MB), **PlanetScale**, or **Neon** (free Postgres)
- Pros: One platform, easy
- Cons: Vendor lock-in, usage limits on free tier

**Option 3: Full backend (Railway, Render, Fly.io)**
- Host a full Node/Express/FastAPI server with a DB
- Railway: free $5/month credits
- Render: free tier with 750 hours/month
- Fly.io: free tier with 3 shared VMs
- Pros: Full control
- Cons: More complex, cold starts on free tiers

### Adding Authentication

- **Supabase Auth** or **Clerk** — free tiers, works with static sites
- **Firebase Auth** — Google's option, generous free tier
- No need to leave Pages just for auth

### Adding Real-Time Features

- **Supabase Realtime** — free tier
- **Firebase Realtime DB** — free tier
- Or move to Vercel/Netlify with WebSocket support

### Decision Matrix

| Need | Stay on Pages? | Best Alternative |
|------|:-:|---|
| Static calculator (now) | ✅ Yes | — |
| Save/share calculations | ⚠️ Use localStorage or URL params | Supabase + Pages |
| User accounts | ⚠️ Use external auth (Clerk/Supabase) | Vercel + Supabase |
| Database storage | ❌ No | Vercel + Supabase or Railway |
| Server-side API | ❌ No | Vercel (API routes) or Railway |
| Real-time collab | ❌ No | Vercel or Fly.io |

### Migration Path (When Ready)

1. **Easiest next step:** Add Supabase for DB + Auth while keeping Pages for hosting
2. **If that's not enough:** Move to Vercel (minimal changes — it supports Vite natively)
3. **If you need full control:** Dockerize and deploy to Railway or Fly.io

---

## Quick Reference

| Item | Value |
|------|-------|
| **Live URL** | https://gogi7.github.io/sydney-property-calculator/ |
| **Deploy trigger** | Push to `master` branch |
| **Manual deploy** | Actions tab → "Deploy to GitHub Pages" → Run workflow |
| **Build tool** | Vite (React + TypeScript) |
| **Build output** | `sydney-property-calculator/dist/` |
| **Build time** | ~1-2 minutes |
| **Cost** | Free |
