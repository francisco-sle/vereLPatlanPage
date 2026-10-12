import { siteConfig } from "../../config/site";
import { useI18n } from "../../i18n/useI18n";
import styles from "./Browser.module.css";

export function Credits() {
  const { t } = useI18n();
  const { developer, designer } = siteConfig.credits;
  return (
    <p className={styles.credits}>
      © {t("footer.webDev")}:{" "}
      <a href={developer.url} target="_blank" rel="noreferrer">
        {developer.name}
      </a>
      <span aria-hidden="true"> | </span>
      {t("footer.design")}:{" "}
      <a href={designer.url} target="_blank" rel="noreferrer">
        {designer.name} {t("footer.onGithub")}
      </a>
    </p>
  );
}
