import { m } from "motion/react";
import { hero } from "../../content/about";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { AboutText } from "../apps/AboutText";
import { ProfilePhoto } from "../apps/ProfilePhoto";
import { Panel } from "../ui/Panel";
import styles from "./pages.module.css";

export function HomePage() {
  const { t } = useI18n();
  const { isCompact } = useDesktop();

  return (
    <div className={styles.home}>
      <m.div
        className={styles.heroWrap}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.05 }}
      >
        <img
          className={styles.hero}
          src={hero.src}
          width={hero.width}
          height={hero.height}
          alt={t("home.heroAlt")}
          draggable={false}
          fetchPriority="high"
        />
      </m.div>

      {/* On small screens the Profile & About windows are shown inline. */}
      {isCompact && (
        <div className={styles.inlinePanels}>
          <Panel title={t("window.about")}>
            <AboutText />
          </Panel>
          <Panel title={t("window.profile")} className={styles.profilePanel}>
            <ProfilePhoto />
          </Panel>
        </div>
      )}
    </div>
  );
}
