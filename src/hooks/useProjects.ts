import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ProjectStatus = "active" | "planning" | "paused" | "completed";

export interface Project {
  id: string;
  name: string;
  summary: string;
  description: string;
  category: string;
  owner: string;
  status: ProjectStatus;
  tags: string[];
  updatedAt: string;
}

export type ProjectStatusFilter = ProjectStatus | "all";
export type UpdatedSinceFilter = "any" | "7d" | "30d" | "90d";

export interface ProjectFilters {
  status: ProjectStatusFilter;
  categories: string[];
  owners: string[];
  tags: string[];
  updatedSince: UpdatedSinceFilter;
}

export interface UseProjectsOptions {
  initialSearch?: string;
  initialFilters?: Partial<ProjectFilters>;
  pageSize?: number;
}

interface UseProjectsState {
  items: Project[];
  total: number;
  isLoading: boolean;
  isInitialLoading: boolean;
  error: Error | null;
}

interface FetchParams {
  page: number;
  pageSize: number;
  search: string;
  filters: ProjectFilters;
}

interface FetchResponse {
  items: Project[];
  total: number;
}

const NETWORK_DELAY_MS = 150;
const TOTAL_PROJECTS = 200;
export const PROJECT_STATUSES: ProjectStatus[] = [
  "active",
  "planning",
  "paused",
  "completed",
];
export const PROJECT_CATEGORIES = [
  "Web",
  "Mobile",
  "Infrastructure",
  "Machine Learning",
  "Internal Tools",
];
export const PROJECT_TAGS = [
  "priority",
  "refactor",
  "launch",
  "design",
  "research",
  "observability",
  "growth",
  "migration",
];
export const PROJECT_OWNERS = [
  "Avery",
  "Jordan",
  "Kai",
  "Morgan",
  "River",
  "Skyler",
  "Tatum",
  "Zion",
];

const MOCK_PROJECTS = generateProjects(TOTAL_PROJECTS);

