# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 16 App Router application. **Read `node_modules/next/dist/docs/` before making changes** — Next.js 16 has breaking changes from earlier versions.

### Data flow

- Pages (`app/page.tsx`, `app/wishlist/page.tsx`) are **Server Components** that call `lib/db.ts` directly and pass data down as props.
- Mutations go through **Server Actions** in `app/actions.ts` (marked `'use server'`). After each mutation, `revalidatePath` triggers a server re-render.
- In Next.js 16, use `refresh()` from `next/cache` to refresh the current page, or `revalidatePath` to revalidate specific paths.

### Key files

| File | Purpose |
|---|---|
| `lib/db.ts` | SQLite setup via `better-sqlite3`. Creates the DB and table on first run. All queries live here. |
| `app/actions.ts` | Server actions: `addRecordAction`, `deleteRecordAction`, `moveToOwnedAction` |
| `app/components/RecordGrid.tsx` | Client component — holds search/filter state, renders the grid |
| `app/components/RecordCard.tsx` | Client component — single record card with delete and "mark as owned" |
| `app/components/AddRecordForm.tsx` | Client component — modal form that calls `addRecordAction` |

### Database

SQLite file lives at `data/vinyl.db` (gitignored). The `records` table has a `type` column — either `'owned'` or `'wishlist'`. Moving a wishlist item to the collection is an `UPDATE` that sets `type = 'owned'`.

`better-sqlite3` is a native module and must stay server-side only. It is declared in `serverExternalPackages` in `next.config.ts` to prevent bundling on the client.
