import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "../../i18n/useI18n";
import { search, type SearchResult } from "../../lib/search";
import { useDesktop } from "../../os/DesktopContext";
import { useOpenProject } from "../../os/useOpenProject";
import { useMailLink } from "../../hooks/useMailLink";
import { CloseIcon, DocumentIcon, GlobeIcon, ImageIcon, MailIcon, SearchIcon } from "../ui/Icons";
import styles from "./SearchBox.module.css";

const resultIcon = {
  page: <GlobeIcon />,
  window: <DocumentIcon />,
  project: <ImageIcon />,
  contact: <MailIcon />,
};

interface Props {
  /** `address` sits in the browser window; `taskbar` sits on the dark taskbar. */
  variant: "address" | "taskbar";
  /** Where the results popup opens. */
  placement: "below" | "above";
  className?: string;
}

/** Search for pages, windows and projects, with a results popup (ARIA combobox). */
export function SearchBox({ variant, placement, className }: Props) {
  const { t, l } = useI18n();
  const { actions } = useDesktop();
  const openProject = useOpenProject();
  const { openMail } = useMailLink();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => search(query, { t, l }), [query, t, l]);
  const showPopup = open && query.trim().length > 0;
  const optionId = (index: number) => `${listId}-option-${index}`;
  const offset = placement === "below" ? -6 : 6;

  const choose = (result: SearchResult) => {
    if (result.kind === "page") actions.setTab(result.tab);
    if (result.kind === "window") actions.open(result.windowId);
    if (result.kind === "contact") openMail();
    if (result.kind === "project") {
      actions.setTab("portfolio");
      openProject(result.projectId);
    }
    setQuery("");
    setOpen(false);
    // Let keyboard shortcuts (e.g. arrows in the viewer) reach the opened window.
    inputRef.current?.blur();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (!results.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + step + results.length) % results.length);
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      choose(results[activeIndex]);
    } else if (event.key === "Escape") {
      setQuery("");
      setOpen(false);
    }
  };

  return (
    <div className={`${styles.search} ${styles[variant]} ${className ?? ""}`} data-no-drag>
      <SearchIcon className={styles.icon} />
      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        value={query}
        placeholder={t("browser.searchPlaceholder")}
        aria-label={t("browser.searchLabel")}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showPopup}
        aria-controls={listId}
        aria-activedescendant={showPopup && results.length ? optionId(activeIndex) : undefined}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      <AnimatePresence>
        {query && (
          <m.button
            type="button"
            className={styles.clear}
            aria-label={t("search.clear")}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
          >
            <CloseIcon />
          </m.button>
        )}
      </AnimatePresence>

      <LayoutGroup id={listId}>
        <AnimatePresence>
          {showPopup && (
            <m.ul
              id={listId}
              role="listbox"
              layout
              className={`${styles.results} ${styles[placement]}`}
              style={{ borderRadius: 14 }}
              initial={{ opacity: 0, y: offset, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: offset, scale: 0.97, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 520, damping: 36 }}
            >
              {results.length === 0 && (
                <m.li
                  layout="position"
                  className={styles.noResults}
                  role="presentation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {t("search.noResults", { query })}
                </m.li>
              )}
              {results.map((result, index) => (
                <m.li
                  key={result.key}
                  layout="position"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.025 }}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={styles.result}
                  // Keep focus in the input so the click isn't lost to blur.
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => choose(result)}
                  onPointerEnter={() => setActiveIndex(index)}
                >
                  {/* One highlight that glides between results. */}
                  {index === activeIndex && (
                    <m.span
                      layoutId="highlight"
                      className={styles.highlight}
                      transition={{ type: "spring", stiffness: 600, damping: 40 }}
                    />
                  )}
                  <span className={styles.resultIcon}>{resultIcon[result.kind]}</span>
                  <span className={styles.resultLabel}>{result.label}</span>
                  <span className={styles.resultDetail}>
                    {result.kind === "project" || result.kind === "contact"
                      ? result.detail
                      : t(result.kind === "page" ? "search.pages" : "search.apps")}
                  </span>
                </m.li>
              ))}
            </m.ul>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
