import { useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../lib/storage";

/**
 * @template T
 * @param {string} key
 * @param {T} defaultValue
 * @returns {[T, (next: T | ((prev: T) => T)) => void]}
 */
// PUBLIC_INTERFACE
export function useLocalStorage(key, defaultValue) {
  /** Persist a piece of state to localStorage. */
  const [value, setValue] = useState(() => loadFromStorage(key, defaultValue));

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
