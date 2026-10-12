import { m } from "motion/react";
import type { MouseEvent } from "react";
import type { Category, Project } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { formatDate } from "../../lib/format";
import { useUserData } from "../../os/UserDataContext";
import { useOpenProject } from "../../os/useOpenProject";
import { useOverlays } from "../overlays/OverlayContext";
import { ExternalIcon, ImageIcon, SparkleIcon, StarIcon, StarOutlineIcon } from "../ui/Icons";
import styles from "./Portfolio.module.css";

interface Props {
  project: Project;
  category: Category;
  index: number;
}

export function ProjectCard({ project, category, index }: Props) {
  const { t, l, locale } = useI18n();
  const { isFavorite, toggleFavorite } = useUserData();
  const openProject = useOpenProject();
  const { openMenu } = useOverlays();
  const name = l(project.title);
  const favorite = isFavorite(project.id);
  const frameClass = `${styles.frame} ${styles[category.aspect]}`;

  const caption = (
    <span className={styles.caption}>
      <span className={styles.name}>{name}</span>
      <time dateTime={project.date}>{formatDate(project.date, locale)}</time>
    </span>
  );

  const image = project.image;
  const onContextMenu = (event: MouseEvent) => {
    if (!image) return;
    openMenu(event, [
      { label: t("menu.open"), icon: <ImageIcon />, onSelect: () => openProject(project.id) },
      {
        label: t(favorite ? "portfolio.removeFavorite" : "portfolio.addFavorite", { name }),
        icon: favorite ? <StarIcon /> : <StarOutlineIcon />,
        onSelect: () => toggleFavorite(project.id),
      },
      {
        label: t("viewer.openOriginal"),
        icon: <ExternalIcon />,
        onSelect: () => window.open(image.full, "_blank", "noopener"),
      },
    ]);
  };

  return (
    <m.li
      onContextMenu={onContextMenu}
      layout="position"
      className={styles.card}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    >
      {project.image ? (
        <>
          <button
            type="button"
            className={styles.open}
            onClick={() => openProject(project.id)}
            aria-label={t("portfolio.open", { name })}
          >
            <span className={frameClass}>
              <img
                src={project.image.thumb}
                alt={`${name} · ${l(category.name)}`}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ objectFit: category.fit }}
              />
            </span>
            {caption}
          </button>
          <button
            type="button"
            className={`${styles.star} ${favorite ? styles.starOn : ""}`}
            onClick={() => toggleFavorite(project.id)}
            aria-pressed={favorite}
            aria-label={t(favorite ? "portfolio.removeFavorite" : "portfolio.addFavorite", {
              name,
            })}
            title={t(favorite ? "portfolio.removeFavorite" : "portfolio.addFavorite", { name })}
          >
            {favorite ? <StarIcon /> : <StarOutlineIcon />}
          </button>
        </>
      ) : (
        <div
          className={styles.placeholderCard}
          aria-label={`${name} — ${t("portfolio.comingSoon")}`}
        >
          <span className={`${frameClass} ${styles.placeholder}`}>
            <SparkleIcon className={styles.placeholderIcon} />
            <span>{t("portfolio.comingSoon")}</span>
          </span>
          {caption}
        </div>
      )}
    </m.li>
  );
}
