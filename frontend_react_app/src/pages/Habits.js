import React, { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { HabitForm } from "../components/HabitForm";
import { HabitCalendar } from "../components/HabitCalendar";
import { getTimeframeRange } from "../lib/stats";

/**
 * @param {{
 *  habits: any[],
 *  habitCheckins: Record<string, string[]>,
 *  timeframe: "week"|"month",
 *  onCreate: (data: any) => void,
 *  onUpdate: (id: string, data: any) => void,
 *  onDelete: (id: string) => void,
 *  onToggleCheckin: (habitId: string, dayKey: string) => void
 * }} props
 */
// PUBLIC_INTERFACE
export function Habits({ habits, habitCheckins, timeframe, onCreate, onUpdate, onDelete, onToggleCheckin }) {
  /** Habits management page (CRUD + check-in calendar). */
  const range = useMemo(() => getTimeframeRange(timeframe, new Date()), [timeframe]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const set = new Set();
    for (const h of habits || []) {
      if (h.category) set.add(h.category);
    }
    return ["All", ...Array.from(set).sort()];
  }, [habits]);

  const filteredHabits = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (habits || []).filter((h) => {
      const matchesCategory = categoryFilter === "All" || (h.category || "") === categoryFilter;
      const matchesSearch = !s || String(h.name || "").toLowerCase().includes(s);
      return matchesCategory && matchesSearch;
    });
  }, [habits, categoryFilter, search]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (habit) => {
    setEditing(habit);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const submit = (data) => {
    if (editing) onUpdate(editing.id, data);
    else onCreate(data);
    close();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Habits</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Toggle daily check-ins for {timeframe === "week" ? "this week" : "this month"}.
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:w-56"
            placeholder="Search habits..."
            aria-label="Search habits"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:w-44"
            aria-label="Filter by category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={openCreate}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            + New habit
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredHabits.map((h) => (
          <div key={h.id} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Range: {range.days.length} days
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(h)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(h.id)}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-danger hover:bg-red-50 dark:border-red-900/60 dark:bg-slate-900 dark:hover:bg-red-950/30"
                >
                  Delete
                </button>
              </div>
            </div>

            <HabitCalendar
              habit={h}
              dayKeys={range.days}
              checkins={habitCheckins?.[h.id] || []}
              onToggle={(dayKey) => onToggleCheckin(h.id, dayKey)}
            />
          </div>
        ))}

        {filteredHabits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            No habits found. Create your first habit to start tracking.
          </div>
        ) : null}
      </div>

      <Modal open={modalOpen} title={editing ? "Edit habit" : "Create habit"} onClose={close}>
        <HabitForm mode={editing ? "edit" : "create"} initial={editing} onSubmit={submit} onCancel={close} />
      </Modal>
    </div>
  );
}
