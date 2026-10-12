import { categories, projects } from "../content/portfolio";
import type { I18nValue } from "../i18n/I18nContext";
import type { TranslationKey } from "../i18n/translations";
import { TAB_IDS, type TabId, type WindowId } from "../os/types";
import { windowConfig } from "../os/windowConfig";

export type SearchResult =
  | { kind: "page"; key: string; label: string; tab: TabId }
  | { kind: "window"; key: string; label: string; windowId: WindowId }
  | { kind: "project"; key: string; label: string; detail: string; projectId: string }
  | { kind: "contact"; key: string; label: string; detail: string };

const SEARCHABLE_WINDOWS: WindowId[] = ["profile", "about", "skills", "favorites"];
const MAX_RESULTS = 8;

/** Lowercase and strip accents so "diseno" finds "diseño". */
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const matches = (query: string, ...fields: string[]) => {
  const haystack = normalize(fields.join(" "));
  return normalize(query)
    .split(/\s+/)
    .every((word) => haystack.includes(word));
};

export function search(query: string, { t, l }: Pick<I18nValue, "t" | "l">): SearchResult[] {
  if (!query.trim()) return [];

  const pages: SearchResult[] = TAB_IDS.filter((tab) =>
    matches(query, t(`tab.${tab}` as TranslationKey), tab),
  ).map((tab) => ({ kind: "page", key: `page-${tab}`, label: t(`tab.${tab}`), tab }));

  const windows: SearchResult[] = SEARCHABLE_WINDOWS.filter((id) =>
    matches(query, t(windowConfig[id].titleKey)),
  ).map((id) => ({
    kind: "window",
    key: `window-${id}`,
    label: t(windowConfig[id].titleKey),
    windowId: id,
  }));

  const projectResults: SearchResult[] = projects
    .filter((project) => project.image)
    .filter((project) => {
      const category = categories.find((item) => item.id === project.category);
      return matches(
        query,
        project.title.en,
        project.title.es,
        project.client,
        category ? `${category.name.en} ${category.name.es}` : "",
      );
    })
    .map((project) => {
      const category = categories.find((item) => item.id === project.category);
      return {
        kind: "project",
        key: `project-${project.id}`,
        label: l(project.title),
        detail: category ? l(category.name) : project.client,
        projectId: project.id,
      };
    });

  const contact: SearchResult[] = matches(query, "contact contacto email correo mail", t("contact.label"))
    ? [{ kind: "contact", key: "contact", label: t("menu.emailMe"), detail: t("contact.label") }]
    : [];

  return [...contact, ...pages, ...windows, ...projectResults].slice(0, MAX_RESULTS);
}
