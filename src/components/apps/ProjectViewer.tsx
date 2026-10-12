import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { categories, projectsById, viewableProjects } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { formatDate } from "../../lib/format";
import { useDesktop } from "../../os/DesktopContext";
import { useUserData } from "../../os/UserDataContext";
import { useOpenProject } from "../../os/useOpenProject";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalIcon,
  StarIcon,
  StarOutlineIcon,
} from "../ui/Icons";
import styles from "./apps.module.css";

/** Full-size image viewer with previous/next navigation. */
export function ProjectViewer() {
  const { state, focusedId } = useDesktop();
  const { isFavorite, toggleFavorite } = useUserData();
  const openProject = useOpenProject();
  const { t, l, locale } = useI18n();
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const project =
    (state.viewerProjectId && projectsById.get(state.viewerProjectId)) || viewableProjects[0];
  const index = viewableProjects.indexOf(project);
  const total = viewableProjects.length;

  const go = (step: number) =>
    openProject(viewableProjects[(index + step + total) % total].id);

  // Arrow keys switch projects while the viewer is the active window.
  const isActive = focusedId === "viewer";
  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.target as Element).closest("input, textarea")) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      openProject(viewableProjects[(index + step + total) % total].id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, index, total, openProject]);

  if (!project?.image) return null;
  const name = l(project.title);
  const category = categories.find((item) => item.id === project.category);
  const favorite = isFavorite(project.id);
  const loaded = loadedSrc === project.image.full;

  return (
    <div className={styles.viewer}>
      <div className={styles.viewerStage}>
        {!loaded && (
          <img
            className={`${styles.viewerImage} ${styles.viewerPreview}`}
            src={project.image.thumb}
            alt=""
            aria-hidden="true"
          />
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          <m.img
            key={project.id}
            className={styles.viewerImage}
            src={project.image.full}
            width={project.image.width}
            height={project.image.height}
            alt={name}
            draggable={false}
            onLoad={() => setLoadedSrc(project.image!.full)}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.97 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>

      <div className={styles.viewerBar}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => go(-1)}
          aria-label={t("viewer.previous")}
          title={t("viewer.previous")}
        >
          <ArrowLeftIcon />
        </button>

        <div className={styles.viewerInfo} aria-live="polite">
          <strong>{name}</strong>
          <small>
            {[category && l(category.name), project.client, formatDate(project.date, locale)]
              .filter(Boolean)
              .join(" · ")}
          </small>
          <small className="visually-hidden">
            {t("viewer.position", { current: index + 1, total })}
          </small>
        </div>

        <button
          type="button"
          className={`${styles.iconButton} ${favorite ? styles.starred : ""}`}
          onClick={() => toggleFavorite(project.id)}
          aria-pressed={favorite}
          aria-label={t(favorite ? "portfolio.removeFavorite" : "portfolio.addFavorite", { name })}
          title={t(favorite ? "portfolio.removeFavorite" : "portfolio.addFavorite", { name })}
        >
          {favorite ? <StarIcon /> : <StarOutlineIcon />}
        </button>
        <a
          className={styles.iconButton}
          href={project.image.full}
          target="_blank"
          rel="noreferrer"
          aria-label={t("viewer.openOriginal")}
          title={t("viewer.openOriginal")}
        >
          <ExternalIcon />
        </a>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => go(1)}
          aria-label={t("viewer.next")}
          title={t("viewer.next")}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
