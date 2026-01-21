import React, { useMemo } from "react";
import { formatShortDate, formatWeekday } from "../lib/date";
import { calculateStreak, completionForRange } from "../lib/stats";

/**
 * @param {{
 *  habit: any,
 *  dayKeys: string[],
 *  checkins: string[],
 *  onToggle: (dayKey: string) => void
 * }} props
 */
// PUBLIC_INTERFACE
export function HabitCalendar({ habit, dayKeys, checkins, onToggle }) {
  /** Compact calendar row with daily toggles and computed stats. */
  const set = useMemo(() => new Set(checkins || []), [checkins]);
  const streak = useMemo(() => calculateStreak(checkins || [], new Date()), [checkins]);
  const completion = useMemo(() => completionForRange(checkins || [], dayKeys), [checkins, dayKeys]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: habit.color || "#3b82f6" }}
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{habit.name}</h3>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {habit.category ? habit.category : "Uncategorized"} • {completion.percent}% in range
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <span className="font-medium text-slate-900 dark:text-white">{streak.current}</span> current
          </div>
          <div>
            <span className="font-medium text-slate-900 dark:text-white">{streak.longest}</span> longest
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-7 gap-2">
            {dayKeys.slice(0, 7).map((k) => (
              <div key={`w_${k}`} className="text-[11px] text-slate-500 dark:text-slate-400">
                {formatWeekday(k)}
              </div>
            ))}
          </div>

          <div className={`mt-1 grid ${dayKeys.length === 7 ? "grid-cols-7" : "grid-cols-7"} gap-2`}>
            {dayKeys.map((k) => {
              const checked = set.has(k);
              return (
                <button
                  key={k}
                  onClick={() => onToggle(k)}
                  className={[
                    "h-10 rounded-xl border text-left px-2 py-1 transition-colors focus-visible:outline-none",
                    checked
                      ? "border-primary bg-primary/10 text-slate-900 dark:text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  ].join(" ")}
                  aria-pressed={checked}
                  aria-label={`${habit.name} check-in for ${formatShortDate(k)} (${checked ? "checked" : "not checked"})`}
                  title={formatShortDate(k)}
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{formatShortDate(k)}</div>
                  <div className="text-xs font-semibold">{checked ? "✓" : "—"}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
