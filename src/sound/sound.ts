/**
 * Retro UI sounds synthesized with the Web Audio API — no audio files to
 * download. Each sound is a few short notes with a bell-like envelope.
 */
import { STORAGE_KEYS, readStorage, writeStorage } from "../lib/storage";

export type SoundName =
  | "open"
  | "close"
  | "minimize"
  | "restore"
  | "maximize"
  | "tab"
  | "click"
  | "menu"
  | "star"
  | "unstar"
  | "notify"
  | "startup"
  | "logoff";

interface Note {
  /** Frequency in Hz; `to` glides towards another frequency. */
  freq: number;
  to?: number;
  /** Start offset and length in seconds. */
  at: number;
  dur: number;
  wave?: OscillatorType;
  gain?: number;
}

// Note frequencies (Hz)
const C4 = 261.63, G4 = 392;
const C5 = 523.25, E5 = 659.25, G5 = 783.99, A5 = 880, B5 = 987.77;
const C6 = 1046.5, D6 = 1174.66, E6 = 1318.51, G6 = 1567.98;

const SOUNDS: Record<SoundName, Note[]> = {
  open: [
    { freq: E5, at: 0, dur: 0.12 },
    { freq: B5, at: 0.07, dur: 0.22 },
  ],
  close: [
    { freq: B5, at: 0, dur: 0.1 },
    { freq: E5, at: 0.07, dur: 0.2 },
  ],
  minimize: [{ freq: 900, to: 300, at: 0, dur: 0.2, wave: "sine", gain: 0.45 }],
  restore: [{ freq: 300, to: 900, at: 0, dur: 0.2, wave: "sine", gain: 0.45 }],
  maximize: [
    { freq: G5, at: 0, dur: 0.07, wave: "square", gain: 0.12 },
    { freq: C6, at: 0.06, dur: 0.1, wave: "square", gain: 0.12 },
  ],
  tab: [{ freq: 1500, to: 1100, at: 0, dur: 0.035, wave: "square", gain: 0.1 }],
  click: [{ freq: 2000, to: 1400, at: 0, dur: 0.025, wave: "square", gain: 0.08 }],
  menu: [
    { freq: C5, at: 0, dur: 0.08 },
    { freq: E5, at: 0.05, dur: 0.08 },
    { freq: G5, at: 0.1, dur: 0.16 },
  ],
  star: [
    { freq: G5, at: 0, dur: 0.1, wave: "sine" },
    { freq: B5, at: 0.06, dur: 0.1, wave: "sine" },
    { freq: D6, at: 0.12, dur: 0.1, wave: "sine" },
    { freq: G6, at: 0.18, dur: 0.3, wave: "sine", gain: 0.4 },
  ],
  unstar: [
    { freq: D6, at: 0, dur: 0.09, wave: "sine" },
    { freq: G5, at: 0.07, dur: 0.18, wave: "sine" },
  ],
  notify: [
    { freq: A5, at: 0, dur: 0.35, wave: "sine" },
    { freq: E6, at: 0.12, dur: 0.5, wave: "sine", gain: 0.35 },
  ],
  // A slow, swelling chord, like an old OS greeting you after logging in.
  startup: [
    { freq: C4, at: 0, dur: 2.2, wave: "sine", gain: 0.3 },
    { freq: G4, at: 0.12, dur: 2, wave: "sine", gain: 0.25 },
    { freq: E5, at: 0.24, dur: 1.8, wave: "triangle", gain: 0.3 },
    { freq: G5, at: 0.4, dur: 1.6, wave: "triangle", gain: 0.25 },
    { freq: C6, at: 0.56, dur: 1.5, wave: "sine", gain: 0.3 },
    { freq: E6, at: 0.72, dur: 1.4, wave: "sine", gain: 0.18 },
  ],
  logoff: [
    { freq: C6, at: 0, dur: 0.5, wave: "sine", gain: 0.3 },
    { freq: G5, at: 0.14, dur: 0.6, wave: "sine", gain: 0.3 },
    { freq: E5, at: 0.28, dur: 0.7, wave: "triangle", gain: 0.3 },
    { freq: C5, at: 0.42, dur: 1, wave: "sine", gain: 0.3 },
  ],
};

const MASTER_VOLUME = 0.2;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = readStorage(STORAGE_KEYS.sound, true, (v): v is boolean => typeof v === "boolean");
const listeners = new Set<() => void>();

function getContext(): AudioContext | null {
  if (!context) {
    if (typeof window.AudioContext !== "function") return null;
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

/**
 * Plays a UI sound. Browsers only allow audio after the visitor interacts,
 * so `passive` sounds (not caused by a click) are skipped until then.
 */
export function playSound(name: SoundName, { passive = false } = {}) {
  if (!enabled) return;
  if (passive && context?.state !== "running") return;
  const audio = getContext();
  if (!audio || !master) return;

  const start = audio.currentTime + 0.005;
  for (const note of SOUNDS[name]) {
    const begin = start + note.at;
    const end = begin + note.dur;
    const oscillator = audio.createOscillator();
    const envelope = audio.createGain();
    oscillator.type = note.wave ?? "triangle";
    oscillator.frequency.setValueAtTime(note.freq, begin);
    if (note.to) oscillator.frequency.exponentialRampToValueAtTime(note.to, end);
    envelope.gain.setValueAtTime(0.0001, begin);
    envelope.gain.exponentialRampToValueAtTime(note.gain ?? 0.5, begin + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(envelope).connect(master);
    oscillator.start(begin);
    oscillator.stop(end + 0.02);
  }
}

export const isSoundEnabled = () => enabled;

export function setSoundEnabled(value: boolean) {
  enabled = value;
  writeStorage(STORAGE_KEYS.sound, value);
  listeners.forEach((listener) => listener());
  if (value) playSound("click");
}

export function subscribeToSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
