import React, { useEffect, useMemo, useState } from "react";

/**
 * @param {{
 *  mode: "create"|"edit",
 *  initial?: any,
 *  onSubmit: (data: {title: string, description: string, dueDate: string, status: "Todo"|"In Progress"|"Done", tags: string[]}) => void,
 *  onCancel: () => void
 * }} props
 */
// PUBLIC_INTERFACE
export function TaskForm({ mode, initial, onSubmit, onCancel }) {
  /** Form used to create or edit a task. */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Todo");
  const [tagsText, setTagsText] = useState("");

  const tags = useMemo(() => {
    return tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagsText]);

  useEffect(() => {
    if (mode === "edit" && initial) {
      setTitle(initial.title || "");
      setDescription(initial.description || "");
      setDueDate(initial.dueDate || "");
      setStatus(initial.status || "Todo");
      setTagsText(Array.isArray(initial.tags) ? initial.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("Todo");
      setTagsText("");
    }
  }, [mode, initial]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title: title.trim(), description: description.trim(), dueDate: dueDate.trim(), status, tags });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="task_title">
          Title
        </label>
        <input
          id="task_title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          placeholder="e.g., Submit expense report"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="task_desc">
          Description (optional)
        </label>
        <textarea
          id="task_desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 min-h-[90px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          placeholder="Add details..."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="task_due">
            Due date
          </label>
          <input
            id="task_due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="task_status">
            Status
          </label>
          <select
            id="task_status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="task_tags">
            Tags (comma-separated)
          </label>
          <input
            id="task_tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="work, personal"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          {mode === "edit" ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}
