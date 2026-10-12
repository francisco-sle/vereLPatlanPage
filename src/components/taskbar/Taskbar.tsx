import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { projectsById } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { WINDOW_IDS, type WindowId } from "../../os/types";
import { windowConfig } from "../../os/windowConfig";
import { useDesktopMenu } from "../desktop/useDesktopMenu";
import { useOverlays } from "../overlays/OverlayContext";
import { SearchBox } from "../search/SearchBox";
import { WindowsIcon } from "../ui/Icons";
import { useWindowMenu } from "../window/useWindowMenu";
import { windowIcons } from "../window/windowIcons";
import { Clock } from "./Clock";
import { playSound } from "../../sound/sound";
import { LanguageToggle } from "./LanguageToggle";
import { SocialLinks } from "./SocialLinks";
import { SoundToggle } from "./SoundToggle";
import { StartMenu } from "./StartMenu";
import { TaskPreview } from "./TaskPreview";
import styles from "./Taskbar.module.css";

export function Taskbar() {
  const { state, focusedId, actions } = useDesktop();
  const { t } = useI18n();
  const [startOpen, setStartOpen] = useState(false);
  const startButton = useRef<HTMLButtonElement>(null);
  const { openMenu } = useOverlays();
  const windowMenu = useWindowMenu();
  const desktopMenu = useDesktopMenu();

  // Hover previews: a short delay to show, a grace period to reach the preview.
  const [preview, setPreview] = useState<{ id: WindowId; anchor: DOMRect } | null>(null);
  const timers = useRef({ show: 0, hide: 0 });
  const cancelTimers = () => {
    window.clearTimeout(timers.current.show);
    window.clearTimeout(timers.current.hide);
  };
  const scheduleHide = () => {
    cancelTimers();
    timers.current.hide = window.setTimeout(() => setPreview(null), 180);
  };
  const onTaskEnter = (id: WindowId) => (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    cancelTimers();
    const anchor = event.currentTarget.getBoundingClientRect();
    if (preview) setPreview({ id, anchor });
    else timers.current.show = window.setTimeout(() => setPreview({ id, anchor }), 450);
  };
  useEffect(() => () => cancelTimers(), []);

  const windowTitle = (id: WindowId) => {
    if (id === "browser") return t(`tab.${state.activeTab}`);
    if (id === "viewer" && state.viewerProjectId) {
      return projectsById.get(state.viewerProjectId)?.fileName ?? t(windowConfig.viewer.titleKey);
    }
    return t(windowConfig[id].titleKey);
  };

  const openWindows = WINDOW_IDS.filter((id) => state.windows[id].open);

  return (
    <footer
      className={styles.taskbar}
      onContextMenu={(event) => {
        // Empty taskbar space gets the desktop's quick actions.
        if (!(event.target as Element).closest("button, a, input")) openMenu(event, desktopMenu());
      }}
    >
      <div className={styles.start}>
        <button
          ref={startButton}
          type="button"
          className={styles.startButton}
          aria-label={t("taskbar.start")}
          title={t("taskbar.start")}
          aria-haspopup="menu"
          aria-expanded={startOpen}
          onClick={() => {
            playSound(startOpen ? "click" : "menu");
            setStartOpen((open) => !open);
          }}
        >
          <WindowsIcon />
        </button>
        <AnimatePresence>
          {startOpen && (
            <StartMenu
              onClose={(returnFocus) => {
                setStartOpen(false);
                if (returnFocus) startButton.current?.focus();
              }}
              anchor={startButton}
            />
          )}
        </AnimatePresence>
      </div>

      <div className={styles.workArea}>
        <SearchBox variant="taskbar" placement="above" className={styles.search} />
        <ul className={styles.tasks} aria-label={t("taskbar.openWindows")}>
          <AnimatePresence initial={false}>
            {openWindows.map((id) => {
              const Icon = windowIcons[id];
              const win = state.windows[id];
              const title = windowTitle(id);
              return (
                <m.li
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={{ opacity: 0, scale: 0.6, width: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    className={styles.task}
                    data-active={focusedId === id}
                    data-minimized={win.minimized}
                    aria-pressed={focusedId === id}
                    aria-label={win.minimized ? `${title} (${t("taskbar.minimized")})` : title}
                    onClick={() => {
                      setPreview(null);
                      actions.taskbarToggle(id);
                    }}
                    onContextMenu={(event) => {
                      setPreview(null);
                      openMenu(event, windowMenu(id));
                    }}
                    onPointerEnter={onTaskEnter(id)}
                    onPointerLeave={scheduleHide}
                  >
                    <Icon className={styles.taskIcon} />
                    <span className={styles.taskLabel}>{title}</span>
                  </button>
                </m.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      <AnimatePresence>
        {preview && state.windows[preview.id].open && (
          <TaskPreview
            key="preview"
            id={preview.id}
            title={windowTitle(preview.id)}
            closeLabel={t("control.close")}
            anchor={preview.anchor}
            onPointerEnter={cancelTimers}
            onPointerLeave={scheduleHide}
            onActivate={() => {
              setPreview(null);
              actions.restore(preview.id);
            }}
            onClose={() => {
              setPreview(null);
              actions.close(preview.id);
            }}
          />
        )}
      </AnimatePresence>

      <nav className={styles.social} aria-label={t("taskbar.social")}>
        <SocialLinks className={styles.socialList} linkClassName={styles.socialLink} />
      </nav>

      <div className={styles.tray}>
        <SoundToggle />
        <LanguageToggle className={styles.trayLanguage} />
        <span className={styles.divider} aria-hidden="true" />
        <Clock />
      </div>
    </footer>
  );
}
