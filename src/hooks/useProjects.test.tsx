import { act, renderHook, waitFor } from "@testing-library/react";
import {
  PROJECT_CATEGORIES,
  PROJECT_OWNERS,
  PROJECT_TAGS,
  useProjects,
} from "./useProjects";

describe("useProjects", () => {
  it("fetches projects and applies search and filter combinations", async () => {
    const { result } = renderHook(() => useProjects({ pageSize: 10 }));

    expect(result.current.isInitialLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isInitialLoading).toBe(false);
    });

    expect(result.current.projects.length).toBeGreaterThan(0);
    const firstProjectName = result.current.projects[0]?.name;
    expect(firstProjectName).toBeTruthy();

    act(() => {
      result.current.setSearchTerm(result.current.projects[0]?.name ?? "");
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSearchTerm("");
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    const targetStatus = "completed" as const;

    act(() => {
      result.current.setStatusFilter(targetStatus);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(
        result.current.projects.every((project) => project.status === targetStatus),
      ).toBe(true);
    });

    act(() => {
      result.current.setStatusFilter("all");
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    const targetOwner = PROJECT_OWNERS[0]!;

    act(() => {
      result.current.setOwnerFilters([targetOwner]);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(
        result.current.projects.every((project) => project.owner === targetOwner),
      ).toBe(true);
    });

    act(() => {
      result.current.setOwnerFilters([]);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    const targetCategory = PROJECT_CATEGORIES[0]!;

    act(() => {
      result.current.setCategoryFilters([targetCategory]);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(
        result.current.projects.every((project) => project.category === targetCategory),
      ).toBe(true);
    });

    act(() => {
      result.current.setCategoryFilters([]);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    const targetTag = PROJECT_TAGS[0]!;

    act(() => {
      result.current.setTagFilters([targetTag]);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(
        result.current.projects.every((project) => project.tags.includes(targetTag)),
      ).toBe(true);
    });

    act(() => {
      result.current.setTagFilters([]);
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setUpdatedSinceFilter("7d");
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
      const now = new Date();
      expect(
        result.current.projects.every((project) => {
          const updatedAt = new Date(project.updatedAt);
          const diffInDays =
            (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
          return diffInDays <= 7 + 0.01;
        }),
      ).toBe(true);
    });

    act(() => {
      result.current.setUpdatedSinceFilter("any");
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSearchTerm("no-match-found");
    });

    await waitFor(() => {
      expect(result.current.projects.length).toBe(0);
      expect(result.current.hasMore).toBe(false);
    });
  });
});

