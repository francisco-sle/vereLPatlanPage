import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import profileThumb from "../../assets/images/profile-thumb.webp";
import { siteConfig } from "../../config/site";
import { useI18n } from "../../i18n/useI18n";
import { logIn, useStartupScreen, type StartupScreen as Initial } from "../../os/session";
import { playSound } from "../../sound/sound";
import { PowerIcon, SparkleIcon } from "../ui/Icons";
import styles from "./Startup.module.css";

/**
 * A nod to how Windows XP started, drawn in the desktop's own style: a boot
 * logo with a sliding progress bar, a log-in window ("To begin, click the
 * user name"), then a "welcome" splash before the desktop appears.
 */
type Phase = Initial | "login" | "loading" | "welcome";

/** Phases that move on by themselves, and after how long (ms). */
const TIMELINE: Partial<Record<Phase, { delay: number; next: Phase | "desktop" }>> = {
  boot: { delay: 1800, next: "login" },
  logoff: { delay: 900, next: "login" },
  loading: { delay: 700, next: "welcome" },
  welcome: { delay: 1000, next: "desktop" },
};

/** Same entrance and exit as the desktop's windows. */
const windowMotion = {
  initial: { opacity: 0, scale: 0.94, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: 8, transition: { duration: 0.16, ease: "easeIn" } },
  transition: { type: "spring", stiffness: 420, damping: 32 },
} as const;

/** Where the sparkles sit around the "welcome" text. */
const SPARKLES = [
  { top: "-28%", left: "-8%", size: 34, delay: 0.1 },
  { top: "92%", left: "-6%", size: 22, delay: 0.2 },
  { top: "-18%", left: "96%", size: 26, delay: 0.15 },
  { top: "70%", left: "102%", size: 36, delay: 0.25 },
];

export function StartupScreen() {
  const screen = useStartupScreen();
  return <AnimatePresence>{screen && <Startup key={screen} initial={screen} />}</AnimatePresence>;
}

function Startup({ initial }: { initial: Initial }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(initial);
  const userRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const step = TIMELINE[phase];
    if (!step) return;
    const delay = reduceMotion ? Math.min(step.delay, 500) : step.delay;
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
      exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
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
              <m.div
                className={styles.brand}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}
              >
                <OsLogo className={styles.bootLogo} />
                <Wordmark edition={t("boot.edition")} />
              </m.div>
              <Loader className={styles.bootLoader} />
            </div>
            <p className={styles.bootCopyright}>
              {t("boot.copyright", { year: new Date().getFullYear(), name: siteConfig.ownerName })}
            </p>
            <p className={styles.bootMaker}>{siteConfig.siteName}</p>
          </m.div>
        ) : (
          <m.div
            key="session"
            className={styles.session}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.stage}>
              <AnimatePresence mode="wait">
                {phase === "login" || phase === "loading" ? (
                  <m.section
                    key="login"
                    className={styles.window}
                    aria-labelledby={titleId}
                    {...windowMotion}
                  >
                    <h2 id={titleId} className={styles.titleBar}>
                      <SparkleIcon className={styles.titleIcon} />
                      {t("login.title")}
                    </h2>
                    <div className={styles.body}>
                      <div className={styles.intro}>
                        <div className={styles.brand}>
                          <OsLogo className={styles.introLogo} />
                          <Wordmark />
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
                        {phase === "loading" && <Loader className={styles.userLoader} />}
                      </div>
                    </div>
                  </m.section>
                ) : phase === "logoff" ? (
                  <m.div key="logoff" className={styles.notice} {...windowMotion}>
                    <p>{t("login.loggingOff")}</p>
                    <Loader />
                  </m.div>
                ) : (
                  <m.div
                    key="welcome"
                    className={styles.welcomeWrap}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <p className={styles.welcomeText}>{t("login.welcome")}</p>
                    {SPARKLES.map((sparkle) => (
                      <m.span
                        key={`${sparkle.top}${sparkle.left}`}
                        className={styles.sparkle}
                        style={{ top: sparkle.top, left: sparkle.left, fontSize: sparkle.size }}
                        initial={{ opacity: 0, scale: 0, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 14, delay: sparkle.delay }}
                      >
                        <SparkleIcon />
                      </m.span>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sits exactly where the real taskbar appears after log-in. */}
            <div className={styles.taskbar}>
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

function Wordmark({ edition }: { edition?: string }) {
  return (
    <span className={styles.wordmark}>
      <span className={styles.wordmarkName}>
        Vere<span className={styles.wordmarkBadge}>os</span>
      </span>
      {edition && <span className={styles.wordmarkEdition}>{edition}</span>}
    </span>
  );
}

/** Three pink blocks sliding through a pill-shaped track. */
function Loader({ className }: { className?: string }) {
  return (
    <span className={`${styles.loader} ${className ?? ""}`} aria-hidden="true">
      <span className={styles.loaderBlocks}>
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

/** A wavy four-pane window flag, outlined like the desktop's folders. */
function OsLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      stroke="var(--ink)"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 6Q9 3 18 6V18Q9 15 2 18Z" fill="var(--accent)" />
      <path d="M21 7Q29 10 38 7V19Q29 22 21 19Z" fill="var(--blue)" />
      <path d="M2 21Q9 18 18 21V33Q9 30 2 33Z" fill="var(--white)" />
      <path d="M21 22Q29 25 38 22V34Q29 37 21 34Z" fill="var(--pink)" />
    </svg>
  );
}
