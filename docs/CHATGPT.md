# CHATGPT.md

## TL;DR

React 19 + TypeScript + Vite mini app that renders a virtualized, filterable project explorer with detail routing and a single custom data hook.

## Key Files

- `src/main.tsx` – Boots the app with `BrowserRouter` and theme context.
- `src/App.tsx` – Layout, header, theme toggle, route definitions.
- `src/hooks/useProjects.ts` – Mock dataset, simulated async fetch, pagination, search + filter state.
- `src/pages/ProjectList.tsx` – Search input, filter forms, virtual list rendering via `@tanstack/react-virtual`.
- `src/pages/ProjectDetail.tsx` – Project detail view leveraging the same dataset.
- `README.md` – Setup instructions, tooling overview.

## Behaviour Overview

1. Landing on `/` shows a list of projects with infinite scroll.
2. Search field and filter controls update the list in-place (status, category, owner, tags, updated-since).
3. Selecting a project navigates to `/projects/:id` with rich details.
4. Theme toggle persists preference (light/dark) using localStorage + Tailwind dark mode.

## Running Locally

```bash
npm install
npm run dev
```

## Testing

- Unit tests: `npm run test -- --run`
- Lint: `npm run lint`

## Extension Tips

- Add new filters or fields by updating `useProjects` mock generator and filter logic.
- Keep UI styles in Tailwind utility classes for consistency.
- The mock dataset is deterministic—augment as needed for demos without touching external APIs.
