import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n/useI18n";
import { Button } from "../ui/Button";
import type { ConfirmOptions } from "./OverlayContext";
import styles from "./Overlays.module.css";

interface Props {
  options: ConfirmOptions;
  onClose: (confirmed: boolean) => void;
}

/** A small modal window built on <dialog> (focus trap and Escape for free). */
export function ConfirmDialog({ options, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    const onDialogClose = () => onClose(dialog.returnValue === "confirm");
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="confirm-title">
      <form method="dialog">
        <h2 id="confirm-title" className={styles.dialogTitle}>
          {options.title}
        </h2>
        <div className={styles.dialogBody}>
          <p>{options.message}</p>
          <div className={styles.dialogActions}>
            <Button type="submit" value="cancel" className={styles.cancel} autoFocus>
              {t("dialog.cancel")}
            </Button>
            <Button type="submit" value="confirm" className={styles.confirm}>
              {options.confirmLabel}
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
