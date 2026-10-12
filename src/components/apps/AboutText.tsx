import { m } from "motion/react";
import { aboutText } from "../../content/about";
import { useI18n } from "../../i18n/useI18n";
import { useMailLink } from "../../hooks/useMailLink";
import { ButtonLink } from "../ui/Button";
import { MailIcon } from "../ui/Icons";
import styles from "./apps.module.css";

export function AboutText() {
  const { l, t } = useI18n();
  const { linkProps } = useMailLink();
  const paragraphs = l(aboutText);
  return (
    <div className={styles.about}>
      {paragraphs.map((paragraph, index) => (
        <m.p
          key={paragraph}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + index * 0.12, duration: 0.35 }}
        >
          {paragraph}
          {index === paragraphs.length - 1 && <span className={styles.cursor} aria-hidden="true" />}
        </m.p>
      ))}
      <m.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 + paragraphs.length * 0.12, duration: 0.35 }}
      >
        <ButtonLink {...linkProps()} aria-label={`${t("contact.cta")} (${t("a11y.newTab")})`}>
          <MailIcon />
          {t("contact.cta")}
        </ButtonLink>
      </m.div>
    </div>
  );
}
