import { createContext, useContext, type MouseEvent, type ReactNode } from "react";

export type MenuEntry =
  | {
      label: string;
      icon?: ReactNode;
      onSelect: () => void;
      /** Shows a check mark (menuitemcheckbox). */
      checked?: boolean;
      danger?: boolean;
    }
  | "separator";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
}

export interface OverlayValue {
  /** Opens a context menu at the pointer (or below the element, from the keyboard). */
  openMenu: (event: MouseEvent, items: MenuEntry[]) => void;
  /** Shows a short message above the taskbar. */
  toast: (message: string) => void;
  /** Asks the visitor to confirm; resolves to their answer. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const OverlayContext = createContext<OverlayValue | null>(null);

export function useOverlays() {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useOverlays must be used inside <OverlayProvider>");
  return context;
}
