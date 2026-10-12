import { companionIds, tabCompanions } from "./windowConfig";
import {
  WINDOW_IDS,
  isTabId,
  type DesktopState,
  type Rect,
  type TabId,
  type WindowId,
  type WindowState,
} from "./types";

export type DesktopAction =
  | { type: "open"; id: WindowId }
  | { type: "close"; id: WindowId }
  | { type: "minimize"; id: WindowId }
  | { type: "restore"; id: WindowId }
  | { type: "toggleMaximize"; id: WindowId }
  | { type: "focus"; id: WindowId }
  | { type: "setRect"; id: WindowId; rect: Rect }
  /** Leaves maximized mode at a new position (dragging a maximized title bar). */
  | { type: "unmaximizeTo"; id: WindowId; rect: Rect }
  /** Forgets a window's custom position and size. */
  | { type: "resetWindow"; id: WindowId }
  | { type: "minimizeAll" }
  /** Taskbar button: restore if minimized, minimize if focused, otherwise focus. */
  | { type: "taskbarToggle"; id: WindowId }
  /** `withCompanions` is false on small screens, where companion content is inline. */
  | { type: "setTab"; tab: TabId; withCompanions: boolean }
  | { type: "openProject"; projectId: string }
  | { type: "resetLayout"; withCompanions: boolean };

const closedWindow = (): WindowState => ({
  open: false,
  minimized: false,
  maximized: false,
  rect: null,
  z: 0,
});

export function createDefaultState(tab: TabId = "home", withCompanions = true): DesktopState {
  const windows = Object.fromEntries(
    WINDOW_IDS.map((id) => [id, closedWindow()]),
  ) as Record<WindowId, WindowState>;
  const empty: DesktopState = { windows, activeTab: tab, viewerProjectId: null, zTop: 0 };
  return setTab(empty, tab, withCompanions);
}

/** Id of the top-most visible window, which is the one that has focus. */
export function getFocusedId(state: DesktopState): WindowId | null {
  let top: WindowId | null = null;
  for (const id of WINDOW_IDS) {
    const win = state.windows[id];
    if (win.open && !win.minimized && (!top || win.z > state.windows[top].z)) top = id;
  }
  return top;
}

const patch = (state: DesktopState, id: WindowId, changes: Partial<WindowState>): DesktopState => ({
  ...state,
  windows: { ...state.windows, [id]: { ...state.windows[id], ...changes } },
});

const bringToFront = (state: DesktopState, id: WindowId): DesktopState => {
  if (getFocusedId(state) === id && !state.windows[id].minimized) return state;
  const z = state.zTop + 1;
  return { ...patch(state, id, { z }), zTop: z };
};

const openWindow = (state: DesktopState, id: WindowId): DesktopState =>
  bringToFront(patch(state, id, { open: true, minimized: false }), id);

const closeWindow = (state: DesktopState, id: WindowId): DesktopState => {
  let next = patch(state, id, { open: false, minimized: false });
  // Companion windows belong to the browser's current page.
  if (id === "browser") {
    for (const companion of companionIds) {
      next = patch(next, companion, { open: false, minimized: false });
    }
  }
  return next;
};

function setTab(state: DesktopState, tab: TabId, withCompanions: boolean): DesktopState {
  let next: DesktopState = { ...state, activeTab: tab };
  const wanted = withCompanions ? tabCompanions[tab] : [];
  for (const id of companionIds) {
    if (!wanted.includes(id) && next.windows[id].open) next = closeWindow(next, id);
  }
  next = openWindow(next, "browser");
  for (const id of wanted) next = openWindow(next, id);
  return next;
}

export function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case "open":
      return openWindow(state, action.id);
    case "close":
      return closeWindow(state, action.id);
    case "minimize":
      return patch(state, action.id, { minimized: true });
    case "restore":
      return openWindow(state, action.id);
    case "focus":
      return bringToFront(state, action.id);
    case "toggleMaximize":
      return bringToFront(
        patch(state, action.id, { maximized: !state.windows[action.id].maximized }),
        action.id,
      );
    case "setRect":
      return patch(state, action.id, { rect: action.rect });
    case "unmaximizeTo":
      return patch(state, action.id, { rect: action.rect, maximized: false });
    case "resetWindow":
      return bringToFront(patch(state, action.id, { rect: null, maximized: false }), action.id);
    case "minimizeAll": {
      let next = state;
      for (const id of WINDOW_IDS) {
        if (next.windows[id].open) next = patch(next, id, { minimized: true });
      }
      return next;
    }
    case "taskbarToggle": {
      const win = state.windows[action.id];
      if (win.minimized) return openWindow(state, action.id);
      if (getFocusedId(state) === action.id) return patch(state, action.id, { minimized: true });
      return bringToFront(state, action.id);
    }
    case "setTab":
      return setTab(state, action.tab, action.withCompanions);
    case "openProject":
      return openWindow({ ...state, viewerProjectId: action.projectId }, "viewer");
    case "resetLayout":
      return createDefaultState(state.activeTab, action.withCompanions);
  }
}

/* ---------- Persistence ---------- */

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isRect = (value: unknown): value is Rect => {
  if (!value || typeof value !== "object") return false;
  const rect = value as Record<string, unknown>;
  return isNumber(rect.x) && isNumber(rect.y) && isNumber(rect.w) && isNumber(rect.h);
};

const parseWindow = (value: unknown): WindowState | null => {
  if (!value || typeof value !== "object") return null;
  const win = value as Record<string, unknown>;
  if (typeof win.open !== "boolean" || !isNumber(win.z)) return null;
  return {
    open: win.open,
    minimized: win.minimized === true,
    maximized: win.maximized === true,
    rect: isRect(win.rect) ? win.rect : null,
    z: win.z,
  };
};

/**
 * Validates a saved desktop. Unknown or broken windows fall back to closed,
 * so adding new windows later never breaks a visitor's saved layout.
 */
export function parseSavedDesktop(value: unknown): DesktopState | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  if (!isTabId(saved.activeTab) || !saved.windows || typeof saved.windows !== "object") {
    return null;
  }
  const savedWindows = saved.windows as Record<string, unknown>;
  const windows = Object.fromEntries(
    WINDOW_IDS.map((id) => [id, parseWindow(savedWindows[id]) ?? closedWindow()]),
  ) as Record<WindowId, WindowState>;
  const zTop = Math.max(0, ...WINDOW_IDS.map((id) => windows[id].z));
  return {
    windows,
    activeTab: saved.activeTab,
    viewerProjectId: typeof saved.viewerProjectId === "string" ? saved.viewerProjectId : null,
    zTop,
  };
}
