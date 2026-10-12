import { createContext, useContext } from "react";
import type { DesktopState, Rect, Size, TabId, WindowId } from "./types";

export interface DesktopActions {
  open: (id: WindowId) => void;
  close: (id: WindowId) => void;
  minimize: (id: WindowId) => void;
  restore: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  focus: (id: WindowId) => void;
  setRect: (id: WindowId, rect: Rect) => void;
  unmaximizeTo: (id: WindowId, rect: Rect) => void;
  resetWindow: (id: WindowId) => void;
  minimizeAll: () => void;
  taskbarToggle: (id: WindowId) => void;
  setTab: (tab: TabId) => void;
  openProject: (projectId: string) => void;
  resetLayout: () => void;
}

export interface DesktopContextValue {
  state: DesktopState;
  focusedId: WindowId | null;
  actions: DesktopActions;
  /** Small screens: windows are always maximized and companions are inline. */
  isCompact: boolean;
}

export const DesktopContext = createContext<DesktopContextValue | null>(null);

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) throw new Error("useDesktop must be used inside <DesktopProvider>");
  return context;
}

/** Size of the desktop area (viewport minus the taskbar). */
export const DesktopSizeContext = createContext<Size>({ width: 1280, height: 720 });

export const useDesktopSize = () => useContext(DesktopSizeContext);
