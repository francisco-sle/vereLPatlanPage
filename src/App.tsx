import { LazyMotion, MotionConfig } from "motion/react";
import styles from "./App.module.css";
import { Desktop } from "./components/desktop/Desktop";
import { OverlayProvider } from "./components/overlays/OverlayProvider";
import { Taskbar } from "./components/taskbar/Taskbar";
import { I18nProvider } from "./i18n/I18nProvider";
import { useI18n } from "./i18n/useI18n";
import { DesktopProvider } from "./os/DesktopProvider";
import { UserDataProvider } from "./os/UserDataProvider";

// Animation code is split out of the main bundle so the desktop renders sooner.
const loadMotionFeatures = () => import("./lib/motionFeatures").then((module) => module.default);

function Shell() {
  const { t } = useI18n();
  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#desktop">
        {t("a11y.skip")}
      </a>
      <Desktop />
      <Taskbar />
    </div>
  );
}

export default function App() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <I18nProvider>
          <UserDataProvider>
            <DesktopProvider>
              <OverlayProvider>
                <Shell />
              </OverlayProvider>
            </DesktopProvider>
          </UserDataProvider>
        </I18nProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
