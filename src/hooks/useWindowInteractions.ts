import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from "react";
import { clamp, clampRect } from "../os/windowConfig";
import type { Rect, Size } from "../os/types";

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export const RESIZE_DIRECTIONS: readonly ResizeDirection[] = [
  "n",
  "s",
  "e",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
];

/** Elements inside a drag handle that keep their own pointer behavior. */
const INTERACTIVE = "button, a, input, textarea, select, [role='tab'], [data-no-drag]";

/** Pixels the pointer must travel before a maximized window tears off. */
const TEAR_OFF_DISTANCE = 6;

interface Options {
  ref: RefObject<HTMLElement | null>;
  rect: Rect;
  /** Where the window goes when it leaves maximized mode. */
  restoreRect: Rect;
  minSize: Size;
  desktop: Size;
  maximized: boolean;
  /** Small screens: windows can't be moved or resized. */
  locked: boolean;
  onCommit: (rect: Rect) => void;
  onUnmaximize: (rect: Rect) => void;
}

type Compute = (dx: number, dy: number, start: Rect) => Rect;

/**
 * Pointer-based dragging and resizing (mouse, pen and touch). While the
 * pointer moves, the element's style is updated directly once per frame;
 * the final rect is committed to state when the pointer is released.
 * Dragging a maximized window restores it under the pointer, like Windows.
 */
export function useWindowInteractions(options: Options) {
  const { ref, locked } = options;
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });

  const follow = useCallback(
    (originX: number, originY: number, start: Rect, compute: Compute) => {
      const element = ref.current;
      if (!element) return;
      let next = start;
      let frame = 0;

      const apply = () => {
        frame = 0;
        element.style.left = `${next.x}px`;
        element.style.top = `${next.y}px`;
        element.style.width = `${next.w}px`;
        element.style.height = `${next.h}px`;
      };
      const onMove = (event: globalThis.PointerEvent) => {
        next = compute(event.clientX - originX, event.clientY - originY, start);
        if (!frame) frame = requestAnimationFrame(apply);
      };
      const onEnd = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        document.body.classList.remove("is-interacting");
        if (frame) cancelAnimationFrame(frame);
        apply();
        const moved =
          next.x !== start.x || next.y !== start.y || next.w !== start.w || next.h !== start.h;
        if (moved) latest.current.onCommit(next);
      };

      document.body.classList.add("is-interacting");
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [ref],
  );

  const move: Compute = (dx, dy, start) =>
    clampRect({ ...start, x: start.x + dx, y: start.y + dy }, latest.current.desktop);

  // Waits for a small drag, then restores the maximized window under the pointer.
  const tearOff = (event: PointerEvent) => {
    const element = ref.current;
    if (!element) return;
    const downX = event.clientX;
    const downY = event.clientY;

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      if (Math.hypot(moveEvent.clientX - downX, moveEvent.clientY - downY) < TEAR_OFF_DISTANCE) {
        return;
      }
      stop();
      const { restoreRect, desktop, onUnmaximize } = latest.current;
      const area = element.parentElement?.getBoundingClientRect() ?? { left: 0, top: 0 };
      // Keep the pointer at the same relative spot of the title bar.
      const ratio = (downX - area.left) / desktop.width;
      const start = clampRect(
        {
          ...restoreRect,
          x: Math.round(moveEvent.clientX - area.left - ratio * restoreRect.w),
          y: Math.round(moveEvent.clientY - downY),
        },
        desktop,
      );
      onUnmaximize(start);
      follow(moveEvent.clientX, moveEvent.clientY, start, move);
    };
    const stop = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  const startDrag = (event: PointerEvent) => {
    if (locked || event.button !== 0 || (event.target as Element).closest(INTERACTIVE)) return;
    event.preventDefault();
    if (latest.current.maximized) tearOff(event);
    else follow(event.clientX, event.clientY, latest.current.rect, move);
  };

  const startResize = (direction: ResizeDirection) => (event: PointerEvent) => {
    if (locked || event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    follow(event.clientX, event.clientY, latest.current.rect, (dx, dy, start) => {
      const { minSize: min, desktop } = latest.current;
      let { x, y, w, h } = start;
      if (direction.includes("e")) {
        w = clamp(start.w + dx, min.width, desktop.width - start.x);
      }
      if (direction.includes("s")) {
        h = clamp(start.h + dy, min.height, desktop.height - start.y);
      }
      if (direction.includes("w")) {
        const right = start.x + start.w;
        x = clamp(start.x + dx, Math.min(0, start.x), right - min.width);
        w = right - x;
      }
      if (direction.includes("n")) {
        const bottom = start.y + start.h;
        y = clamp(start.y + dy, 0, bottom - min.height);
        h = bottom - y;
      }
      return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
    });
  };

  return { startDrag, startResize };
}
