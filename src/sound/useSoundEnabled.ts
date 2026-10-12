import { useSyncExternalStore } from "react";
import { isSoundEnabled, subscribeToSound } from "./sound";

export const useSoundEnabled = () => useSyncExternalStore(subscribeToSound, isSoundEnabled);
