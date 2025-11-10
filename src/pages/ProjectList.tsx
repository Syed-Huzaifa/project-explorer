import {
  type CSSProperties,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ProjectCard } from "../components/ProjectCard";
import {
  PROJECT_STATUSES,
  useProjects,
  PROJECT_CATEGORIES,
  PROJECT_OWNERS,
  PROJECT_TAGS,
  type ProjectStatusFilter,
  type UpdatedSinceFilter,
} from "../hooks/useProjects";

const DEFAULT_PAGE_SIZE = 24;

function formatCount(total: number) {
  return new Intl.NumberFormat().format(total);
}

const ESTIMATED_ROW_HEIGHT = 168;

const STATUS_OPTIONS: ProjectStatusFilter[] = ["all", ...PROJECT_STATUSES];

const CATEGORY_OPTIONS = PROJECT_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

const OWNER_OPTIONS = PROJECT_OWNERS.map((owner) => ({
  value: owner,
  label: owner,
}));

const TAG_OPTIONS = PROJECT_TAGS.map((tag) => ({
  value: tag,
  label: tag,
}));

const UPDATED_SINCE_OPTIONS: Array<{ value: UpdatedSinceFilter; label: string }> = [
  { value: "any", label: "Any time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export default function ProjectList() {
  const {
    projects,
    total,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    categoryFilters,
    setCategoryFilters,
    ownerFilters,
    setOwnerFilters,
    tagFilters,
    setTagFilters,
    updatedSinceFilter,
    setUpdatedSinceFilter,
    loadMore,
    hasMore,
    isLoading,
    isInitialLoading,
  } = useProjects({ pageSize: DEFAULT_PAGE_SIZE });

  const listParentRef = useRef<HTMLDivElement | null>(null);

  const toggleCategory = useCallback(
    (category: string) => {
      setCategoryFilters((prev) =>
        prev.includes(category)
          ? prev.filter((value) => value !== category)
          : [...prev, category],
      );
    },
    [setCategoryFilters],
  );

  const toggleOwner = useCallback(
    (owner: string) => {
      setOwnerFilters((prev) =>
        prev.includes(owner)
          ? prev.filter((value) => value !== owner)
          : [...prev, owner],
      );
    },
    [setOwnerFilters],
  );

  const toggleTag = useCallback(
    (tag: string) => {
      setTagFilters((prev) =>
        prev.includes(tag)
          ? prev.filter((value) => value !== tag)
          : [...prev, tag],
      );
    },
    [setTagFilters],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilters([]);
    setOwnerFilters([]);
    setTagFilters([]);
    setUpdatedSinceFilter("any");
    if (listParentRef.current) {
      listParentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    setCategoryFilters,
    setOwnerFilters,
    setSearchTerm,
    setStatusFilter,
    setTagFilters,
    setUpdatedSinceFilter,
  ]);

  const pillClass = useCallback(
    (active: boolean) =>
      [
        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        active
          ? "border-blue-500 bg-blue-600 text-white shadow"
          : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300",
      ].join(" "),
    [],
  );

  const activeFilterCount = useMemo(() => {
    const statusCount = statusFilter === "all" ? 0 : 1;
    const updatedCount = updatedSinceFilter === "any" ? 0 : 1;
    return (
      statusCount +
      updatedCount +
      categoryFilters.length +
      ownerFilters.length +
      tagFilters.length
    );
  }, [
    categoryFilters.length,
    ownerFilters.length,
    statusFilter,
    tagFilters.length,
    updatedSinceFilter,
  ]);

  const hasActiveFilters = useMemo(
    () => activeFilterCount > 0 || Boolean(searchTerm),
    [activeFilterCount, searchTerm],
  );

  const filterOverview = useMemo(() => {
    if (!hasActiveFilters) {
      return "No filters applied";
    }
    const parts: string[] = [];
    if (activeFilterCount > 0) {
      parts.push(
        `${formatCount(activeFilterCount)} filter${activeFilterCount === 1 ? "" : "s"} active`,
      );
    }
    if (searchTerm) {
      parts.push("Search applied");
    }
    return parts.join(" · ");
  }, [activeFilterCount, hasActiveFilters, searchTerm]);

  const count = hasMore ? projects.length + 1 : projects.length;

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => listParentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 8,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) {
      return;
    }
    const isLoaderRow = lastItem.index >= projects.length;
    if (isLoaderRow && hasMore && !isLoading) {
      loadMore();
    }
  }, [virtualItems, projects.length, hasMore, isLoading, loadMore]);

  const searchSummary = useMemo(() => {
    if (isInitialLoading) {
      return "Fetching projects…";
    }
    if (!projects.length) {
      return searchTerm
        ? `No projects match “${searchTerm}”.`
        : "No projects available.";
    }
    const prefix = searchTerm ? "Filtered" : "Showing";
    const filterSuffix =
      activeFilterCount > 0
        ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`
        : "";
    return `${prefix} ${formatCount(projects.length)} of ${formatCount(total)} projects${filterSuffix}.`;
  }, [
    activeFilterCount,
    isInitialLoading,
    projects.length,
    total,
    searchTerm,
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-4 md:items-end">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
              htmlFor="project-search"
            >
              Search
            </label>
            <input
              id="project-search"
              type="search"
              value={searchTerm}
              placeholder="Search projects by name or tag"
              onChange={handleSearchChange}
              aria-label="Search projects"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
              htmlFor="project-status"
            >
              Status
            </label>
            <select
              id="project-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ProjectStatusFilter)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm transition focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "all"
                    ? "All statuses"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Updated
            </span>
            <div className="flex flex-wrap gap-2">
              {UPDATED_SINCE_OPTIONS.map(({ value, label }) => {
                const active = updatedSinceFilter === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={pillClass(active)}
                    aria-pressed={active}
                    onClick={() => setUpdatedSinceFilter(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-xs py-3 font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Categories
            </legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(({ value, label }) => {
                const active = categoryFilters.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={pillClass(active)}
                    aria-pressed={active}
                    onClick={() => toggleCategory(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-xs py-3 font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Owners
            </legend>
            <div className="flex flex-wrap gap-2">
              {OWNER_OPTIONS.map(({ value, label }) => {
                const active = ownerFilters.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={pillClass(active)}
                    aria-pressed={active}
                    onClick={() => toggleOwner(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-3 md:col-span-2">
            <legend className="text-xs py-3 font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Tags
            </legend>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(({ value, label }) => {
                const active = tagFilters.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={pillClass(active)}
                    aria-pressed={active}
                    onClick={() => toggleTag(value)}
                  >
                    #{label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {filterOverview}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
          >
            Clear filters
          </button>
        </div>
      </form>
      <p className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        {searchSummary}
      </p>
      {isInitialLoading && (
        <div className="grid gap-4">
          <div className="h-36 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer dark:border-slate-800 dark:from-slate-700/60 dark:via-slate-800/60 dark:to-slate-700/60" />
          <div className="h-36 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer dark:border-slate-800 dark:from-slate-700/60 dark:via-slate-800/60 dark:to-slate-700/60" />
          <div className="h-36 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer dark:border-slate-800 dark:from-slate-700/60 dark:via-slate-800/60 dark:to-slate-700/60" />
        </div>
      )}
      {!isInitialLoading && !projects.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-inner dark:border-slate-700 dark:bg-slate-900">
          <h2>No matching projects</h2>
          <p>Try a different search term or clear the current filter.</p>
        </div>
      ) : null}
      <div
        ref={listParentRef}
        className="relative h-[clamp(20rem,70vh,42.5rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-elevated dark:border-slate-800 dark:bg-slate-900"
        role="list"
        aria-label="Project results"
      >
        <div
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow) => {
            const { index, key, size, start } = virtualRow;
            const style: CSSProperties = {
              position: "absolute",
              top: 0,
              width: "100%",
              transform: `translateY(${start}px)`,
              height: `${size}px`,
            };
            const isLoaderRow = index >= projects.length;

            if (isLoaderRow) {
              return (
                <div
                  key={key}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400"
                  style={style}
                  role="status"
                  aria-live="polite"
                >
                  {hasMore ? (
                    <>
                      <span className="sr-only">Loading more projects…</span>
                      <div
                        className="h-full w-full rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer dark:border-slate-800 dark:from-slate-700/60 dark:via-slate-800/60 dark:to-slate-700/60"
                        aria-hidden
                      />
                    </>
                  ) : (
                    <div className="grid place-items-center rounded-xl bg-slate-100 px-4 py-3 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                      <span>You’ve reached the end.</span>
                    </div>
                  )}
                </div>
              );
            }

            const project = projects[index];
            return (
              <div key={key} style={style}>
                <ProjectCard project={project} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

