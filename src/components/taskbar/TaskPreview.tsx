import { m } from "motion/react";
import type { WindowId } from "../../os/types";
import { CloseIcon } from "../ui/Icons";
import { windowIcons } from "../window/windowIcons";
import styles from "./Taskbar.module.css";
import { WindowSnapshot } from "./WindowSnapshot";

const WIDTH = 248;
const EDGE = 8;

interface Props {
  id: WindowId;
  title: string;
  closeLabel: string;
  /** The taskbar button the preview belongs to. */
  anchor: DOMRect;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onActivate: () => void;
  onClose: () => void;
}

/**
 * Hover thumbnail above a taskbar button. Mouse-only extra: everything here
 * is also reachable from the taskbar button itself.
 */
export function TaskPreview({
  id,
  title,
  closeLabel,
  anchor,
  onActivate,
  onClose,
  ...hover
}: Props) {
  const Icon = windowIcons[id];
  const left = Math.min(
    Math.max(anchor.left + anchor.width / 2 - WIDTH / 2, EDGE),
    window.innerWidth - WIDTH - EDGE,
  );

  return (
    <m.div
      className={styles.preview}
      style={{ left, width: WIDTH }}
      aria-hidden="true"
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      {...hover}
    >
      <div className={styles.previewHeader}>
        <Icon className={styles.previewIcon} />
        <span className={styles.previewTitle}>{title}</span>
        <button
          type="button"
          tabIndex={-1}
          className={styles.previewClose}
          onClick={onClose}
          title={closeLabel}
        >
          <CloseIcon />
        </button>
      </div>
      <button type="button" tabIndex={-1} className={styles.previewBody} onClick={onActivate}>
        <WindowSnapshot key={id} id={id} maxWidth={WIDTH - 20} maxHeight={150} />
      </button>
    </m.div>
  );
}
