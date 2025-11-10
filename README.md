# Project Explorer

A minimal, modern React application that showcases an interactive project catalog with search, virtualization, and detail routing. The codebase is intentionally compact while reflecting the practices of a senior frontend engineer.

## Highlights

- 🔍 **Searchable list** – controlled filter input with live updates and polite screen reader announcements.
- 🚀 **Virtualized infinite list** – powered by `@tanstack/react-virtual` for smooth scrolling through large mock datasets.
- 🔗 **Route-driven UX** – React Router detail page with rich project information and graceful fallbacks.
- 🪝 **Single data hook** – `useProjects` encapsulates pagination, filtering, and simulated async fetching.
- 🗂️ **Filter controls** – multi-select filters for status, owner, category, tags, and quick “updated recently” presets.
- ✅ **Confidence via tests** – Vitest + Testing Library cover the hook’s happy path and filtering behaviour.
- 🌓 **Theme-aware styling** – Tailwind CSS with a persisted light/dark toggle that respects system preference.

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` – start Vite in development mode.
- `npm run build` – type-check and generate a production build.
- `npm run test` – run the Vitest suite in Node + JSDOM.
- `npm run lint` – execute ESLint with the provided configuration.
- `npm run preview` – serve the production build locally.

## Project Structure

```
src/
├─ components/ProjectCard.tsx       # Presentational card used inside the virtual list
├─ hooks/useProjects.ts             # Single source of truth for mocked data access
├─ pages/ProjectList.tsx            # Searchable, virtualized list view
├─ pages/ProjectDetail.tsx          # Routed detail experience with metadata
├─ App.tsx                          # Layout + router wiring
├─ main.tsx                         # React 19 entry point wrapped in BrowserRouter
```

The mock dataset is generated in-memory, simulates latency, and supports pagination so the UI can showcase infinite loading while remaining self-contained.

## Testing

Vitest is configured with JSDOM and Testing Library helpers. Tests live beside the code they exercise; for example `useProjects.test.tsx` validates the hook’s async data flow and filtering.

```bash
npm run test
```

## Accessibility & UX Notes

- The primary search field is labelled and uses `aria-label` for clarity.
- Result counts are announced via `aria-live` to keep assistive tech in sync.
- Skip link enables keyboard users to jump straight to the content.

## Tooling

- React 19 + TypeScript • Vite 7
- React Router 7
- `@tanstack/react-virtual` for virtualization
- Vitest + Testing Library for headless UI tests

Feel free to extend the mock generator, styling tokens, or routing to fit your real-world scenarios. The current setup is purposely approachable yet demonstrates scalable patterns.
