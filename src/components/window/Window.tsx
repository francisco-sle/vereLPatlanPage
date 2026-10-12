import { m, type TargetAndTransition } from "motion/react";
import { useId, useLayoutEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { RESIZE_DIRECTIONS, useWindowInteractions } from "../../hooks/useWindowInteractions";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop, useDesktopSize } from "../../os/DesktopContext";
import type { WindowId } from "../../os/types";
import { clampRect, defaultRect, windowConfig } from "../../os/windowConfig";
import styles from "./Window.module.css";
import { useOverlays } from "../overlays/OverlayContext";
import { WindowControls } from "./WindowControls";
import { useWindowMenu } from "./useWindowMenu";

interface WindowProps {
  id: WindowId;
  /** Defaults to the window's configured title. */
  title?: string;
  /** Replaces the title text in the title bar (e.g. the browser's address bar). */
  toolbar?: ReactNode;
  /** Rendered above the frame, like browser tabs. */
  tabs?: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}

const GEOMETRY_ANIMATION_MS = 320;

const openTransition = { type: "spring", stiffness: 460, damping: 34, mass: 0.8 } as const;

export function Window({ id, title, toolbar, tabs, footer, bodyClassName, children }: WindowProps) {
  const { state, focusedId, actions, isCompact } = useDesktop();
  const desktop = useDesktopSize();
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();

  const config = windowConfig[id];
  const win = state.windows[id];
  const isFocused = focusedId === id;
  const maximized = win.maximized || isCompact;
  const windowTitle = title ?? t(config.titleKey);

  const { openMenu } = useOverlays();
  const windowMenu = useWindowMenu();

  const restoreRect = clampRect(win.rect ?? defaultRect(id, desktop), desktop);
  const rect = maximized ? { x: 0, y: 0, w: desktop.width, h: desktop.height } : restoreRect;

  // Set while a drag pulls the window out of maximized mode (no animation then).
  const tearingOff = useRef(false);
  const { startDrag, startResize } = useWindowInteractions({
    ref,
    rect,
    restoreRect,
    minSize: config.minSize,
    desktop,
    maximized,
    locked: isCompact,
    onCommit: (next) => actions.setRect(id, next),
    onUnmaximize: (next) => {
      tearingOff.current = true;
      actions.unmaximizeTo(id, next);
    },
  });

  // Animate size & position when maximizing or restoring (from any control).
  const wasMaximized = useRef(win.maximized);
  useLayoutEffect(() => {
    if (wasMaximized.current === win.maximized) return;
    wasMaximized.current = win.maximized;
    const element = ref.current;
    if (!element || tearingOff.current) {
      tearingOff.current = false;
      return;
    }
    element.classList.add(styles.animateGeometry);
    const timeout = window.setTimeout(
      () => element.classList.remove(styles.animateGeometry),
      GEOMETRY_ANIMATION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [win.maximized]);

  const toggleMaximize = () => {
    if (!isCompact) actions.toggleMaximize(id);
  };

  const onContextMenu = (event: MouseEvent) => {
    // Keep the browser's own menu in text fields (paste, spellcheck…).
    if ((event.target as Element).closest("input, textarea")) return;
    openMenu(event, windowMenu(id));
  };

  // Minimizing shrinks the window down towards the taskbar.
  const visible: TargetAndTransition = {
    opacity: 1,
    scale: 1,
    y: 0,
    visibility: "visible",
    transition: openTransition,
  };
  const minimized: TargetAndTransition = {
    opacity: 0,
    scale: 0.35,
    y: Math.max(desktop.height - rect.y - rect.h * 0.4, 40),
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] },
    transitionEnd: { visibility: "hidden" },
  };

  const classes = [
    styles.window,
    styles[config.variant],
    isFocused && styles.focused,
    maximized && styles.maximized,
    isCompact && styles.locked,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <m.section
      ref={ref}
      className={classes}
      role="dialog"
      aria-labelledby={titleId}
      data-window={id}
      inert={win.minimized}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex: win.z,
        transformOrigin: "50% 100%",
      }}
      initial={{ opacity: 0, scale: 0.94, y: 14 }}
      animate={win.minimized ? minimized : visible}
      exit={{ opacity: 0, scale: 0.94, y: 8, transition: { duration: 0.16, ease: "easeIn" } }}
      onPointerDownCapture={() => {
        if (!isFocused) actions.focus(id);
      }}
    >
      {tabs && (
        <div className={styles.tabs} onPointerDown={startDrag} onContextMenu={onContextMenu}>
          {tabs}
        </div>
      )}

      <div className={styles.frame}>
        <header
          className={styles.titleBar}
          onPointerDown={startDrag}
          onContextMenu={onContextMenu}
          onDoubleClick={(event) => {
            if (!(event.target as Element).closest("button, input, a")) toggleMaximize();
          }}
        >
          {toolbar ? (
            <>
              <h2 id={titleId} className="visually-hidden">
                {windowTitle}
              </h2>
              <div className={styles.toolbar}>{toolbar}</div>
            </>
          ) : (
            <h2 id={titleId} className={styles.title}>
              {windowTitle}
            </h2>
          )}
          <WindowControls
            maximized={maximized}
            canMaximize={!isCompact}
            onMinimize={() => actions.minimize(id)}
            onToggleMaximize={toggleMaximize}
            onClose={() => actions.close(id)}
          />
        </header>

        <div className={`${styles.body} ${bodyClassName ?? ""}`}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>

      {!maximized &&
        RESIZE_DIRECTIONS.map((direction) => (
          <div
            key={direction}
            className={`${styles.handle} ${styles[`handle-${direction}`]}`}
            onPointerDown={startResize(direction)}
            aria-hidden="true"
          />
        ))}
    </m.section>
  );
}
