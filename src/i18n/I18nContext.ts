import { createContext } from "react";
import type { Lang, Localized, TranslationKey } from "./translations";

export interface I18nValue {
  lang: Lang;
  locale: string;
  setLang: (lang: Lang) => void;
  /** Translates a UI string, replacing `{placeholders}` with `vars`. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Picks the current language from a localized content value. */
  l: <T>(value: Localized<T>) => T;
}

export const I18nContext = createContext<I18nValue | null>(null);
