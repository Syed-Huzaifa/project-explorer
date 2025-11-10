# CLAUDE.md

## Overview

This is a Vite + React 19 application that showcases a searchable, virtualized project catalog. The UI is fully functional with routing, detail pages, infinite scrolling, and a rich filtering experience.

## Key Technologies

- React 19 + TypeScript
- Vite 7 build tooling
- React Router 7 for routing
- Tailwind CSS for styling with dark-mode support
- `@tanstack/react-virtual` for virtualized infinite lists
- Vitest + Testing Library for unit testing

## Architecture Notes

- `src/hooks/useProjects.ts` contains the single custom data-access hook. It mocks async pagination, search, and multi-dimensional filters (status, categories, owners, tags, recency).
- `src/pages/ProjectList.tsx` drives the list screen, controlled search input, filter controls, and virtual list loading.
- `src/pages/ProjectDetail.tsx` renders route-driven detail information using the same mock dataset.
- `src/components/ProjectCard.tsx` encapsulates the list item presentation.
- Tailwind styles are configured via `tailwind.config.ts`; global utilities are imported in `src/index.css`.

## Recommended Entry Points

1. Start with `src/main.tsx` and `src/App.tsx` to see routing/layout.
2. Review `src/hooks/useProjects.ts` to understand data shaping, filters, and state.
3. Inspect `src/pages/ProjectList.tsx` for UI composition and filter interactions.
4. Use `README.md` for setup, scripts, and tooling context.

## Testing

- Run `npm run test -- --run` to execute Vitest. Tests focus on the behaviour of `useProjects` across filters.
- Lint via `npm run lint`.

## Collaboration Tips

- Respect the existing Tailwind utility approach when adjusting UI.
- Keep filter logic centralized in `useProjects` to avoid duplication.
- Update `README.md` if you change run/test commands or tooling assumptions.
