import { siteConfig } from "../config/site";

/** Every key saved in localStorage, in one place. */
export const STORAGE_KEYS = {
  desktop: "desktop",
  favorites: "favorites",
  recent: "recent",
  language: "language",
  collapsedSections: "portfolio-collapsed",
  hintDismissed: "hint-dismissed",
  sound: "sound",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const fullKey = (key: StorageKey) => `${siteConfig.storagePrefix}:${key}`;

/**
 * Reads and parses a stored value. Returns `fallback` when the value is
 * missing, unreadable (private mode, blocked storage) or fails `isValid`.
 */
export function readStorage<T>(
  key: StorageKey,
  fallback: T,
  isValid?: (value: unknown) => value is T,
): T {
  try {
    const raw = window.localStorage.getItem(fullKey(key));
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid && !isValid(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/** Set after clearing, so pending saves (e.g. on page hide) can't write data back. */
let cleared = false;

export function writeStorage(key: StorageKey, value: unknown): void {
  if (cleared) return;
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
  } catch {
    // Storage full or unavailable: the site keeps working without persistence.
  }
}

/** Removes everything this site saved (favorites, layout, preferences…). */
export function clearAllStorage(): void {
  cleared = true;
  try {
    const prefix = `${siteConfig.storagePrefix}:`;
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Storage unavailable: nothing to clear.
  }
}

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
