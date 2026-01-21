import React from "react";
import { SummaryCards } from "../components/SummaryCards";
import { HabitCheckinsChart } from "../components/Charts/HabitCheckinsChart";
import { TaskCompletionChart } from "../components/Charts/TaskCompletionChart";

/**
 * @param {{
 *  habits: any[],
 *  habitCheckins: Record<string, string[]>,
 *  tasks: any[],
 *  timeframe: "week"|"month"
 * }} props
 */
// PUBLIC_INTERFACE
export function Dashboard({ habits, habitCheckins, tasks, timeframe }) {
  /** Main dashboard showing KPI cards and charts. */
  return (
    <div className="space-y-4">
      <SummaryCards habits={habits} habitCheckins={habitCheckins} tasks={tasks} timeframe={timeframe} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HabitCheckinsChart timeframe={timeframe} habits={habits} habitCheckins={habitCheckins} />
        <TaskCompletionChart tasks={tasks} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <div className="font-semibold text-slate-900 dark:text-white">Tips</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Use the Habits page to toggle daily check-ins and build streaks.</li>
          <li>Use the Tasks page to drag tasks between columns.</li>
          <li>All data is stored locally in your browser (localStorage).</li>
        </ul>
      </div>
    </div>
  );
}
