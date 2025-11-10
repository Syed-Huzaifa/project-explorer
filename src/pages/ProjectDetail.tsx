import { Link, useParams } from "react-router-dom";
import { getProjectById, type ProjectStatus } from "../hooks/useProjects";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  active:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  planning:
    "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  paused:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  completed:
    "bg-slate-300 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200",
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-800 dark:bg-slate-900">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to projects
        </Link>
        <div className="mx-auto grid max-w-xl gap-3 text-slate-600 dark:text-slate-400">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Project not found
          </h1>
          <p>
            The project you’re looking for couldn’t be located. It might have been
            removed or you may have followed an outdated link.
          </p>
        </div>
      </section>
    );
  }

  return (
    <article
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900"
      aria-labelledby="project-title"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
      >
        ← Back to projects
      </Link>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1
          id="project-title"
          className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          {project.name}
        </h1>
        <span
          className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[project.status]}`}
        >
          {project.status.replace(/-/g, " ")}
        </span>
      </header>
      <p className="text-base text-slate-600 dark:text-slate-400">{project.summary}</p>
      <section className="grid gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Overview
        </h2>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
          {project.description}
        </p>
      </section>
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Key facts
        </h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Category
            </dt>
            <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              {project.category}
            </dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Owner
            </dt>
            <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              {project.owner}
            </dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Updated
            </dt>
            <dd className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <time dateTime={project.updatedAt}>
                {new Date(project.updatedAt).toLocaleString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </dd>
          </div>
        </dl>
      </section>
      {project.tags.length ? (
        <section className="grid gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Tags
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
