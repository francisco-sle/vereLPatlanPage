import { useCallback, type KeyboardEvent, type RefObject } from "react";

export const menuItems = (menu: HTMLElement | null) =>
  Array.from(
    menu?.querySelectorAll<HTMLElement>("[role^='menuitem']:not([aria-disabled='true'])") ?? [],
  );

/** Arrow/Home/End navigation between menu items, Escape and Tab to close. */
export function useMenuNavigation(
  ref: RefObject<HTMLElement | null>,
  onClose: (returnFocus: boolean) => void,
) {
  return useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose(true);
        return;
      }
      if (event.key === "Tab") {
        onClose(false);
        return;
      }
      const items = menuItems(ref.current);
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next =
        event.key === "ArrowDown" ? (current + 1) % items.length
        : event.key === "ArrowUp" ? (current - 1 + items.length) % items.length
        : event.key === "Home" ? 0
        : event.key === "End" ? items.length - 1
        : -1;
      if (next >= 0) {
        event.preventDefault();
        items[next]?.focus();
      }
    },
    [ref, onClose],
  );
}
