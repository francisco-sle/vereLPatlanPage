import { useState } from "react";
import { categories, projects } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { useUserData } from "../../os/UserDataContext";
import { ProjectSection } from "../portfolio/ProjectSection";
import { playSound } from "../../sound/sound";
import { StarIcon } from "../ui/Icons";
import styles from "../portfolio/Portfolio.module.css";

type Filter = "all" | "favorites";

export function PortfolioPage() {
  const { t } = useI18n();
  const { favorites } = useUserData();
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "favorites" ? projects.filter((project) => favorites.includes(project.id)) : projects;
  const sections = categories
    .map((category) => ({
      category,
      projects: visible.filter((project) => project.category === category.id),
    }))
    .filter((section) => section.projects.length > 0);

  return (
    <div className={styles.portfolio}>
      <div className={styles.filters} role="group" aria-label={t("portfolio.filter")}>
        {(["all", "favorites"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={styles.filter}
            aria-pressed={filter === value}
            onClick={() => {
              playSound("click");
              setFilter(value);
            }}
          >
            {value === "favorites" && <StarIcon />}
            {t(value === "all" ? "portfolio.all" : "portfolio.favorites")}
            {value === "favorites" && <span className={styles.count}>{favorites.length}</span>}
          </button>
        ))}
      </div>

      {sections.length === 0 ? (
        <p className={styles.emptyMessage}>{t("portfolio.noFavorites")}</p>
      ) : (
        sections.map(({ category, projects: items }) => (
          <ProjectSection key={category.id} category={category} projects={items} />
        ))
      )}
    </div>
  );
}
