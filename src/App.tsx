import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

const ProjectList = lazy(() => import("./pages/ProjectList"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));

const THEME_STORAGE_KEY = "project-explorer-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-5 md:px-8">
          <div className="flex flex-col gap-1">
            <Link to="/" className="text-2xl font-semibold tracking-tight">
              Project Explorer
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track what matters, ship with confidence.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-300"
            aria-label="Toggle color theme"
            aria-pressed={theme === "dark"}
          >
            <span aria-hidden>{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>
        </div>
      </header>
      <main
        id="main-content"
        className="flex-1 px-4 py-8 md:px-8"
        role="main"
        aria-live="polite"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Suspense
            fallback={
              <div className="grid place-content-center rounded-2xl border border-slate-200 bg-white p-12 text-slate-500 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Loading…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <span>Built with Vite · React 19 · TypeScript · Tailwind CSS</span>
      </footer>
    </div>
  );
}

export default App;
