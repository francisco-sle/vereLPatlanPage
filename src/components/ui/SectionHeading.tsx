import type { ReactNode } from "react";
import styles from "./ui.module.css";

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className={styles.sectionHeading}>
      {children}
    </h3>
  );
}
