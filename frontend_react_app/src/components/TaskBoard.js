import React, { useMemo } from "react";
import { daysSince } from "../lib/stats";

/**
 * @param {{
 *  tasks: any[],
 *  search: string,
 *  statusFilter: "All"|"Todo"|"In Progress"|"Done",
 *  onEdit: (task: any) => void,
 *  onDelete: (taskId: string) => void,
 *  onMove: (taskId: string, status: "Todo"|"In Progress"|"Done") => void
 * }} props
 */
// PUBLIC_INTERFACE
export function TaskBoard({ tasks, search, statusFilter, onEdit, onDelete, onMove }) {
  /** Kanban-style task board with minimal HTML5 drag-and-drop. */
  const normalizedSearch = (search || "").trim().toLowerCase();

  const filtered = useMemo(() => {
    return (tasks || []).filter((t) => {
      const matchesSearch = !normalizedSearch || String(t.title || "").toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, normalizedSearch, statusFilter]);

  const byStatus = useMemo(() => {
    const buckets = { Todo: [], "In Progress": [], Done: [] };
    for (const t of filtered) buckets[t.status]?.push(t);
    return buckets;
  }, [filtered]);

  const statuses = /** @type {Array<"Todo"|"In Progress"|"Done">} */ (["Todo", "In Progress", "Done"]);

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    onMove(taskId, status);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const statusMeta = {
    Todo: { pill: "bg-secondary/10 text-secondary", header: "text-secondary" },
    "In Progress": { pill: "bg-primary/10 text-primary", header: "text-primary" },
    Done: { pill: "bg-success/10 text-success", header: "text-success" }
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {statuses.map((status) => (
        <section
          key={status}
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          onDrop={(e) => onDrop(e, status)}
          onDragOver={onDragOver}
          aria-label={`${status} tasks`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${statusMeta[status].header}`}>{status}</h3>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta[status].pill}`}>
              {byStatus[status].length}
            </span>
          </div>

          <div className="space-y-2">
            {byStatus[status].map((t) => (
              <article
                key={t.id}
                draggable
                onDragStart={(e) => onDragStart(e, t.id)}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                aria-label={`Task: ${t.title}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</div>
                    {t.description ? (
                      <div className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{t.description}</div>
                    ) : null}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(t)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      aria-label={`Edit ${t.title}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="rounded-lg px-2 py-1 text-xs font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
                      aria-label={`Delete ${t.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {t.dueDate ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">Due {t.dueDate}</span> : null}
                  <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                    Updated {daysSince((t.updatedAt || "").slice(0, 10))}d ago
                  </span>
                  {Array.isArray(t.tags) && t.tags.length ? (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{t.tags.join(", ")}</span>
                  ) : null}
                </div>
              </article>
            ))}

            {byStatus[status].length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Drop tasks here
              </div>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
