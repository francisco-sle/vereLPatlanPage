/**
 * Site-wide settings that are likely to change over time: links, names,
 * credits and storage keys. Edit values here — components read from this file.
 *
 * Content (projects, CV, skills, texts) lives in `src/content/`.
 */

export type SocialId = "twitter" | "instagram" | "facebook";

export type MailService = "gmail" | "outlook";

export interface SocialLink {
  id: SocialId;
  label: string;
  url: string;
}

export const siteConfig = {
  /** Browser tab title suffix and start-menu header. */
  siteName: "Vere L Patlan",
  ownerName: "Verenice López",

  /** Contact links open a new message to this address. TODO: replace with the real address. */
  email: "your-email@example.com",

  /**
   * Webmail service the "Contact" links open: "gmail" or "outlook".
   * Right-click menus always offer both, plus copying the address.
   */
  mailService: "gmail" as MailService,

  /** Social links shown in the taskbar and start menu. */
  socials: [
    // TODO: replace with the real Twitter / X profile URL.
    { id: "twitter", label: "Twitter", url: "https://x.com/your-handle" },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/pepperjam89/" },
    // TODO: replace with the real Facebook profile URL.
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/your-handle" },
  ] satisfies SocialLink[],

  /** Footer credits shown at the bottom of the main browser window. */
  credits: {
    developer: { name: "Sabino López", url: "https://github.com/Coreandrum1" },
    designer: { name: "Verenice López", url: "https://github.com/" }, // TODO: designer's GitHub URL
  },

  /** Default language when the visitor's browser language isn't Spanish. */
  defaultLanguage: "en" as "en" | "es",

  /**
   * Prefix for everything saved in localStorage. Bump the version to reset
   * every visitor's saved desktop (e.g. after a big layout change).
   */
  storagePrefix: "vere-os:v1",
} as const;
