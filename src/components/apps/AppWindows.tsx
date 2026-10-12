import { projectsById } from "../../content/portfolio";
import { useDesktop } from "../../os/DesktopContext";
import { Window } from "../window/Window";
import { AboutText } from "./AboutText";
import { FavoritesList } from "./FavoritesList";
import { ProfilePhoto } from "./ProfilePhoto";
import { ProjectViewer } from "./ProjectViewer";
import { SkillList } from "./SkillList";
import styles from "./apps.module.css";

export function ProfileWindow() {
  return (
    <Window id="profile" bodyClassName={styles.photoBody}>
      <ProfilePhoto />
    </Window>
  );
}

export function AboutWindow() {
  return (
    <Window id="about" bodyClassName={styles.centeredBody}>
      <AboutText />
    </Window>
  );
}

export function SkillsWindow() {
  return (
    <Window id="skills" bodyClassName={styles.centeredBody}>
      <SkillList />
    </Window>
  );
}

export function FavoritesWindow() {
  return (
    <Window id="favorites">
      <FavoritesList />
    </Window>
  );
}

export function ViewerWindow() {
  const { state } = useDesktop();
  const project = state.viewerProjectId ? projectsById.get(state.viewerProjectId) : undefined;
  return (
    <Window id="viewer" title={project?.fileName} bodyClassName={styles.viewerBody}>
      <ProjectViewer />
    </Window>
  );
}


