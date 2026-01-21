import React from "react";
import { NavLink } from "react-router-dom";

/**
 * @param {{
 *  timeframe: "week"|"month",
 *  onTimeframeChange: (t: "week"|"month") => void,
 *  darkMode: boolean,
 *  onToggleDarkMode: () => void
 * }} props
 */
// PUBLIC_INTERFACE
export function Header({ timeframe, onTimeframeChange, darkMode, onToggleDarkMode }) {
  /** Top navigation header for small screens + controls for timeframe/theme. */
  const linkBase =
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none";
  const linkActive = "bg-primary/10 text-primary";
  const linkIdle = "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-semibold">
            HT
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Habit & Task Tracker
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Local dashboard
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
            Dashboard
          </NavLink>
          <NavLink to="/habits" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
            Habits
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkIdle}`}>
            Tasks
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${timeframe === "week" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              onClick={() => onTimeframeChange("week")}
              aria-pressed={timeframe === "week"}
            >
              Week
            </button>
            <button
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${timeframe === "month" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              onClick={() => onTimeframeChange("month")}
              aria-pressed={timeframe === "month"}
            >
              Month
            </button>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3 sm:hidden">
        <nav className="grid grid-cols-3 gap-2" aria-label="Primary mobile">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} text-center ${isActive ? linkActive : linkIdle}`}>
            Dashboard
          </NavLink>
          <NavLink to="/habits" className={({ isActive }) => `${linkBase} text-center ${isActive ? linkActive : linkIdle}`}>
            Habits
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `${linkBase} text-center ${isActive ? linkActive : linkIdle}`}>
            Tasks
          </NavLink>
        </nav>
        <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-600 dark:text-slate-300">Timeframe</span>
          <div className="flex items-center gap-1">
            <button
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${timeframe === "week" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              onClick={() => onTimeframeChange("week")}
              aria-pressed={timeframe === "week"}
            >
              Week
            </button>
            <button
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${timeframe === "month" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              onClick={() => onTimeframeChange("month")}
              aria-pressed={timeframe === "month"}
            >
              Month
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
