import { useI18n } from "../../i18n/useI18n";
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from "../ui/Icons";
import styles from "./Window.module.css";

interface Props {
  maximized: boolean;
  canMaximize: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export function WindowControls({
  maximized,
  canMaximize,
  onMinimize,
  onToggleMaximize,
  onClose,
}: Props) {
  const { t } = useI18n();
  const maximizeLabel = maximized ? t("control.restore") : t("control.maximize");

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.control}
        onClick={onMinimize}
        aria-label={t("control.minimize")}
        title={t("control.minimize")}
      >
        <MinimizeIcon />
      </button>
      {canMaximize && (
        <button
          type="button"
          className={styles.control}
          onClick={onToggleMaximize}
          aria-label={maximizeLabel}
          title={maximizeLabel}
        >
          {maximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>
      )}
      <button
        type="button"
        className={`${styles.control} ${styles.close}`}
        onClick={onClose}
        aria-label={t("control.close")}
        title={t("control.close")}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
