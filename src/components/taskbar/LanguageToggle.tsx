import { useI18n } from "../../i18n/useI18n";
import { LANGS } from "../../i18n/translations";
import styles from "./Taskbar.module.css";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`${styles.language} ${className ?? ""}`} role="group" aria-label={t("taskbar.language")}>
      {LANGS.map((value) => (
        <button
          key={value}
          type="button"
          lang={value}
          aria-pressed={lang === value}
          onClick={() => setLang(value)}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
