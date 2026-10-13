import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import profileThumb from "../../assets/images/profile-thumb.webp";
import { siteConfig } from "../../config/site";
import { useI18n } from "../../i18n/useI18n";
import { logIn, useStartupScreen, type StartupScreen as Initial } from "../../os/session";
import { playSound } from "../../sound/sound";
import { PowerIcon } from "../ui/Icons";
import styles from "./Startup.module.css";

/**
 * A nod to how Windows XP started: a boot logo with a sliding progress bar,
 * then the "To begin, click your user name" welcome screen, then "welcome".
 */
type Phase = Initial | "login" | "loading" | "welcome";

/** Phases that move on by themselves, and after how long (ms). */
const TIMELINE: Partial<Record<Phase, { delay: number; next: Phase | "desktop" }>> = {
  boot: { delay: 3200, next: "login" },
  logoff: { delay: 1600, next: "login" },
  loading: { delay: 1300, next: "welcome" },
  welcome: { delay: 1500, next: "desktop" },
};

export function StartupScreen() {
  const screen = useStartupScreen();
  return <AnimatePresence>{screen && <Startup key={screen} initial={screen} />}</AnimatePresence>;
}

function Startup({ initial }: { initial: Initial }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(initial);
  const userRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const step = TIMELINE[phase];
    if (!step) return;
    const delay = reduceMotion ? Math.min(step.delay, 800) : step.delay;
    const timeout = window.setTimeout(() => {
      if (step.next === "desktop") return logIn();
      if (step.next === "welcome") playSound("startup");
      setPhase(step.next);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [phase, reduceMotion]);

  // Any key skips the boot logo. `keyup`, so the key can't also press the user button.
  useEffect(() => {
    if (phase !== "boot") return;
    const skip = () => setPhase("login");
    window.addEventListener("keyup", skip);
    return () => window.removeEventListener("keyup", skip);
  }, [phase]);

  useEffect(() => {
    if (phase === "login") userRef.current?.focus();
  }, [phase]);

  const onUserClick = () => {
    if (phase !== "login") return;
    playSound("click");
    setPhase("loading");
  };

  const onRestart = () => {
    playSound("click");
    setPhase("boot");
  };

  const status =
    phase === "boot"
      ? t("boot.starting")
      : phase === "logoff"
        ? t("login.loggingOff")
        : phase === "loading"
          ? t("login.loading")
          : phase === "welcome"
            ? t("login.welcome")
            : "";

  return (
    <m.div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-label={siteConfig.siteName}
      // On first load it's there from the start, so the desktop never flashes.
      initial={initial === "boot" ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
    >
      <p className="visually-hidden" role="status">
        {status}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {phase === "boot" ? (
          <m.div
            key="boot"
            className={styles.boot}
            onClick={() => setPhase("login")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.bootCenter}>
              <div className={styles.bootLogo}>
                <OsLogo className={styles.bootFlag} />
                <div className={styles.bootWordmark}>
                  <span className={styles.bootOwner}>{siteConfig.ownerName}</span>
                  <span className={styles.bootName}>
                    Vere<sup>os</sup>
                  </span>
                  <span className={styles.bootEdition}>{t("boot.edition")}</span>
                </div>
              </div>
              <div className={styles.progress} aria-hidden="true">
                <span className={styles.progressBlocks}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
            <p className={styles.bootCopyright}>
              {t("boot.copyright", { year: new Date().getFullYear(), name: siteConfig.ownerName })}
            </p>
            <p className={styles.bootMaker}>{siteConfig.siteName}</p>
          </m.div>
        ) : (
          <m.div
            key="welcome"
            className={styles.welcome}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.barTop} />

            <div className={styles.middle}>
              <AnimatePresence mode="wait" initial={false}>
                {phase === "login" || phase === "loading" ? (
                  <m.div
                    key="users"
                    className={styles.login}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.intro}>
                      <div className={styles.introLogo}>
                        <OsLogo className={styles.introFlag} />
                        <span className={styles.introName}>
                          Vere<sup>os</sup>
                        </span>
                      </div>
                      <p>{t("login.begin")}</p>
                    </div>

                    <div className={styles.divider} aria-hidden="true" />

                    <div className={styles.users}>
                      <button
                        ref={userRef}
                        type="button"
                        className={styles.user}
                        aria-disabled={phase === "loading"}
                        data-selected={phase === "loading" || undefined}
                        onClick={onUserClick}
                      >
                        <img src={profileThumb} alt="" width={64} height={64} />
                        <span className={styles.userText}>
                          <span className={styles.userName}>{siteConfig.ownerName}</span>
                          <span className={styles.userSub}>
                            {phase === "loading" ? t("login.loading") : t("start.subtitle")}
                          </span>
                        </span>
                      </button>
                    </div>
                  </m.div>
                ) : (
                  <m.p
                    key={phase}
                    className={phase === "welcome" ? styles.welcomeText : styles.message}
                    initial={{ opacity: 0, x: phase === "welcome" ? -24 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {phase === "welcome" ? t("login.welcome") : t("login.loggingOff")}
                  </m.p>
                )}
              </AnimatePresence>
            </div>

            <div className={styles.barBottom}>
              {phase === "login" && (
                <>
                  <button type="button" className={styles.restart} onClick={onRestart}>
                    <span className={styles.restartIcon}>
                      <PowerIcon />
                    </span>
                    {t("login.restart")}
                  </button>
                  <p className={styles.tip}>{t("login.tip")}</p>
                </>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

/** A wavy four-pane window flag in the site's pastel colors. */
function OsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M2 6Q9 3 18 6V18Q9 15 2 18Z" fill="var(--accent)" />
      <path d="M21 7Q29 10 38 7V19Q29 22 21 19Z" fill="var(--blue)" />
      <path d="M2 21Q9 18 18 21V33Q9 30 2 33Z" fill="var(--white)" />
      <path d="M21 22Q29 25 38 22V34Q29 37 21 34Z" fill="var(--pink)" />
    </svg>
  );
}
