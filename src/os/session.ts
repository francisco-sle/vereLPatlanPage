/**
 * Whether the visitor is "logged in" to the desktop. The boot and welcome
 * screens play once per browser tab; reloading the page skips them.
 */
import { useSyncExternalStore } from "react";
import { siteConfig } from "../config/site";

/** What the startup screen shows first: the boot logo, or (after "Log off") the welcome screen. */
export type StartupScreen = "boot" | "logoff";

const SESSION_KEY = `${siteConfig.storagePrefix}:logged-in`;

function readLoggedIn(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

let startup: StartupScreen | null = readLoggedIn() ? null : "boot";
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export function logIn() {
  startup = null;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Storage unavailable: the boot screen just plays again on reload.
  }
  emit();
}

export function logOff() {
  startup = "logoff";
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable: nothing to forget.
  }
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The startup screen to show, or `null` once the visitor is on the desktop. */
export const useStartupScreen = () => useSyncExternalStore(subscribe, () => startup);

export const useLoggedIn = () => useStartupScreen() === null;
