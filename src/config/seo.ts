/**
 * Search-engine and social-preview texts for each page. The build writes an
 * HTML file per page with these tags (see `scripts/seo-plugin.ts`), and the app
 * uses the titles for the browser tab. English is what crawlers see.
 */
import type { Localized } from "../i18n/translations";
import type { TabId } from "../os/types";

export interface PageSeo {
  /** URL path the page is served from. */
  path: string;
  title: Localized;
  description: Localized;
}

export const seoRole: Localized = {
  en: "Graphic Designer & Illustrator",
  es: "Diseñadora gráfica e ilustradora",
};

export const pageSeo: Record<TabId, PageSeo> = {
  home: {
    path: "/",
    title: {
      en: "Vere L Patlan · Graphic Designer & Illustrator",
      es: "Vere L Patlan · Diseñadora gráfica e ilustradora",
    },
    description: {
      en: "Portfolio of Verenice López (Vere L Patlan), a graphic designer and illustrator from Baja California, Mexico: branding, social media advertising, illustration and web design.",
      es: "Portafolio de Verenice López (Vere L Patlan), diseñadora gráfica e ilustradora de Baja California, México: branding, publicidad en redes, ilustración y diseño web.",
    },
  },
  curriculum: {
    path: "/curriculum",
    title: {
      en: "Curriculum · Vere L Patlan",
      es: "Currículum · Vere L Patlan",
    },
    description: {
      en: "Résumé of Verenice López, graphic designer graduated from UABC: work experience at BCentral Media, education, courses, software skills and languages.",
      es: "Currículum de Verenice López, diseñadora gráfica titulada de la UABC: experiencia en BCentral Media, estudios, cursos, software y idiomas.",
    },
  },
  portfolio: {
    path: "/portfolio",
    title: {
      en: "Portfolio · Vere L Patlan",
      es: "Portafolio · Vere L Patlan",
    },
    description: {
      en: "Branding, social media advertising, illustration and web design projects by graphic designer Verenice López, for clients such as Maneki Brew, The Cheemz and Devoralia.",
      es: "Proyectos de branding, publicidad en redes, ilustración y diseño web de la diseñadora gráfica Verenice López, para clientes como Maneki Brew, The Cheemz y Devoralia.",
    },
  },
};

/** Social preview image, served from `public/` (regenerate with `npm run og-image`). */
export const ogImage = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Vere L Patlan portfolio: a girl with a cat beanie reading on a crescent moon between clouds",
};
