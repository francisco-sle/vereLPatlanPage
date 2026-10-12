import { profilePhoto } from "../../content/about";
import { useI18n } from "../../i18n/useI18n";
import styles from "./apps.module.css";

export function ProfilePhoto() {
  const { t } = useI18n();
  return (
    <img
      className={styles.profilePhoto}
      src={profilePhoto.src}
      width={profilePhoto.width}
      height={profilePhoto.height}
      alt={t("home.profileAlt")}
      draggable={false}
    />
  );
}
