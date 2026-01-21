import React, { useMemo } from "react";
import { calculateStreak, getTimeframeRange, overallHabitCompletion, tasksCompletedInRange } from "../lib/stats";

/**
 * @param {{
 *  habits: any[],
 *  habitCheckins: Record<string, string[]>,
 *  tasks: any[],
 *  timeframe: "week"|"month"
 * }} props
 */
// PUBLIC_INTERFACE
export function SummaryCards({ habits, habitCheckins, tasks, timeframe }) {
  /** Dashboard summary cards (completion, streaks, tasks completed). */
  const range = useMemo(() => getTimeframeRange(timeframe, new Date()), [timeframe]);

  const overall = useMemo(() => overallHabitCompletion(habits, habitCheckins, range.days), [habits, habitCheckins, range.days]);

  const bestStreak = useMemo(() => {
    let longest = 0;
    let bestName = "";
    for (const h of habits || []) {
      const s = calculateStreak(habitCheckins?.[h.id] || [], new Date());
      if (s.longest > longest) {
        longest = s.longest;
        bestName = h.name;
      }
    }
    return { longest, bestName };
  }, [habits, habitCheckins]);

  const tasksDoneInRange = useMemo(() => tasksCompletedInRange(tasks, range.start, range.end), [tasks, range.start, range.end]);

  const cardBase =
    "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900";
  const label = "text-xs font-medium text-slate-500 dark:text-slate-400";
  const value = "mt-2 text-2xl font-semibold text-slate-900 dark:text-white";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className={cardBase}>
        <div className={label}>Habit completion ({timeframe})</div>
        <div className={value}>{overall.percent}%</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {overall.count} / {overall.total} check-ins
        </div>
      </div>

      <div className={cardBase}>
        <div className={label}>Longest streak</div>
        <div className={value}>{bestStreak.longest} days</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {bestStreak.bestName ? `Best: ${bestStreak.bestName}` : "No habits yet"}
        </div>
      </div>

      <div className={cardBase}>
        <div className={label}>Tasks completed ({timeframe})</div>
        <div className={value}>{tasksDoneInRange}</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Based on task last update time</div>
      </div>
    </div>
  );
}
