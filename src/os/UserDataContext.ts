import { createContext, useContext } from "react";

export interface UserDataValue {
  favorites: string[];
  isFavorite: (projectId: string) => boolean;
  toggleFavorite: (projectId: string) => void;
  /** Most recently viewed project ids, newest first. */
  recent: string[];
  addRecent: (projectId: string) => void;
  collapsedSections: string[];
  toggleSection: (sectionId: string) => void;
}

export const UserDataContext = createContext<UserDataValue | null>(null);

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) throw new Error("useUserData must be used inside <UserDataProvider>");
  return context;
}
