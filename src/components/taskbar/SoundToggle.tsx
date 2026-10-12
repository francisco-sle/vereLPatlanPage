import { useI18n } from "../../i18n/useI18n";
import { setSoundEnabled } from "../../sound/sound";
import { useSoundEnabled } from "../../sound/useSoundEnabled";
import { SoundOffIcon, SoundOnIcon } from "../ui/Icons";
import styles from "./Taskbar.module.css";

export function SoundToggle() {
  const { t } = useI18n();
  const enabled = useSoundEnabled();
  return (
    <button
      type="button"
      className={styles.trayButton}
      aria-pressed={enabled}
      aria-label={t("sound.toggle")}
      title={t(enabled ? "sound.on" : "sound.off")}
      onClick={() => setSoundEnabled(!enabled)}
    >
      {enabled ? <SoundOnIcon /> : <SoundOffIcon />}
    </button>
  );
}
