# Roots Salon

An immersive, premium salon website for Roots Salon, combining cinematic brand storytelling with service discovery and appointment requests.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/roots-salon/` — deployable React/Vite website and its editable salon configuration
- `artifacts/mockup-sandbox/src/components/mockups/roots-salon/CinematicHome.tsx` — live canvas design preview
- `attached_assets/` — provided Roots Salon photography
- `artifacts/roots-salon/src/data/salonConfig.js` — source of truth for business details, service copy, pricing, social links, and editable reviews

## Architecture decisions

- The first release is frontend-only: the booking flow submits a request locally and never claims an appointment is confirmed.
- Business contact details, WhatsApp, Instagram, pricing, and review content remain editable configuration values so no contact information is invented.
- The cinematic layer uses CSS and lightweight browser effects with responsive reductions rather than requiring a video, WebGL, or external media service.
- The provided salon photography is used as the primary visual language across the hero, tour, transformation, and gallery experiences.

## Product

- “Enter the Roots” introductory interaction with a skippable cinematic reveal
- Service explorer for hair, beauty, grooming, and bridal
- Before/after transformation slider and clickable salon tour hotspots
- Premium gallery lightbox, floating booking action, WhatsApp-ready contact action, and five-step booking request flow
- Responsive mobile-specific presentation, custom desktop cursor, motion reduction support, and SEO metadata

## User preferences

No additional preferences recorded.

## Gotchas

- Add the real WhatsApp number, Instagram URL, and other business details only in `src/data/salonConfig.js`.
- Do not turn the booking request success state into a confirmed appointment until a real booking backend or calendar integration exists.
- The website workflow owns the root preview; the mockup sandbox owns the isolated canvas preview.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
