import folderIcon from "../../assets/icons/folder.svg";
import folderOpenIcon from "../../assets/icons/folder-open.svg";
import mailIcon from "../../assets/icons/mail.svg";
import { useMailLink } from "../../hooks/useMailLink";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { TAB_IDS } from "../../os/types";
import { useOverlays } from "../overlays/OverlayContext";
import { useMailMenu } from "../overlays/useMailMenu";
import { CloseIcon, FolderIcon } from "../ui/Icons";
import styles from "./Desktop.module.css";

export function DesktopIcons() {
  const { state, actions } = useDesktop();
  const { t } = useI18n();
  const { openMenu } = useOverlays();
  const { linkProps } = useMailLink();
  const mailMenu = useMailMenu();
  const browser = state.windows.browser;

  return (
    <nav className={styles.icons} aria-label={t("desktop.icons")}>
      <ul>
        {TAB_IDS.map((tab) => {
          const name = t(`tab.${tab}`);
          const isOpen = browser.open && !browser.minimized && state.activeTab === tab;
          // Folders toggle: the open one closes its window, the others open theirs.
          const toggle = () => (isOpen ? actions.close("browser") : actions.setTab(tab));
          return (
            <li key={tab}>
              <button
                type="button"
                className={`${styles.folder} ${isOpen ? styles.folderOpen : ""}`}
                onClick={toggle}
                onContextMenu={(event) =>
                  openMenu(event, [
                    isOpen
                      ? { label: t("control.close"), icon: <CloseIcon />, onSelect: toggle }
                      : { label: t("menu.open"), icon: <FolderIcon />, onSelect: toggle },
                  ])
                }
                aria-label={t(isOpen ? "desktop.closeFolder" : "desktop.openFolder", { name })}
                title={t(isOpen ? "desktop.closeFolder" : "desktop.openFolder", { name })}
                aria-current={isOpen ? "page" : undefined}
              >
                <span className={styles.folderArt}>
                  <img src={folderIcon} alt="" className={styles.closedArt} draggable={false} />
                  <img src={folderOpenIcon} alt="" className={styles.openArt} draggable={false} />
                </span>
                <span className={styles.folderLabel}>{name}</span>
              </button>
            </li>
          );
        })}
        <li>
          {/* A real link: opens a new message in webmail. */}
          <a
            className={styles.folder}
            {...linkProps()}
            onContextMenu={(event) => openMenu(event, mailMenu())}
            aria-label={`${t("menu.emailMe")} (${t("a11y.newTab")})`}
          >
            <span className={`${styles.folderArt} ${styles.mailArt}`}>
              <img src={mailIcon} alt="" draggable={false} />
            </span>
            <span className={styles.folderLabel}>{t("contact.label")}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
