import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { siteConfig } from "../config/site";
import { usePersistentState } from "../hooks/usePersistentState";
import { STORAGE_KEYS } from "../lib/storage";
import { playSound } from "../sound/sound";
import { I18nContext, type I18nValue } from "./I18nContext";
import {
  LANGS,
  LOCALES,
  translations,
  type Lang,
  type Localized,
} from "./translations";

const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

const detectLanguage = (): Lang =>
  navigator.language?.toLowerCase().startsWith("es") ? "es" : siteConfig.defaultLanguage;

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setStoredLang] = usePersistentState<Lang>(
    STORAGE_KEYS.language,
    detectLanguage,
    isLang,
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      playSound("click");
      setStoredLang(next);
    },
    [setStoredLang],
  );

  const t = useCallback<I18nValue["t"]>(
    (key, vars) => {
      const template = translations[lang][key];
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      );
    },
    [lang],
  );

  const l = useCallback(<T,>(value: Localized<T>) => value[lang], [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, locale: LOCALES[lang], setLang, t, l }),
    [lang, setLang, t, l],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

