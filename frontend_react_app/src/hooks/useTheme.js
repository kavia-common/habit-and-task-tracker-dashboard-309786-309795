import { useEffect } from "react";

/**
 * @param {{darkMode: boolean, setDarkMode: (v: boolean) => void}} params
 */
// PUBLIC_INTERFACE
export function useTheme({ darkMode, setDarkMode }) {
  /** Apply/remove dark mode class and expose toggle. */
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  // PUBLIC_INTERFACE
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return { toggleDarkMode };
}
