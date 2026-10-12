import { useLayoutEffect, useRef } from "react";
import type { WindowId } from "../../os/types";
import styles from "./Taskbar.module.css";

interface Props {
  id: WindowId;
  maxWidth: number;
  maxHeight: number;
}

/**
 * A scaled-down copy of a window's current DOM, used as a taskbar thumbnail.
 * Minimized windows stay mounted (just hidden), so they can be previewed too.
 */
export function WindowSnapshot({ id, maxWidth, maxHeight }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = ref.current;
    const source = document.querySelector<HTMLElement>(`[data-window="${id}"]`);
    if (!host || !source) return;

    const width = source.offsetWidth;
    const height = source.offsetHeight;
    const scale = Math.min(maxWidth / width, maxHeight / height);
    const clone = source.cloneNode(true) as HTMLElement;

    // A static, non-interactive picture: no duplicate ids or hooks for queries.
    clone.removeAttribute("data-window");
    clone.removeAttribute("role");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    Object.assign(clone.style, {
      left: "0",
      top: "0",
      transform: `scale(${scale})`,
      transformOrigin: "0 0",
      opacity: "1",
      visibility: "visible",
      zIndex: "auto",
      pointerEvents: "none",
    });
    host.style.width = `${Math.round(width * scale)}px`;
    host.style.height = `${Math.round(height * scale)}px`;
    host.replaceChildren(clone);

    // Match scroll positions so the thumbnail shows what the window shows.
    const sourceNodes = source.querySelectorAll<HTMLElement>("*");
    const cloneNodes = clone.querySelectorAll<HTMLElement>("*");
    sourceNodes.forEach((node, index) => {
      if (node.scrollTop) cloneNodes[index].scrollTop = node.scrollTop;
    });
  }, [id, maxWidth, maxHeight]);

  return <div ref={ref} className={styles.snapshot} />;
}
