# GEMINI.md

## Project Snapshot

A minimal yet feature-rich React 19 + TypeScript application generated with Vite. It demonstrates senior-level frontend patterns in a compact footprint.

### Highlights

- Virtualized infinite scrolling list for projects with filter pillars (status, owner, category, tags, updated-since preset).
- `useProjects` hook centralizes mocked data access, pagination, debounce-free search, and filter handling.
- Tailwind CSS handles light/dark themes and styling tokens; React Router powers list/detail navigation.
- Vitest + Testing Library provide unit coverage for the hook.

### Directory Guide

- `src/main.tsx` / `src/App.tsx`: entry point, router, theme toggle.
- `src/pages/ProjectList.tsx`: primary UI with filters, virtualization.
- `src/pages/ProjectDetail.tsx`: detail route built on same mock dataset.
- `src/hooks/useProjects.ts`: mock dataset, fetch simulation, filters.
- `src/components/ProjectCard.tsx`: presentational list item.

### Commands

```bash
npm install
npm run dev
npm run test -- --run
```

### Collaboration Notes

- Extend mock data and filtering in the hook to keep state logic centralized.
- Tailwind classes follow utility-first patterns; prefer composition over custom CSS files.
- Document notable changes in `README.md` if tooling or scripts evolve.
