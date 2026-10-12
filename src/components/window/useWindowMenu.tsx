import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import type { WindowId } from "../../os/types";
import type { MenuEntry } from "../overlays/OverlayContext";
import { CloseIcon, MaximizeIcon, MinimizeIcon, ResetIcon, RestoreIcon } from "../ui/Icons";

/** The classic window menu: used by title bars and taskbar buttons. */
export function useWindowMenu(): (id: WindowId) => MenuEntry[] {
  const { state, actions, isCompact } = useDesktop();
  const { t } = useI18n();

  return (id) => {
    const win = state.windows[id];
    const entries: MenuEntry[] = [];
    if (win.minimized) {
      entries.push({
        label: t("control.restore"),
        icon: <RestoreIcon />,
        onSelect: () => actions.restore(id),
      });
    } else {
      entries.push({
        label: t("control.minimize"),
        icon: <MinimizeIcon />,
        onSelect: () => actions.minimize(id),
      });
    }
    if (!isCompact) {
      entries.push(
        {
          label: t(win.maximized ? "control.restore" : "control.maximize"),
          icon: win.maximized ? <RestoreIcon /> : <MaximizeIcon />,
          onSelect: () => actions.toggleMaximize(id),
        },
        {
          label: t("menu.resetWindow"),
          icon: <ResetIcon />,
          onSelect: () => actions.resetWindow(id),
        },
      );
    }
    entries.push("separator", {
      label: t("control.close"),
      icon: <CloseIcon />,
      danger: true,
      onSelect: () => actions.close(id),
    });
    return entries;
  };
}
