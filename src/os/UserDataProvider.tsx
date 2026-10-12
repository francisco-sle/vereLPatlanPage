import { useCallback, useMemo, type ReactNode } from "react";
import { projectsById } from "../content/portfolio";
import { usePersistentState } from "../hooks/usePersistentState";
import { STORAGE_KEYS, isStringArray } from "../lib/storage";
import { playSound } from "../sound/sound";
import { UserDataContext, type UserDataValue } from "./UserDataContext";

const MAX_RECENT = 5;

const toggleIn = (list: string[], item: string) =>
  list.includes(item) ? list.filter((value) => value !== item) : [...list, item];

/** Favorites, recently viewed projects and UI preferences, saved in localStorage. */
export function UserDataProvider({ children }: { children: ReactNode }) {
  const [storedFavorites, setFavorites] = usePersistentState<string[]>(
    STORAGE_KEYS.favorites,
    [],
    isStringArray,
  );
  const [storedRecent, setRecent] = usePersistentState<string[]>(
    STORAGE_KEYS.recent,
    [],
    isStringArray,
  );
  const [collapsedSections, setCollapsed] = usePersistentState<string[]>(
    STORAGE_KEYS.collapsedSections,
    [],
    isStringArray,
  );

  // Ignore ids of projects that were removed from the content since they were saved.
  const favorites = useMemo(
    () => storedFavorites.filter((id) => projectsById.has(id)),
    [storedFavorites],
  );
  const recent = useMemo(() => storedRecent.filter((id) => projectsById.has(id)), [storedRecent]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const toggleFavorite = useCallback(
    (id: string) => {
      playSound(storedFavorites.includes(id) ? "unstar" : "star");
      setFavorites((list) => toggleIn(list, id));
    },
    [storedFavorites, setFavorites],
  );
  const addRecent = useCallback(
    (id: string) =>
      setRecent((list) => [id, ...list.filter((value) => value !== id)].slice(0, MAX_RECENT)),
    [setRecent],
  );
  const toggleSection = useCallback(
    (id: string) => {
      playSound("click");
      setCollapsed((list) => toggleIn(list, id));
    },
    [setCollapsed],
  );

  const value = useMemo<UserDataValue>(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      recent,
      addRecent,
      collapsedSections,
      toggleSection,
    }),
    [favorites, isFavorite, toggleFavorite, recent, addRecent, collapsedSections, toggleSection],
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}
