# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` — Next.js App Router (routes, layouts, API routes).
- `src/components/` — UI components (PascalCase files, grouped by feature: `prompt/`, `category/`, `ui/`, etc.).
- `src/lib/` — Client/server utilities and services (kebab-case files like `database.ts`, `supabase.ts`).
- `src/hooks/`, `src/contexts/`, `src/types/`, `src/data/` — Hooks, providers, shared types, seed/static data.
- `public/` — Static assets; `content/` — Markdown guides for the Study section.
- Path alias: use `@/*` to import from `src`.

## Build, Test, and Development Commands
- `npm run dev` — Start local dev with Turbopack.
- `npm run build` — Production build.
- `npm start` — Serve the built app.
- `npm run lint` — Lint with ESLint.

Example: `NEXT_PUBLIC_USER_ROLE=admin npm run dev` for full features locally.

## Coding Style & Naming Conventions
- TypeScript, strict mode; 2-space indent; prefer named exports.
- Components: PascalCase (`PromptCard.tsx`), one component per file when practical.
- Hooks: `useX.ts`; Context: `XProvider.tsx` with `XContext`.
- Lib modules: kebab-case or dashed names (`category-service.ts`).
- Tailwind CSS v4 with `clsx`/`tailwind-merge`; keep classes readable and co-locate styles with components.
- Run `npm run lint` before committing.

## Testing Guidelines
- No formal test runner configured yet. If adding tests, prefer Vitest + React Testing Library.
- Name tests `*.test.ts`/`*.test.tsx`, colocated with the module or under `__tests__/`.
- Aim to cover utilities in `src/lib/` and critical UI logic.

## Commit & Pull Request Guidelines
- Commits: concise, present tense. Recommended pattern: `type(scope): summary`.
  - Examples: `feat(prompt): add bulk copy`, `fix(db): align prompt schema types`.
- PRs: include purpose, linked issues, before/after screenshots for UI, and notes on env/config changes.
- Ensure `npm run lint` passes and update docs when adding env vars or routes.

## Security & Configuration Tips
- Do not commit secrets. Use `.env.local` with:
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_USER_ROLE` (`admin` in dev, `viewer` in prod).
- Avoid server-only secrets in `NEXT_PUBLIC_*`.

## Agent-Specific Notes
- Make minimal, focused changes; follow structure and naming above.
- Prefer existing patterns; avoid renames/refactors unless necessary.
- Touch only relevant files; keep diffs small and explain rationale in PRs.
