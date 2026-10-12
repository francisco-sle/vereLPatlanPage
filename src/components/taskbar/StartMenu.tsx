import { m } from "motion/react";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { siteConfig } from "../../config/site";
import { menuItems, useMenuNavigation } from "../../hooks/useMenuNavigation";
import { useMailLink } from "../../hooks/useMailLink";
import { useQuickActions } from "../../hooks/useQuickActions";
import profileThumb from "../../assets/images/profile-thumb.webp";
import { projectsById } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { LANGS } from "../../i18n/translations";
import { useDesktop } from "../../os/DesktopContext";
import { useUserData } from "../../os/UserDataContext";
import { useOpenProject } from "../../os/useOpenProject";
import { TAB_IDS, type WindowId } from "../../os/types";
import { windowConfig } from "../../os/windowConfig";
import { setSoundEnabled } from "../../sound/sound";
import { useSoundEnabled } from "../../sound/useSoundEnabled";
import {
  FolderIcon,
  LanguageIcon,
  MailIcon,
  ResetIcon,
  SoundOffIcon,
  SoundOnIcon,
  TrashIcon,
} from "../ui/Icons";
import { windowIcons } from "../window/windowIcons";
import { SocialLinks } from "./SocialLinks";
import styles from "./Taskbar.module.css";

const APP_WINDOWS: WindowId[] = ["profile", "about", "skills", "favorites"];
const LANGUAGE_NAMES = { en: "English", es: "Español" } as const;

interface Props {
  onClose: (returnFocus: boolean) => void;
  anchor: RefObject<HTMLElement | null>;
}

export function StartMenu({ onClose, anchor }: Props) {
  const { actions } = useDesktop();
  const { recent } = useUserData();
  const openProject = useOpenProject();
  const { t, l, lang, setLang } = useI18n();
  const soundEnabled = useSoundEnabled();
  const { resetLayout, resetAll } = useQuickActions();
  const mailLink = useMailLink().linkProps();
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    menuItems(ref.current)[0]?.focus();
    // Clicking anywhere else closes the menu.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !anchor.current?.contains(target)) {
        onCloseRef.current(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [anchor]);

  const run = (action: () => void) => () => {
    action();
    onClose(false);
  };

  const onKeyDown = useMenuNavigation(ref, onClose);

  const item = (key: string, icon: ReactNode, label: string, onSelect: () => void) => (
    <button
      key={key}
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={styles.menuItem}
      onClick={run(onSelect)}
    >
      <span className={styles.menuIcon}>{icon}</span>
      <span className={styles.menuLabel}>{label}</span>
    </button>
  );

  return (
    <m.div
      ref={ref}
      className={styles.startMenu}
      role="menu"
      aria-label={t("taskbar.start")}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.14 } }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
    >
      <div className={styles.menuHeader}>
        <img src={profileThumb} alt="" width={48} height={48} />
        <div>
          <p className={styles.menuName}>{siteConfig.ownerName}</p>
          <p className={styles.menuSubtitle}>{t("start.subtitle")}</p>
        </div>
      </div>

      <div className={styles.menuColumns}>
        <div role="group" aria-label={t("start.apps")}>
          <p className={styles.menuHeading} aria-hidden="true">
            {t("start.apps")}
          </p>
          {TAB_IDS.map((tab) =>
            item(tab, <FolderIcon />, t(`tab.${tab}`), () => actions.setTab(tab)),
          )}
          {APP_WINDOWS.map((id) => {
            const Icon = windowIcons[id];
            return item(id, <Icon />, t(windowConfig[id].titleKey), () => actions.open(id));
          })}
          <a
            role="menuitem"
            tabIndex={-1}
            className={styles.menuItem}
            {...mailLink}
            onClick={run(mailLink.onClick)}
            aria-label={`${t("contact.label")} (${t("a11y.newTab")})`}
          >
            <span className={styles.menuIcon}>
              <MailIcon />
            </span>
            <span className={styles.menuLabel}>{t("contact.label")}</span>
          </a>
        </div>

        <div>
          {recent.length > 0 && (
            <div role="group" aria-label={t("start.recent")}>
              <p className={styles.menuHeading} aria-hidden="true">
                {t("start.recent")}
              </p>
              {recent.map((id) => {
                const project = projectsById.get(id);
                if (!project?.image) return null;
                return item(
                  id,
                  <img src={project.image.thumb} alt="" className={styles.menuThumb} />,
                  l(project.title),
                  () => openProject(id),
                );
              })}
            </div>
          )}

          <div role="group" aria-label={t("start.settings")}>
            <p className={styles.menuHeading} aria-hidden="true">
              {t("start.settings")}
            </p>
            {LANGS.map((value) => (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={lang === value}
                tabIndex={-1}
                lang={value}
                className={styles.menuItem}
                onClick={() => setLang(value)}
              >
                <span className={styles.menuIcon}>
                  <LanguageIcon />
                </span>
                <span className={styles.menuLabel}>{LANGUAGE_NAMES[value]}</span>
                {lang === value && (
                  <span className={styles.menuCheck} aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={soundEnabled}
              tabIndex={-1}
              className={styles.menuItem}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <span className={styles.menuIcon}>
                {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
              </span>
              <span className={styles.menuLabel}>{t("sound.toggle")}</span>
              {soundEnabled && (
                <span className={styles.menuCheck} aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
            {item("reset", <ResetIcon />, t("start.resetLayout"), resetLayout)}
            {item("reset-all", <TrashIcon />, t("menu.resetAll"), resetAll)}
          </div>
        </div>
      </div>

      <div className={styles.menuFooter}>
        <span>{t("start.social")}</span>
        <SocialLinks className={styles.menuSocials} linkClassName={styles.menuSocial} asMenuItems />
      </div>
    </m.div>
  );
}
