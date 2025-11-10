import { Link } from "react-router-dom";
import type { Project, ProjectStatus } from "../hooks/useProjects";

interface ProjectCardProps {
  project: Project;
}

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

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="group relative rounded-3xl border border-slate-200 bg-white/80 p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
      role="listitem"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/projects/${project.id}`}
          className="text-xl font-semibold tracking-tight text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-300"
        >
          {project.name}
        </Link>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[project.status]}`}
        >
          {project.status.replace(/-/g, " ")}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{project.summary}</p>
      <dl className="grid gap-3 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt>Category</dt>
          <dd className="font-medium text-slate-800 dark:text-slate-200">
            {project.category}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt>Owner</dt>
          <dd className="font-medium text-slate-800 dark:text-slate-200">
            {project.owner}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt>Updated</dt>
          <dd className="font-medium text-slate-800 dark:text-slate-200">
            <time dateTime={project.updatedAt}>
              {new Date(project.updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </dd>
        </div>
      </dl>
      {project.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

