import { useId, type ReactNode } from "react";
import styles from "./Panel.module.css";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}

/** A static, window-styled box, used to show window content inline on small screens. */
export function Panel({ title, children, className }: Props) {
  const titleId = useId();
  return (
    <section className={`${styles.panel} ${className ?? ""}`} aria-labelledby={titleId}>
      <h3 id={titleId} className={styles.title}>
        {title}
      </h3>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
