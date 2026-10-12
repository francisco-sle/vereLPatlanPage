import { useCallback } from "react";
import { useDesktop } from "./DesktopContext";
import { useUserData } from "./UserDataContext";

/** Opens a project in the image viewer and records it as recently viewed. */
export function useOpenProject() {
  const { actions } = useDesktop();
  const { addRecent } = useUserData();
  return useCallback(
    (projectId: string) => {
      actions.openProject(projectId);
      addRecent(projectId);
    },
    [actions, addRecent],
  );
}
