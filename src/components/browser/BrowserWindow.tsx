import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { useUserData } from "../../os/UserDataContext";
import { CurriculumPage } from "../pages/CurriculumPage";
import { HomePage } from "../pages/HomePage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { StarIcon } from "../ui/Icons";
import { SearchBox } from "../search/SearchBox";
import { Window } from "../window/Window";
import styles from "./Browser.module.css";
import { BrowserTabs } from "./BrowserTabs";
import { panelId, tabId } from "./ids";
import { Credits } from "./Credits";

const pages = {
  home: HomePage,
  curriculum: CurriculumPage,
  portfolio: PortfolioPage,
};

/** The main pink "browser" window with Home / Curriculum / Portfolio tabs. */
export function BrowserWindow() {
  const { state, actions } = useDesktop();
  const { favorites } = useUserData();
  const { t } = useI18n();
  const Page = pages[state.activeTab];

  return (
    <Window
      id="browser"
      title={t(`tab.${state.activeTab}`)}
      tabs={<BrowserTabs />}
      toolbar={
        <>
          <button
            type="button"
            className={styles.favoritesButton}
            onClick={() => actions.open("favorites")}
            aria-label={`${t("browser.favorites")} (${favorites.length})`}
            title={t("browser.favorites")}
          >
            <StarIcon />
            <AnimatePresence>
              {favorites.length > 0 && (
                <m.span
                  key={favorites.length}
                  className={styles.badge}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 22 }}
                  aria-hidden="true"
                >
                  {favorites.length}
                </m.span>
              )}
            </AnimatePresence>
          </button>
          <SearchBox variant="address" placement="below" />
        </>
      }
      footer={<Credits />}
      bodyClassName={styles.body}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={state.activeTab}
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(state.activeTab)}
          className={styles.page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Page />
        </m.div>
      </AnimatePresence>
    </Window>
  );
}
