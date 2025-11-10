# LLM.md

## Context for Language Models

This repository contains a compact React 19 application that demonstrates best practices in modern frontend engineering. It is designed to be self-explanatory for AI code assistants.

### Goals

- Showcase infinite scrolling + virtualization with rich filtering.
- Keep data access mocked locally via a single hook for easy reasoning/testing.
- Provide accessible UI with Tailwind-based theming and ergonomic controls.

### Architectural Highlights

- **Data Hook** (`src/hooks/useProjects.ts`): Generates deterministic mock data, simulates async fetches, handles pagination, search, status/category/owner/tag filters, and updated-since presets.
- **List Page** (`src/pages/ProjectList.tsx`): Controlled search input, filter controls, virtualization, skeleton loaders, and accessible filter summaries.
- **Detail Page** (`src/pages/ProjectDetail.tsx`): Route-based detail view reusing the mock dataset for consistency.
- **Component** (`src/components/ProjectCard.tsx`): Presentational card that surfaces metadata, tags, and status chips.
- **Styling**: Tailwind CSS with dark-mode support and shared shimmer animation.

### Tooling Checklist

- `npm install`
- `npm run dev` to start the app
- `npm run test -- --run` for Vitest
- `npm run lint` for ESLint

### Assistant Tips

- Keep business rules within the hook to maintain a single source of truth.
- When modifying filters or dataset shape, update tests (`useProjects.test.tsx`) to reflect behaviour.
- Tailwind classes are preferred; avoid reintroducing global CSS unless necessary.
- Document major adjustments in `README.md` or the relevant AI guidance file.
