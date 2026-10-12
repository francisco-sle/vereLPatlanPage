import { useLayoutEffect, useState, type RefObject } from "react";
import type { Size } from "../os/types";

/** Tracks an element's size with a ResizeObserver. */
export function useElementSize(ref: RefObject<HTMLElement | null>, initial: () => Size): Size {
  const [size, setSize] = useState(initial);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width: Math.round(width), height: Math.round(height) },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
