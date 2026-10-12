import { useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { siteConfig } from "../config/site";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useI18n } from "../i18n/useI18n";
import { STORAGE_KEYS, readStorage, writeStorage } from "../lib/storage";
import { playSound } from "../sound/sound";
import { DesktopContext, type DesktopActions } from "./DesktopContext";
import {
  createDefaultState,
  desktopReducer,
  getFocusedId,
  parseSavedDesktop,
} from "./desktopReducer";
import { isTabId, type DesktopState, type TabId, type WindowId } from "./types";
import { companionIds } from "./windowConfig";

const COMPACT_QUERY = "(max-width: 760px), (max-height: 520px)";

/** Reads the tab from `/curriculum`, or from old `#/curriculum` hash links. */
function tabFromLocation(): TabId | null {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const candidate = (hash || path).toLowerCase();
  return isTabId(candidate) ? candidate : null;
}

function createInitialState(): DesktopState {
  const withCompanions = !window.matchMedia(COMPACT_QUERY).matches;
  const urlTab = tabFromLocation();
  const saved = parseSavedDesktop(readStorage<unknown>(STORAGE_KEYS.desktop, null));

  if (!saved) return createDefaultState(urlTab ?? "home", withCompanions);

  const needsTab = urlTab && (urlTab !== saved.activeTab || !saved.windows.browser.open);
  const hasStrayCompanions =
    !withCompanions && [...companionIds].some((id) => saved.windows[id].open);
  if (needsTab || hasStrayCompanions) {
    return desktopReducer(saved, {
      type: "setTab",
      tab: urlTab ?? saved.activeTab,
      withCompanions,
    });
  }
  return saved;
}

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, undefined, createInitialState);
  const isCompact = useMediaQuery(COMPACT_QUERY);
  const { t } = useI18n();

  const stateRef = useRef(state);
  const compactRef = useRef(isCompact);
  useEffect(() => {
    stateRef.current = state;
    compactRef.current = isCompact;
  });

  // Save the desktop shortly after it changes, and right away when leaving.
  useEffect(() => {
    const timeout = window.setTimeout(() => writeStorage(STORAGE_KEYS.desktop, state), 250);
    return () => window.clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    const flush = () => writeStorage(STORAGE_KEYS.desktop, stateRef.current);
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  // Crossing the small-screen breakpoint moves companion content in/out of the browser.
  useEffect(() => {
    const list = window.matchMedia(COMPACT_QUERY);
    const onChange = () =>
      dispatch({
        type: "setTab",
        tab: stateRef.current.activeTab,
        withCompanions: !list.matches,
      });
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);

  // Keep the URL in sync with the active tab so pages can be linked and bookmarked.
  const isFirstSync = useRef(true);
  const browserOpen = state.windows.browser.open;
  useEffect(() => {
    if (!browserOpen && !isFirstSync.current) return;
    const path = `/${state.activeTab}`;
    const url = new URL(window.location.href);
    if (url.pathname !== path || url.hash) {
      const method = isFirstSync.current ? "replaceState" : "pushState";
      window.history[method]({ tab: state.activeTab }, "", path + url.search);
    }
    isFirstSync.current = false;
  }, [state.activeTab, browserOpen]);

  useEffect(() => {
    const onPopState = () =>
      dispatch({
        type: "setTab",
        tab: tabFromLocation() ?? "home",
        withCompanions: !compactRef.current,
      });
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = `${t(`tab.${state.activeTab}`)} · ${siteConfig.siteName}`;
  }, [state.activeTab, t]);

  // Every action plays its retro sound, chosen from the state it acts on.
  const actions = useMemo<DesktopActions>(() => {
    const win = (id: WindowId) => stateRef.current.windows[id];
    return {
      open: (id) => {
        if (!win(id).open || win(id).minimized) playSound("open");
        dispatch({ type: "open", id });
      },
      close: (id) => {
        playSound("close");
        dispatch({ type: "close", id });
      },
      minimize: (id) => {
        playSound("minimize");
        dispatch({ type: "minimize", id });
      },
      restore: (id) => {
        playSound("restore");
        dispatch({ type: "restore", id });
      },
      toggleMaximize: (id) => {
        playSound(win(id).maximized ? "restore" : "maximize");
        dispatch({ type: "toggleMaximize", id });
      },
      focus: (id) => dispatch({ type: "focus", id }),
      setRect: (id, rect) => dispatch({ type: "setRect", id, rect }),
      unmaximizeTo: (id, rect) => dispatch({ type: "unmaximizeTo", id, rect }),
      resetWindow: (id) => {
        playSound("restore");
        dispatch({ type: "resetWindow", id });
      },
      minimizeAll: () => {
        playSound("minimize");
        dispatch({ type: "minimizeAll" });
      },
      taskbarToggle: (id) => {
        const focused = getFocusedId(stateRef.current) === id;
        playSound(win(id).minimized ? "restore" : focused ? "minimize" : "click");
        dispatch({ type: "taskbarToggle", id });
      },
      setTab: (tab) => {
        const browser = win("browser");
        if (!browser.open || browser.minimized) playSound("open");
        else if (stateRef.current.activeTab !== tab) playSound("tab");
        dispatch({ type: "setTab", tab, withCompanions: !compactRef.current });
      },
      openProject: (projectId) => {
        playSound(win("viewer").open && !win("viewer").minimized ? "tab" : "open");
        dispatch({ type: "openProject", projectId });
      },
      resetLayout: () => {
        playSound("restore");
        dispatch({ type: "resetLayout", withCompanions: !compactRef.current });
      },
    };
  }, []);

  const value = useMemo(
    () => ({ state, focusedId: getFocusedId(state), actions, isCompact }),
    [state, actions, isCompact],
  );

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}
