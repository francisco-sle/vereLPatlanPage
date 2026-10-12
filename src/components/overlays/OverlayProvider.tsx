import { AnimatePresence, m } from "motion/react";
import { useCallback, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { playSound } from "../../sound/sound";
import { ConfirmDialog } from "./ConfirmDialog";
import { ContextMenu } from "./ContextMenu";
import {
  OverlayContext,
  type ConfirmOptions,
  type MenuEntry,
  type OverlayValue,
} from "./OverlayContext";
import styles from "./Overlays.module.css";

const TOAST_MS = 2600;

interface MenuState {
  x: number;
  y: number;
  items: MenuEntry[];
  key: number;
}

interface ConfirmState {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

/** Context menus, toasts and confirm dialogs, shared by the whole desktop. */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openMenu = useCallback((event: MouseEvent, items: MenuEntry[]) => {
    event.preventDefault();
    event.stopPropagation();
    returnFocus.current = document.activeElement as HTMLElement | null;
    let { clientX: x, clientY: y } = event;
    // Opened from the keyboard (Menu key / Shift+F10): anchor to the element.
    if (x === 0 && y === 0) {
      const rect = (event.currentTarget as Element).getBoundingClientRect();
      x = rect.left + 12;
      y = rect.top + Math.min(rect.height, 40);
    }
    playSound("click");
    setMenu({ x, y, items, key: Date.now() });
  }, []);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenu(null);
    if (restoreFocus) returnFocus.current?.focus();
  }, []);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-2), { id, message }]);
    window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), TOAST_MS);
  }, []);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        playSound("notify");
        setConfirmState({ options, resolve });
      }),
    [],
  );

  const closeConfirm = useCallback(
    (confirmed: boolean) => {
      confirmState?.resolve(confirmed);
      setConfirmState(null);
    },
    [confirmState],
  );

  const value = useMemo<OverlayValue>(
    () => ({ openMenu, toast, confirm }),
    [openMenu, toast, confirm],
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {menu && (
          <ContextMenu
            key={menu.key}
            x={menu.x}
            y={menu.y}
            items={menu.items}
            onClose={closeMenu}
          />
        )}
      </AnimatePresence>

      <div className={styles.toasts} role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((item) => (
            <m.p
              key={item.id}
              layout
              className={styles.toast}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            >
              {item.message}
            </m.p>
          ))}
        </AnimatePresence>
      </div>

      {confirmState && <ConfirmDialog options={confirmState.options} onClose={closeConfirm} />}
    </OverlayContext.Provider>
  );
}
