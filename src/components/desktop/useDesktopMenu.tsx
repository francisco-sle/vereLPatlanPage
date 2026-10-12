import { useQuickActions } from "../../hooks/useQuickActions";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { setSoundEnabled } from "../../sound/sound";
import { useSoundEnabled } from "../../sound/useSoundEnabled";
import type { MenuEntry } from "../overlays/OverlayContext";
import { useMailMenu } from "../overlays/useMailMenu";
import {
  DesktopIcon,
  LanguageIcon,
  ResetIcon,
  SoundOnIcon,
  StarIcon,
  TrashIcon,
} from "../ui/Icons";

/** Quick actions for right-clicking the desktop or the empty taskbar. */
export function useDesktopMenu(): () => MenuEntry[] {
  const { actions } = useDesktop();
  const { t, lang, setLang } = useI18n();
  const soundEnabled = useSoundEnabled();
  const { resetLayout, resetAll } = useQuickActions();
  const mailMenu = useMailMenu();

  return () => [
    ...mailMenu(),
    "separator",
    { label: t("window.favorites"), icon: <StarIcon />, onSelect: () => actions.open("favorites") },
    { label: t("menu.showDesktop"), icon: <DesktopIcon />, onSelect: actions.minimizeAll },
    { label: t("start.resetLayout"), icon: <ResetIcon />, onSelect: resetLayout },
    "separator",
    {
      label: t("sound.toggle"),
      icon: <SoundOnIcon />,
      checked: soundEnabled,
      onSelect: () => setSoundEnabled(!soundEnabled),
    },
    {
      label: lang === "en" ? "Español" : "English",
      icon: <LanguageIcon />,
      onSelect: () => setLang(lang === "en" ? "es" : "en"),
    },
    "separator",
    { label: t("menu.resetAll"), icon: <TrashIcon />, danger: true, onSelect: resetAll },
  ];
}
