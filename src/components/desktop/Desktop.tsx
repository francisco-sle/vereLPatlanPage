import { AnimatePresence } from "motion/react";
import { useRef } from "react";
import { useElementSize } from "../../hooks/useElementSize";
import { useI18n } from "../../i18n/useI18n";
import { DesktopSizeContext, useDesktop } from "../../os/DesktopContext";
import {
  AboutWindow,
  FavoritesWindow,
  ProfileWindow,
  SkillsWindow,
  ViewerWindow,
} from "../apps/AppWindows";
import { BrowserWindow } from "../browser/BrowserWindow";
import { useOverlays } from "../overlays/OverlayContext";
import { DesktopIcons } from "./DesktopIcons";
import { useDesktopMenu } from "./useDesktopMenu";
import styles from "./Desktop.module.css";
import { WelcomeHint } from "./WelcomeHint";

const windows = {
  browser: BrowserWindow,
  profile: ProfileWindow,
  about: AboutWindow,
  skills: SkillsWindow,
  favorites: FavoritesWindow,
  viewer: ViewerWindow,
};

const initialSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight - 72,
});

export function Desktop() {
  const ref = useRef<HTMLElement>(null);
  const size = useElementSize(ref, initialSize);
  const { state } = useDesktop();
  const { t } = useI18n();
  const { openMenu } = useOverlays();
  const desktopMenu = useDesktopMenu();

  return (
    <DesktopSizeContext.Provider value={size}>
      <main
        ref={ref}
        id="desktop"
        className={styles.desktop}
        aria-label={t("desktop.label")}
        onContextMenu={(event) => {
          // Only the empty desktop; windows and icons have their own menus.
          const target = event.target as Element;
          if (
            target === event.currentTarget ||
            (target.closest("nav") && !target.closest("button"))
          ) {
            openMenu(event, desktopMenu());
          }
        }}
      >
        <DesktopIcons />
        <AnimatePresence>
          {Object.entries(windows).map(([id, Component]) =>
            state.windows[id as keyof typeof windows].open ? <Component key={id} /> : null,
          )}
        </AnimatePresence>
        <WelcomeHint />
      </main>
    </DesktopSizeContext.Provider>
  );
}
