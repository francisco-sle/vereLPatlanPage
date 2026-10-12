export type TabId = "home" | "curriculum" | "portfolio";

export type WindowId =
  | "browser"
  | "profile"
  | "about"
  | "skills"
  | "favorites"
  | "viewer";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  /** `null` until the user moves/resizes it; then the default layout is used. */
  rect: Rect | null;
  z: number;
}

export interface DesktopState {
  windows: Record<WindowId, WindowState>;
  activeTab: TabId;
  viewerProjectId: string | null;
  zTop: number;
}

export const TAB_IDS: readonly TabId[] = ["home", "curriculum", "portfolio"];

export const WINDOW_IDS: readonly WindowId[] = [
  "browser",
  "profile",
  "about",
  "skills",
  "favorites",
  "viewer",
];

export const isTabId = (value: unknown): value is TabId => TAB_IDS.includes(value as TabId);
