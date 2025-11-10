# AI.md

## Project Summary

- **Stack**: Vite 7, React 19, TypeScript 5.9, Tailwind CSS, React Router 7, Vitest.
- **Purpose**: Demonstrate a modern React app with infinite scrolling, advanced filters, and detail routing while remaining lightweight and self-contained.

## Core Concepts

1. **Mocked Data Layer** – `useProjects` hook generates deterministic projects, simulates network latency, and supports pagination, search, and multiple filter axes.
2. **Virtualized List** – `ProjectList` leverages `@tanstack/react-virtual` to efficiently render hundreds of items with asynchronous load-more handling.
3. **Filter UX** – Users can refine results by status, categories, owners, tags, and last-updated windows. Filter state lives in the hook, keeping UI components lean.
4. **Routing + Detail Views** – React Router provides the list (`/`) and detail (`/projects/:id`) routes with graceful handling of missing IDs.
5. **Styling & Theming** – Tailwind CSS drives both aesthetics and responsive layout, including a persisted light/dark theme toggle.

## Recommended Reading Order

1. `src/main.tsx` and `src/App.tsx` – entry point and global layout.
2. `src/hooks/useProjects.ts` – data, filters, and state orchestration.
3. `src/pages/ProjectList.tsx` – UI composition, virtualization, filter wiring.
4. `src/pages/ProjectDetail.tsx` – detail page structure.
5. `src/components/ProjectCard.tsx` – reusable presentation logic.

## Commands

- `npm run dev` – Vite dev server
- `npm run build` – Type-check + production build
- `npm run test -- --run` – Vitest suite
- `npm run lint` – ESLint

## Collaboration Guidance

- Keep business logic centralized in `useProjects` to avoid duplication.
- Favor Tailwind utility classes when styling new UI pieces.
- Update documentation (`README.md`, this file) when introducing structural or tooling changes.
