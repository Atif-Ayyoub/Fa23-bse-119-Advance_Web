# AdFlow Pro

Production-style moderated ads marketplace foundation built with React, Tailwind CSS, and Supabase.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Supabase JS
- Framer Motion
- React Hook Form + Zod
- Recharts
- Lucide React

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure environment values:
   - copy `.env.example` to `.env.local`
   - set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Run the app:
   - `npm run dev`

## Phase 1 Scope Completed

- React app initialized
- Tailwind configured with font extensions and theme tokens
- Supabase client connected via env variables
- Google Fonts configured (Poppins + Inter)
- Global theme and dashboard layout created
- Base database schema migration prepared
- RLS policy starter set added
- Role and route constants defined
- Route skeleton prepared for public/auth/client/moderator/admin
- Reusable UI kit initialized

## Structure

See the source folders under `src/`:

- `components/ui`, `components/layout`, `components/tables`
- `pages/public`, `pages/auth`, `pages/client`, `pages/moderator`, `pages/admin`
- `features/*` domain modules (phase-ready)
- `lib/supabase`, `lib/utils`, `lib/validators`
- `constants`, `animations`, `routes`

## Supabase SQL

Base SQL is available in:

- `supabase/migrations/0001_base_schema.sql`

Docs:

- `docs/phase-1-architecture.md`
- `docs/phase-1-route-map.md`
