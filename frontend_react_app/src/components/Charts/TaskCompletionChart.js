import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { taskStatusCounts } from "../../lib/stats";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * @param {{tasks: any[]}} props
 */
// PUBLIC_INTERFACE
export function TaskCompletionChart({ tasks }) {
  /** Doughnut chart: tasks by status. */
  const counts = useMemo(() => taskStatusCounts(tasks), [tasks]);

  const data = useMemo(
    () => ({
      labels: ["Todo", "In Progress", "Done"],
      datasets: [
        {
          data: [counts.todo, counts.inProgress, counts.done],
          backgroundColor: ["rgba(100, 116, 139, 0.35)", "rgba(59, 130, 246, 0.35)", "rgba(6, 182, 212, 0.35)"],
          borderColor: ["rgba(100, 116, 139, 0.9)", "rgba(59, 130, 246, 0.9)", "rgba(6, 182, 212, 0.9)"],
          borderWidth: 1
        }
      ]
    }),
    [counts]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">Tasks overview</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Distribution by status</div>
      <div className="mt-3">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } }
          }}
          height={220}
        />
      </div>
    </div>
  );
}
