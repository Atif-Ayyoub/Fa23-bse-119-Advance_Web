# AdFlow Pro Phase 1 Architecture

## Stack

- Frontend: React + Vite + Tailwind CSS
- Routing: React Router
- BaaS: Supabase (Auth + Postgres)
- Validation: Zod + React Hook Form
- Motion: Framer Motion
- Charts: Recharts

## Layering

- `src/components`: shared visual building blocks
- `src/pages`: route-level screens grouped by domain role
- `src/features`: role-specific and domain-specific business modules (next phases)
- `src/lib`: shared infra (Supabase client, validators, utils)
- `src/constants`: fixed enums and route maps
- `src/animations`: motion variants used across pages

## Role-aware Access Design (Phase 1)

- Auth identity comes from `auth.users`
- Role metadata is sourced from `profiles.role`
- Role constants defined in `src/constants/roles.js`
- Route guards and profile hydration are planned for Phase 2

## UI Foundation

- Font pairing:
  - `Poppins` for heading hierarchy
  - `Inter` for body and controls
- Theme tokens are in `src/index.css`
- Tailwind extension in `tailwind.config.js` defines `fontFamily.heading`, brand color, and shadows

## Automation Readiness

- Data model supports scheduling (`publish_at`, `expire_at`)
- Supports moderation trail (`ad_status_history`, `audit_logs`)
- Supports notifications and health probes (`notifications`, `system_health_logs`)
