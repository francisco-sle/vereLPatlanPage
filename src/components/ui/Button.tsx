import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./ui.module.css";

/** Pill-shaped button used across windows. */
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`}
      {...props}
    />
  );
}

/** A link that looks like a Button (for actions that navigate). */
export function ButtonLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={`${styles.button} ${className ?? ""}`} {...props} />;
}
