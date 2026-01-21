import React, { useEffect, useState } from "react";

/**
 * @param {{
 *  mode: "create"|"edit",
 *  initial?: any,
 *  onSubmit: (data: {name: string, category: string, color: string}) => void,
 *  onCancel: () => void
 * }} props
 */
// PUBLIC_INTERFACE
export function HabitForm({ mode, initial, onSubmit, onCancel }) {
  /** Form used to create or edit a habit. */
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    if (mode === "edit" && initial) {
      setName(initial.name || "");
      setCategory(initial.category || "");
      setColor(initial.color || "#3b82f6");
    } else {
      setName("");
      setCategory("");
      setColor("#3b82f6");
    }
  }, [mode, initial]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ name: name.trim(), category: category.trim(), color: color.trim() });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="habit_name">
          Name
        </label>
        <input
          id="habit_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          placeholder="e.g., Meditate"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="habit_category">
            Category (optional)
          </label>
          <input
            id="habit_category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="Health, Learning..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="habit_color">
            Color
          </label>
          <input
            id="habit_color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-950"
            aria-label="Habit color"
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
