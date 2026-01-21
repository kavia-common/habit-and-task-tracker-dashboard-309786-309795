import React, { useMemo, useState } from "react";
import { Modal } from "../components/Modal";
import { TaskForm } from "../components/TaskForm";
import { TaskBoard } from "../components/TaskBoard";

/**
 * @param {{
 *  tasks: any[],
 *  onCreate: (data: any) => void,
 *  onUpdate: (id: string, data: any) => void,
 *  onDelete: (id: string) => void,
 *  onMove: (id: string, status: "Todo"|"In Progress"|"Done") => void
 * }} props
 */
// PUBLIC_INTERFACE
export function Tasks({ tasks, onCreate, onUpdate, onDelete, onMove }) {
  /** Tasks page with CRUD + filters + kanban board. */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const close = () => setModalOpen(false);

  const submit = (data) => {
    if (editing) onUpdate(editing.id, data);
    else onCreate(data);
    close();
  };

  const counts = useMemo(() => {
    const c = { Todo: 0, "In Progress": 0, Done: 0 };
    for (const t of tasks || []) c[t.status] = (c[t.status] || 0) + 1;
    return c;
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Tasks</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Drag tasks between columns to update status.
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:w-56"
            placeholder="Search by title..."
            aria-label="Search tasks"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:w-48"
            aria-label="Filter tasks by status"
          >
            <option value="All">All ({counts.Todo + counts["In Progress"] + counts.Done})</option>
            <option value="Todo">Todo ({counts.Todo})</option>
            <option value="In Progress">In Progress ({counts["In Progress"]})</option>
            <option value="Done">Done ({counts.Done})</option>
          </select>

          <button
            onClick={openCreate}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            + New task
          </button>
        </div>
      </div>

      <TaskBoard
        tasks={tasks}
        search={search}
        statusFilter={statusFilter}
        onEdit={openEdit}
        onDelete={onDelete}
        onMove={onMove}
      />

      <Modal open={modalOpen} title={editing ? "Edit task" : "Create task"} onClose={close}>
        <TaskForm mode={editing ? "edit" : "create"} initial={editing} onSubmit={submit} onCancel={close} />
      </Modal>
    </div>
  );
}
