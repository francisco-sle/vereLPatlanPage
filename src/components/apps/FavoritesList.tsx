import { AnimatePresence, m } from "motion/react";
import { projectsById } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { formatDate } from "../../lib/format";
import { useDesktop } from "../../os/DesktopContext";
import { useUserData } from "../../os/UserDataContext";
import { useOpenProject } from "../../os/useOpenProject";
import { Button } from "../ui/Button";
import { StarIcon, StarOutlineIcon } from "../ui/Icons";
import styles from "./apps.module.css";

export function FavoritesList() {
  const { favorites, toggleFavorite } = useUserData();
  const { actions } = useDesktop();
  const openProject = useOpenProject();
  const { t, l, locale } = useI18n();

  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <StarOutlineIcon className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>{t("favorites.empty")}</p>
        <p>{t("favorites.hint")}</p>
        <Button onClick={() => actions.setTab("portfolio")}>{t("favorites.browse")}</Button>
      </div>
    );
  }

  return (
    <ul className={styles.favorites}>
      <AnimatePresence initial={false}>
        {favorites.map((id) => {
          const project = projectsById.get(id);
          if (!project?.image) return null;
          const name = l(project.title);
          return (
            <m.li
              key={id}
              layout
              className={styles.favorite}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className={styles.favoriteOpen}
                onClick={() => openProject(id)}
                aria-label={t("portfolio.open", { name })}
              >
                <img src={project.image.thumb} alt="" loading="lazy" />
                <span>
                  <strong>{name}</strong>
                  <small>{formatDate(project.date, locale)}</small>
                </span>
              </button>
              <button
                type="button"
                className={styles.favoriteRemove}
                onClick={() => toggleFavorite(id)}
                aria-label={t("portfolio.removeFavorite", { name })}
                title={t("portfolio.removeFavorite", { name })}
              >
                <StarIcon />
              </button>
            </m.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
