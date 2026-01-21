import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { aggregateHabitCheckinsByDay, getMonthBuckets, getTimeframeRange, completionForRange } from "../../lib/stats";
import { formatShortDate } from "../../lib/date";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * @param {{
 *  timeframe: "week"|"month",
 *  habits: any[],
 *  habitCheckins: Record<string, string[]>
 * }} props
 */
// PUBLIC_INTERFACE
export function HabitCheckinsChart({ timeframe, habits, habitCheckins }) {
  /** Bar chart: total habit check-ins per day (week) or per bucket (month). */
  const today = new Date();

  const chartData = useMemo(() => {
    if (timeframe === "month") {
      const buckets = getMonthBuckets(today);
      const labels = buckets.map((b) => b.label);
      const counts = buckets.map((b) => {
        // total checkins across all habits over bucket days
        const dailyCounts = aggregateHabitCheckinsByDay(habitCheckins, b.days);
        return dailyCounts.reduce((a, c) => a + c, 0);
      });

      return {
        labels,
        datasets: [
          {
            label: "Habit check-ins",
            data: counts,
            backgroundColor: "rgba(59, 130, 246, 0.35)",
            borderColor: "rgba(59, 130, 246, 0.9)",
            borderWidth: 1,
            borderRadius: 10
          }
        ]
      };
    }

    const range = getTimeframeRange("week", today);
    const labels = range.days.map(formatShortDate);
    const data = aggregateHabitCheckinsByDay(habitCheckins, range.days);

    return {
      labels,
      datasets: [
        {
          label: "Habit check-ins",
          data,
          backgroundColor: "rgba(6, 182, 212, 0.35)",
          borderColor: "rgba(6, 182, 212, 0.9)",
          borderWidth: 1,
          borderRadius: 10
        }
      ]
    };
  }, [timeframe, habitCheckins]);

  const completion = useMemo(() => {
    const range = getTimeframeRange(timeframe, today);
    // Average completion across habits for the range.
    const percents = (habits || []).map((h) => completionForRange(habitCheckins?.[h.id] || [], range.days).percent);
    const avg = percents.length ? Math.round(percents.reduce((a, p) => a + p, 0) / percents.length) : 0;
    return avg;
  }, [timeframe, habits, habitCheckins]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Habit check-ins</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {timeframe === "week" ? "Daily totals" : "Weekly buckets"} • Avg completion {completion}%
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
              x: { grid: { display: false } }
            }
          }}
          height={220}
        />
      </div>
    </div>
  );
}
