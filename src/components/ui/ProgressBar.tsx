import { m } from "motion/react";
import styles from "./ui.module.css";

interface Props {
  value: number;
  label: string;
  /** Delay (s) before the bar fills, to stagger lists. */
  delay?: number;
}

export function ProgressBar({ value, label, delay = 0 }: Props) {
  return (
    <div
      className={styles.progress}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <m.div
        className={styles.progressFill}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
