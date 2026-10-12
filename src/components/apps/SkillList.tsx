import { skills } from "../../content/skills";
import { useI18n } from "../../i18n/useI18n";
import { ProgressBar } from "../ui/ProgressBar";
import styles from "./apps.module.css";

export function SkillList() {
  const { t } = useI18n();
  return (
    <ul className={styles.skills}>
      {skills.map((skill, index) => (
        <li key={skill.name} className={styles.skill}>
          <img src={skill.icon} alt="" width={46} height={46} className={styles.skillIcon} />
          <div className={styles.skillInfo}>
            <span className={styles.skillName}>{skill.name}</span>
            <ProgressBar
              value={skill.level}
              label={t("skills.level", { name: skill.name, level: skill.level })}
              delay={0.15 + index * 0.08}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
