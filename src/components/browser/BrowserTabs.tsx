import { useRef, type KeyboardEvent } from "react";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { TAB_IDS } from "../../os/types";
import styles from "./Browser.module.css";
import { panelId, tabId } from "./ids";

export function BrowserTabs() {
  const { state, actions } = useDesktop();
  const { t } = useI18n();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs, following the WAI-ARIA tabs pattern.
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = TAB_IDS.length - 1;
    const target =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    actions.setTab(TAB_IDS[target]);
    refs.current[target]?.focus();
  };

  return (
    <div className={styles.tabList} role="tablist" aria-label={t("browser.tabs")}>
      {TAB_IDS.map((tab, index) => {
        const selected = state.activeTab === tab;
        return (
          <button
            key={tab}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={tabId(tab)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
            onClick={() => actions.setTab(tab)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {t(`tab.${tab}`)}
          </button>
        );
      })}
    </div>
  );
}
