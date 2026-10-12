import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { usePersistentState } from "../../hooks/usePersistentState";
import { useI18n } from "../../i18n/useI18n";
import { STORAGE_KEYS } from "../../lib/storage";
import { playSound } from "../../sound/sound";
import { Button } from "../ui/Button";
import { SparkleIcon } from "../ui/Icons";
import styles from "./Desktop.module.css";

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

/** A one-time tip for first-time visitors explaining how the desktop works. */
export function WelcomeHint() {
  const { t } = useI18n();
  const [dismissed, setDismissed] = usePersistentState(
    STORAGE_KEYS.hintDismissed,
    false,
    isBoolean,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timeout = window.setTimeout(() => {
      setReady(true);
      playSound("notify", { passive: true });
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {ready && !dismissed && (
        <m.aside
          className={styles.hint}
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <p className={styles.hintTitle}>
            <SparkleIcon aria-hidden="true" />
            {t("hint.title")}
          </p>
          <p>{t("hint.body")}</p>
          <Button
            onClick={() => {
              playSound("click");
              setDismissed(true);
            }}
          >
            {t("hint.dismiss")}
          </Button>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
