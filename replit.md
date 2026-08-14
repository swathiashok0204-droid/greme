# grème

grème is a premium, mobile-first shopping platform for browsing, saving, and ordering fashion, beauty, home, and accessory products across web and Android.

## Run & Operate

- `pnpm --filter @workspace/greme run dev` — run the shared Expo web/Android app
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required Supabase secrets: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Client data: `@supabase/supabase-js` with Supabase Auth and REST

## Where things live

- `artifacts/greme` — shared Expo + React Native Web storefront and Android app
- `artifacts/greme/lib/catalog.ts` — Supabase product query and normalization layer
- `artifacts/greme/context/ShopContext.tsx` — local cart and wishlist state
- `artifacts/greme/constants/colors.ts` — grème brand tokens
- `supabase/greme_setup.sql` — reviewable, non-destructive policy setup for the existing Supabase project

## Architecture decisions

- Use one Expo codebase for responsive web and standalone Android instead of maintaining separate storefront implementations.
- Use `@supabase/supabase-js` directly with environment variables; do not use the Replit Supabase integration.
- Preserve the existing Supabase `products`, `orders`, and `order_items` shapes and adapt the client to them.
- Keep guest cart and wishlist state in AsyncStorage until the optional Supabase persistence tables are confirmed.

## Product

The first build includes a branded home experience, catalog search and category/sort filtering, product details, wishlist, cart, Supabase Auth login/register/password reset, checkout against the existing order schema, and order history.

## User preferences

- Use the user's existing Supabase project with `@supabase/supabase-js`.
- Never use the Replit Supabase integration unless the user explicitly changes this preference.
- Never request or place a Supabase service-role key in client-side code.

## Gotchas

- Run `supabase/greme_setup.sql` in the Supabase SQL editor after reviewing it; the app cannot read the current products table until its public read grant/policy is present.
- The existing order tables do not include an owner reference, so the SQL setup adds a non-destructive `orders.user_id` column before authenticated checkout/order history can work.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
