import { useCallback, useMemo, useState } from "react";
import { loadAllState, persistTasks } from "../lib/storage";

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

// PUBLIC_INTERFACE
export function useTasks() {
  /** Manage tasks with localStorage persistence. */
  const initial = useMemo(() => loadAllState(), []);
  const [tasks, setTasks] = useState(initial.tasks);

  const createTask = useCallback((data) => {
    const now = new Date().toISOString();
    const task = {
      id: uid("t"),
      title: String(data.title || "").trim(),
      description: String(data.description || "").trim() || "",
      dueDate: String(data.dueDate || "").trim() || "",
      status: data.status || "Todo",
      tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
      createdAt: now,
      updatedAt: now
    };
    if (!task.title) return;

    setTasks((prev) => {
      const next = [task, ...prev];
      persistTasks(next);
      return next;
    });
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id !== id) return t;
        const now = new Date().toISOString();
        return {
          ...t,
          title: updates.title ?? t.title,
          description: updates.description ?? t.description,
          dueDate: updates.dueDate ?? t.dueDate,
          status: updates.status ?? t.status,
          tags: updates.tags ?? t.tags,
          updatedAt: now
        };
      });
      persistTasks(next);
      return next;
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistTasks(next);
      return next;
    });
  }, []);

  const moveTaskStatus = useCallback((id, status) => updateTask(id, { status }), [updateTask]);

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    moveTaskStatus
  };
}
