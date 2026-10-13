import { LazyMotion, MotionConfig } from "motion/react";
import styles from "./App.module.css";
import { seoRole } from "./config/seo";
import { siteConfig } from "./config/site";
import { Desktop } from "./components/desktop/Desktop";
import { OverlayProvider } from "./components/overlays/OverlayProvider";
import { StartupScreen } from "./components/startup/StartupScreen";
import { Taskbar } from "./components/taskbar/Taskbar";
import { I18nProvider } from "./i18n/I18nProvider";
import { useI18n } from "./i18n/useI18n";
import { DesktopProvider } from "./os/DesktopProvider";
import { UserDataProvider } from "./os/UserDataProvider";
import { useLoggedIn } from "./os/session";

// Animation code is split out of the main bundle so the desktop renders sooner.
const loadMotionFeatures = () => import("./lib/motionFeatures").then((module) => module.default);

function Shell() {
  const { t, l } = useI18n();
  const loggedIn = useLoggedIn();
  return (
    <>
      {/* The desktop loads behind the startup screen, but can't be reached until log-in. */}
      <div className={styles.app} inert={!loggedIn}>
        <h1 className="visually-hidden">
          {siteConfig.ownerName} · {l(seoRole)}
        </h1>
        <a className={styles.skipLink} href="#desktop">
          {t("a11y.skip")}
        </a>
        <Desktop />
        <Taskbar />
      </div>
      <StartupScreen />
    </>
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
