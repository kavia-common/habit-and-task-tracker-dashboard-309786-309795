import React, { useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { Habits } from "./pages/Habits";
import { Tasks } from "./pages/Tasks";

import { useHabits } from "./hooks/useHabits";
import { useTasks } from "./hooks/useTasks";
import { loadAllState, persistPrefs } from "./lib/storage";
import { useTheme } from "./hooks/useTheme";

// PUBLIC_INTERFACE
function App() {
  /** Main SPA entry: routing + global prefs (timeframe, dark mode) */
  const initial = useMemo(() => loadAllState(), []);
  const [prefs, setPrefs] = useState(initial.prefs);

  const { habits, habitCheckins, createHabit, updateHabit, deleteHabit, toggleCheckin } = useHabits();
  const { tasks, createTask, updateTask, deleteTask, moveTaskStatus } = useTasks();

  const setTimeframe = (timeframe) => {
    const next = { ...prefs, timeframe };
    setPrefs(next);
    persistPrefs(next);
  };

  const setDarkMode = (darkMode) => {
    const next = { ...prefs, darkMode: !!darkMode };
    setPrefs(next);
    persistPrefs(next);
  };

  const { toggleDarkMode } = useTheme({ darkMode: !!prefs.darkMode, setDarkMode });

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-text dark:bg-slate-950 dark:text-white">
        <Header
          timeframe={prefs.timeframe || "week"}
          onTimeframeChange={setTimeframe}
          darkMode={!!prefs.darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={<Dashboard habits={habits} habitCheckins={habitCheckins} tasks={tasks} timeframe={prefs.timeframe || "week"} />}
            />
            <Route
              path="/habits"
              element={
                <Habits
                  habits={habits}
                  habitCheckins={habitCheckins}
                  timeframe={prefs.timeframe || "week"}
                  onCreate={createHabit}
                  onUpdate={updateHabit}
                  onDelete={deleteHabit}
                  onToggleCheckin={toggleCheckin}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <Tasks
                  tasks={tasks}
                  onCreate={createTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  onMove={moveTaskStatus}
                />
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
          Data is stored locally in your browser • Built with React + Tailwind + Chart.js
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
