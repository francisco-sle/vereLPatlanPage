import { useCallback, useEffect, useState, type SetStateAction } from "react";
import { readStorage, writeStorage, type StorageKey } from "../lib/storage";

/** `useState` that is restored from and saved to localStorage. */
export function usePersistentState<T>(
  key: StorageKey,
  initial: T | (() => T),
  isValid?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
    return readStorage(key, fallback, isValid);
  });

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  const set = useCallback((next: SetStateAction<T>) => setValue(next), []);
  return [value, set] as const;
}
