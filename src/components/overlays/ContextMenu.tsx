import { m } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { menuItems, useMenuNavigation } from "../../hooks/useMenuNavigation";
import type { MenuEntry } from "./OverlayContext";
import styles from "./Overlays.module.css";

interface Props {
  x: number;
  y: number;
  items: MenuEntry[];
  onClose: (returnFocus: boolean) => void;
}

const EDGE = 8;

export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = useMenuNavigation(ref, onClose);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Keep the menu inside the viewport, opening up/left near the edges.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    const left = x + width > window.innerWidth - EDGE ? Math.max(EDGE, x - width) : x;
    const top = y + height > window.innerHeight - EDGE ? Math.max(EDGE, y - height) : y;
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.transformOrigin = `${left < x ? "right" : "left"} ${top < y ? "bottom" : "top"}`;
    menuItems(element)[0]?.focus();
  }, [x, y]);

  useEffect(() => {
    const close = () => onCloseRef.current(false);
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, []);

  return (
    <m.div
      ref={ref}
      role="menu"
      className={styles.menu}
      style={{ left: x, top: y }}
      onKeyDown={onKeyDown}
      onContextMenu={(event) => event.preventDefault()}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
      transition={{ type: "spring", stiffness: 700, damping: 38 }}
    >
      {items.map((item, index) =>
        item === "separator" ? (
          <div key={`separator-${index}`} role="separator" className={styles.separator} />
        ) : (
          <button
            key={item.label}
            type="button"
            role={item.checked === undefined ? "menuitem" : "menuitemcheckbox"}
            aria-checked={item.checked}
            tabIndex={-1}
            className={`${styles.item} ${item.danger ? styles.danger : ""}`}
            onClick={() => {
              onClose(false);
              item.onSelect();
            }}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span className={styles.itemLabel}>{item.label}</span>
            {item.checked && (
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        ),
      )}
    </m.div>
  );
}
