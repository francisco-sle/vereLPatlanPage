import { AnimatePresence, m } from "motion/react";
import { useId } from "react";
import type { Category, Project } from "../../content/portfolio";
import { useI18n } from "../../i18n/useI18n";
import { useUserData } from "../../os/UserDataContext";
import { ChevronIcon } from "../ui/Icons";
import { ProjectCard } from "./ProjectCard";
import styles from "./Portfolio.module.css";

interface Props {
  category: Category;
  projects: Project[];
}

/** A collapsible category of projects; the collapsed state is remembered. */
export function ProjectSection({ category, projects }: Props) {
  const { l } = useI18n();
  const { collapsedSections, toggleSection } = useUserData();
  const contentId = useId();
  const expanded = !collapsedSections.includes(category.id);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionHeading}>
        <button
          type="button"
          className={styles.sectionToggle}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => toggleSection(category.id)}
        >
          <ChevronIcon className={styles.chevron} />
          {l(category.name)}
          <span className={styles.count}>{projects.length}</span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            id={contentId}
            className={styles.collapse}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className={`${styles.grid} ${styles[`grid-${category.aspect}`]}`}>
              <AnimatePresence initial={false} mode="popLayout">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    category={category}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
