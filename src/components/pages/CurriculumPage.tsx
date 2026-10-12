import { m } from "motion/react";
import type { ReactNode } from "react";
import { courses, education, experience, languages } from "../../content/curriculum";
import { useI18n } from "../../i18n/useI18n";
import { useDesktop } from "../../os/DesktopContext";
import { SkillList } from "../apps/SkillList";
import { Panel } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./pages.module.css";

function CvSection({ title, children, index }: { title: string; children: ReactNode; index: number }) {
  return (
    <m.section
      className={styles.cvSection}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.3 }}
    >
      <SectionHeading>{title}</SectionHeading>
      {children}
    </m.section>
  );
}

export function CurriculumPage() {
  const { t, l } = useI18n();
  const { isCompact } = useDesktop();

  return (
    <div className={styles.curriculum}>
      <div className={styles.cvColumn}>
        <CvSection title={t("cv.experience")} index={0}>
          <ul className={styles.cvList}>
            {experience.map((job) => (
              <li key={job.company}>
                <strong>{l(job.role)}</strong>
                <strong>{job.company}</strong>
                {job.reference && (
                  <span>
                    <span className="visually-hidden">{t("cv.reference")}: </span>
                    {job.reference.name}
                    <br />
                    {job.reference.phone}
                  </span>
                )}
                <span className={styles.cvPeriod}>{l(job.period)}</span>
              </li>
            ))}
          </ul>
        </CvSection>
      </div>

      <div className={styles.cvColumn}>
        <CvSection title={t("cv.education")} index={1}>
          <ul className={styles.cvList}>
            {education.map((study) => (
              <li key={study.school}>
                <strong>{study.period}</strong>
                <span>{study.school}</span>
                <span>{l(study.detail)}</span>
              </li>
            ))}
          </ul>
        </CvSection>

        <CvSection title={t("cv.courses")} index={2}>
          <ul className={styles.cvList}>
            {courses.map((course) => (
              <li key={course.provider}>
                <strong>{l(course.name)}</strong>
                <span>{course.provider}</span>
              </li>
            ))}
          </ul>
        </CvSection>

        <CvSection title={t("cv.languages")} index={3}>
          <dl className={styles.languages}>
            {languages.map((language) => (
              <div key={language.name.en}>
                <dt>{l(language.name)}:</dt>
                <dd>{l(language.level)}</dd>
              </div>
            ))}
          </dl>
        </CvSection>
      </div>

      {isCompact && (
        <Panel title={t("window.skills")} className={styles.fullRow}>
          <SkillList />
        </Panel>
      )}
    </div>
  );
}
