import { useCallback, useMemo, useState } from "react";
import { loadAllState, persistHabits, persistHabitCheckins } from "../lib/storage";

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

// PUBLIC_INTERFACE
export function useHabits() {
  /** Manage habits and daily check-ins with localStorage persistence. */
  const initial = useMemo(() => loadAllState(), []);
  const [habits, setHabits] = useState(initial.habits);
  const [habitCheckins, setHabitCheckins] = useState(initial.habitCheckins);

  const createHabit = useCallback((data) => {
    const now = new Date().toISOString();
    const habit = {
      id: uid("h"),
      name: String(data.name || "").trim(),
      category: String(data.category || "").trim() || "",
      color: String(data.color || "").trim() || "",
      createdAt: now
    };
    if (!habit.name) return;

    setHabits((prev) => {
      const next = [habit, ...prev];
      persistHabits(next);
      return next;
    });
  }, []);

  const updateHabit = useCallback((id, updates) => {
    setHabits((prev) => {
      const next = prev.map((h) =>
        h.id === id
          ? { ...h, name: updates.name ?? h.name, category: updates.category ?? h.category, color: updates.color ?? h.color }
          : h
      );
      persistHabits(next);
      return next;
    });
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => {
      const next = prev.filter((h) => h.id !== id);
      persistHabits(next);
      return next;
    });
    setHabitCheckins((prev) => {
      const next = { ...(prev || {}) };
      delete next[id];
      persistHabitCheckins(next);
      return next;
    });
  }, []);

  const toggleCheckin = useCallback((habitId, dayKey) => {
    setHabitCheckins((prev) => {
      const current = prev?.[habitId] || [];
      const set = new Set(current);
      if (set.has(dayKey)) set.delete(dayKey);
      else set.add(dayKey);
      const next = { ...(prev || {}), [habitId]: Array.from(set).sort() };
      persistHabitCheckins(next);
      return next;
    });
  }, []);

  return {
    habits,
    habitCheckins,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCheckin
  };
}
