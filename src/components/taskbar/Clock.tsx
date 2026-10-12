import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/useI18n";
import styles from "./Taskbar.module.css";

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timeout = 0;
    // Tick exactly on each second boundary.
    const tick = () => {
      setNow(new Date());
      timeout = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    timeout = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => window.clearTimeout(timeout);
  }, []);
  return now;
}

export function Clock() {
  const now = useNow();
  const { locale } = useI18n();
  const date = now.toLocaleDateString(locale, { month: "numeric", day: "numeric" });
  const time = now.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  const fullDate = now.toLocaleDateString(locale, { dateStyle: "full" });

  return (
    <time className={styles.clock} dateTime={now.toISOString()} title={fullDate}>
      <span className={styles.clockDate}>{date}, </span>
      {time}
    </time>
  );
}
