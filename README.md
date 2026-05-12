# Pulse RP Community Website

A full-stack, multi-page Next.js community hub for Pulse RP, a FiveM GTA V roleplay server powered by the Mythic Framework.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS with Pulse RP CSS variables
- Framer Motion page transitions
- Lucide React icons
- TipTap rich text editor placeholders
- Next.js API routes for FiveM status, Steam auth, Discord OAuth, queue, admin settings, and Ko-fi membership webhook

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and replace placeholders:

- `FIVEM_PUBLIC_ID`
- `FIVEM_WHITELIST_ID`
- `FIVEM_ACADEMY_ID`
- `STEAM_API_KEY`
- `DATABASE_URL`
- `DISCORD_WEBHOOK_URL`
- `ADMIN_STEAM_IDS` (comma-separated list of Steam IDs allowed to access /admin; leave blank to allow any logged-in user)

## Implemented Pages

- `/` home page
- `/login`
- `/dashboard`
- `/profile`
- `/subscriptions`
- `/applications`
- `/applications/[slug]`
- `/support`
- `/support/new`
- `/admin`

## Integration Notes

- Auth currently uses a demo session helper and Steam route placeholder.
- FiveM status uses live API when server IDs are configured, otherwise mock counts.
- Subscriptions are processed via Ko-fi memberships. Configure per-tier URLs and the webhook verification token in the Admin Panel. Ko-fi events POST to `/api/webhooks/kofi`.