function generateProjects(count: number): Project[] {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const updatedAt = new Date(today);
    updatedAt.setDate(today.getDate() - index);
    const status = PROJECT_STATUSES[index % PROJECT_STATUSES.length];
    const category = PROJECT_CATEGORIES[index % PROJECT_CATEGORIES.length];
    const owner = PROJECT_OWNERS[index % PROJECT_OWNERS.length];
    const name = `Project ${index + 1}`;
    const summary = `Deliver the next milestone for ${category.toLowerCase()} initiatives.`;
    const description = [
      `${name} focuses on delivering incremental value for our ${category.toLowerCase()} roadmap.`,
      `Led by ${owner}, the team is ensuring smooth collaboration across stakeholders.`,
      `Current status: ${status.toUpperCase()}.`,
    ].join(" ");
    const tags = PROJECT_TAGS.filter((_, tagIndex) => (tagIndex + index) % 3 === 0);
    return {
      id: String(index + 1),
      name,
      summary,
      description,
      category,
      owner,
      status,
      tags,
      updatedAt: updatedAt.toISOString(),
    };
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const UPDATED_SINCE_DAY_LOOKUP: Record<UpdatedSinceFilter, number | null> = {
  any: null,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function isWithinUpdatedSince(updatedAt: string, filter: UpdatedSinceFilter) {
  const days = UPDATED_SINCE_DAY_LOOKUP[filter];
  if (days == null) {
    return true;
  }
  const updatedDate = new Date(updatedAt);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);
  return updatedDate >= threshold;
}

async function fetchProjects({
  page,
  pageSize,
  search,
  filters,
}: FetchParams): Promise<FetchResponse> {
  const normalizedQuery = search.trim().toLowerCase();
  const filteredBySearch = normalizedQuery
    ? MOCK_PROJECTS.filter((project) => {
        const haystack = `${project.name} ${project.summary} ${project.tags.join(" ")}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : MOCK_PROJECTS;
  const filtered = filteredBySearch.filter((project) => {
    const statusMatches =
      filters.status === "all" || project.status === filters.status;
    const categoryMatches =
      !filters.categories.length || filters.categories.includes(project.category);
    const ownerMatches =
      !filters.owners.length || filters.owners.includes(project.owner);
    const tagsMatches =
      !filters.tags.length ||
      filters.tags.every((tag) => project.tags.includes(tag));
    const updatedMatches = isWithinUpdatedSince(
      project.updatedAt,
      filters.updatedSince,
    );
    return (
      statusMatches &&
      categoryMatches &&
      ownerMatches &&
      tagsMatches &&
      updatedMatches
    );
  });
  const start = page * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);
  await delay(NETWORK_DELAY_MS);
  return { items, total: filtered.length };
}

const INITIAL_STATE: UseProjectsState = {
  items: [],
  total: 0,
  isLoading: false,
  isInitialLoading: true,
  error: null,
};

export function useProjects(
  options: UseProjectsOptions = {},
) {
  const { initialSearch = "", initialFilters = {}, pageSize = 24 } = options;
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [filters, setFilters] = useState<ProjectFilters>(() => ({
    status: initialFilters.status ?? "all",
    categories: initialFilters.categories ?? [],
    owners: initialFilters.owners ?? [],
    tags: initialFilters.tags ?? [],
    updatedSince: initialFilters.updatedSince ?? "any",
  }));
  const [state, setState] = useState<UseProjectsState>(INITIAL_STATE);
  const pageRef = useRef(0);
  const requestIdRef = useRef(0);

  const hasMore = state.items.length < state.total;

  const fetchPage = useCallback(
    async ({ page, append }: { page: number; append: boolean }) => {
      const nextRequestId = ++requestIdRef.current;
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        ...(append ? {} : { isInitialLoading: true }),
      }));

      try {
        const response = await fetchProjects({
          page,
          pageSize,
          search: searchTerm,
          filters,
        });
        if (requestIdRef.current !== nextRequestId) {
          return;
        }
        setState((prev) => ({
          items: append ? [...prev.items, ...response.items] : response.items,
          total: response.total,
          isLoading: false,
          isInitialLoading: false,
          error: null,
        }));
        pageRef.current = page;
      } catch (error) {
        if (requestIdRef.current !== nextRequestId) {
          return;
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isInitialLoading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        }));
      }
    },
    [filters, pageSize, searchTerm],
  );

  useEffect(() => {
    pageRef.current = 0;
    fetchPage({ page: 0, append: false });
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (state.isLoading || !hasMore) {
      return;
    }
    const nextPage = pageRef.current + 1;
    fetchPage({ page: nextPage, append: true });
  }, [fetchPage, hasMore, state.isLoading]);

  const reset = useCallback(() => {
    pageRef.current = 0;
    fetchPage({ page: 0, append: false });
  }, [fetchPage]);

  const setSearch = useCallback((next: string) => {
    setSearchTerm(next);
  }, []);

  const setStatusFilter = useCallback((next: ProjectStatusFilter) => {
    setFilters((prev) =>
      prev.status === next
        ? prev
        : {
            ...prev,
            status: next,
          },
    );
  }, []);

  const setCategoryFilters = useCallback(
    (next: string[] | ((prev: string[]) => string[])) => {
      setFilters((prev) => {
        const nextValue =
          typeof next === "function" ? next(prev.categories) : next;
        if (nextValue === prev.categories) {
          return prev;
        }
        return {
          ...prev,
          categories: nextValue,
        };
      });
    },
    [],
  );

  const setOwnerFilters = useCallback(
    (next: string[] | ((prev: string[]) => string[])) => {
      setFilters((prev) => {
        const nextValue =
          typeof next === "function" ? next(prev.owners) : next;
        if (nextValue === prev.owners) {
          return prev;
        }
        return {
          ...prev,
          owners: nextValue,
        };
      });
    },
    [],
  );

  const setTagFilters = useCallback(
    (next: string[] | ((prev: string[]) => string[])) => {
      setFilters((prev) => {
        const nextValue =
          typeof next === "function" ? next(prev.tags) : next;
        if (nextValue === prev.tags) {
          return prev;
        }
        return {
          ...prev,
          tags: nextValue,
        };
      });
    },
    [],
  );

  const setUpdatedSinceFilter = useCallback((next: UpdatedSinceFilter) => {
    setFilters((prev) =>
      prev.updatedSince === next
        ? prev
        : {
            ...prev,
            updatedSince: next,
          },
    );
  }, []);

  const derived = useMemo(
    () => ({
      projects: state.items,
      total: state.total,
      searchTerm,
      setSearchTerm: setSearch,
      statusFilter: filters.status,
      setStatusFilter,
      categoryFilters: filters.categories,
      setCategoryFilters,
      ownerFilters: filters.owners,
      setOwnerFilters,
      tagFilters: filters.tags,
      setTagFilters,
      updatedSinceFilter: filters.updatedSince,
      setUpdatedSinceFilter,
      loadMore,
      hasMore,
      isLoading: state.isLoading,
      isInitialLoading: state.isInitialLoading,
      error: state.error,
      reset,
    }),
    [
      filters.categories,
      filters.owners,
      filters.status,
      filters.tags,
      filters.updatedSince,
      loadMore,
      hasMore,
      reset,
      searchTerm,
      setSearch,
      setCategoryFilters,
      setOwnerFilters,
      setStatusFilter,
      setTagFilters,
      setUpdatedSinceFilter,
      state.error,
      state.isInitialLoading,
      state.isLoading,
      state.items,
      state.total,
    ],
  );

  return derived;
}

export function getProjectById(projectId: string) {
  return MOCK_PROJECTS.find((project) => project.id === projectId);
}

