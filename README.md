# Bumply

A mobile-first pregnancy daily wellness tracker: water, food diary, customizable tasks, and vitamins.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Neon (PostgreSQL + Neon Auth with Google sign-in)
- Vercel

## Setup

### 1. Neon

1. Create a project at [neon.tech](https://neon.tech).
2. Enable **Neon Auth** in the Neon Console (Project → Auth).
3. In Auth configuration, enable **Google** as a sign-in provider.
4. In **SQL Editor**, run the migration in [`neon/migrations/001_initial_schema.sql`](neon/migrations/001_initial_schema.sql).  
   (Run this after Neon Auth is enabled — it creates the `neon_auth` schema.)

### 2. Environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` — pooled connection string from the Neon Console
- `NEON_AUTH_BASE_URL` — Auth URL from Neon Console → Auth → Configuration
- `NEON_AUTH_COOKIE_SECRET` — generate with `openssl rand -base64 32`

### 3. Run locally (no Neon required)

If `DATABASE_URL` is **not** set, the app automatically uses an **in-memory database** — perfect for local development. Data persists for the life of the dev server process and resets on restart.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To force memory mode even with Neon configured, set `USE_MEMORY_DB=true` in `.env.local`.

### 4. Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add environment variables:
   - `DATABASE_URL`
   - `NEON_AUTH_BASE_URL`
   - `NEON_AUTH_COOKIE_SECRET`
3. Deploy.

## Features

- **Today** — summary cards, water quick-add, food diary, task & vitamin checklists
- **History** — last 30 days with day detail view
- **Settings** — due date, manage checklist items

Auth uses Google sign-in via Neon Auth. Unauthenticated users are redirected to `/auth/sign-in`.
