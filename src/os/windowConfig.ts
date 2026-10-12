import type { TranslationKey } from "../i18n/translations";
import type { Rect, Size, TabId, WindowId } from "./types";

type WindowVariant = "pink" | "blue";

interface WindowConfig {
  titleKey: TranslationKey;
  variant: WindowVariant;
  minSize: Size;
  /**
   * Default placement as fractions of the desktop, based on the Figma layout,
   * with pixel minimums so windows stay usable on smaller screens.
   */
  layout: { x: number; y: number; w: number; h: number; minW: number; minH: number };
}

export const windowConfig: Record<WindowId, WindowConfig> = {
  browser: {
    titleKey: "window.browser",
    variant: "pink",
    minSize: { width: 420, height: 320 },
    layout: { x: 0.22, y: 0.05, w: 0.56, h: 0.76, minW: 640, minH: 460 },
  },
  profile: {
    titleKey: "window.profile",
    variant: "blue",
    minSize: { width: 220, height: 240 },
    layout: { x: 0.105, y: 0.45, w: 0.2, h: 0.46, minW: 260, minH: 320 },
  },
  about: {
    titleKey: "window.about",
    variant: "blue",
    minSize: { width: 260, height: 200 },
    layout: { x: 0.69, y: 0.27, w: 0.29, h: 0.48, minW: 360, minH: 360 },
  },
  skills: {
    titleKey: "window.skills",
    variant: "blue",
    minSize: { width: 280, height: 240 },
    layout: { x: 0.155, y: 0.47, w: 0.3, h: 0.42, minW: 460, minH: 340 },
  },
  favorites: {
    titleKey: "window.favorites",
    variant: "blue",
    minSize: { width: 260, height: 240 },
    layout: { x: 0.64, y: 0.22, w: 0.26, h: 0.55, minW: 340, minH: 360 },
  },
  viewer: {
    titleKey: "window.viewer",
    variant: "blue",
    minSize: { width: 260, height: 260 },
    layout: { x: 0.7, y: 0.19, w: 0.26, h: 0.62, minW: 360, minH: 420 },
  },
};

/** Windows that open alongside a browser tab, as in the Figma design. */
export const tabCompanions: Record<TabId, WindowId[]> = {
  home: ["profile", "about"],
  curriculum: ["skills"],
  portfolio: [],
};

export const companionIds = new Set(Object.values(tabCompanions).flat());

/** Pixels of a window that must stay on screen so it can be grabbed back. */
const GRAB_MARGIN = 72;
/** Width of the desktop folder column that default layouts try not to cover. */
const ICON_COLUMN = 150;
const TITLE_MARGIN = 44;

export function defaultRect(id: WindowId, desktop: Size): Rect {
  const { layout } = windowConfig[id];
  const w = Math.min(Math.max(desktop.width * layout.w, layout.minW), desktop.width);
  const h = Math.min(Math.max(desktop.height * layout.h, layout.minH), desktop.height);
  // Nudge back inside the desktop when the minimum size pushes it past an edge.
  const minX = desktop.width - w >= ICON_COLUMN ? ICON_COLUMN : 0;
  const x = clamp(desktop.width * layout.x, minX, desktop.width - w);
  const y = clamp(desktop.height * layout.y, 0, desktop.height - h);
  return clampRect({ x, y, w, h }, desktop);
}

/** Keeps a window reachable: never larger than the desktop, never lost off-screen. */
export function clampRect(rect: Rect, desktop: Size): Rect {
  const w = Math.min(rect.w, desktop.width);
  const h = Math.min(rect.h, desktop.height);
  // Prefer fully visible; fall back to "at least the grab margin is visible".
  const fitsX = rect.x >= 0 && rect.x + w <= desktop.width;
  const fitsY = rect.y >= 0 && rect.y + h <= desktop.height;
  const x = fitsX
    ? rect.x
    : clamp(rect.x, Math.min(0, GRAB_MARGIN - w), Math.max(0, desktop.width - GRAB_MARGIN));
  const y = fitsY ? rect.y : clamp(rect.y, 0, Math.max(0, desktop.height - TITLE_MARGIN));
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
