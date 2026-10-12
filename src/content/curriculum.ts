/** Curriculum content shown in the "Curriculum" tab. */
import type { Localized } from "../i18n/translations";

export interface Job {
  role: Localized;
  company: string;
  reference?: { name: string; phone: string };
  period: Localized;
}

export interface Study {
  period: string;
  school: string;
  detail: Localized;
}

export interface Course {
  name: Localized;
  provider: string;
}

export interface Language {
  name: Localized;
  level: Localized;
}

export const experience: Job[] = [
  {
    role: { en: "Graphic Designer", es: "Diseñadora gráfica" },
    company: "Instituto de Investigaciones Culturales",
    reference: { name: "Rosalba Galindo", phone: "554 - 1977" },
    period: { en: "February – June 2019", es: "Febrero a junio 2019" },
  },
  {
    role: { en: "Graphic Designer", es: "Diseñadora gráfica" },
    company: "BCentral Media",
    reference: { name: "Oscar Villafuerte", phone: "(686) 107 - 8792" },
    period: { en: "October 2019 – April 2022", es: "Octubre 2019 – abril 2022" },
  },
];

export const education: Study[] = [
  {
    period: "2005 – 2009",
    school: "Colegio de Bachilleres Baja California",
    detail: {
      en: "Specialty: Office computing",
      es: "Especialidad: Informática para oficinas",
    },
  },
  {
    period: "2011 – 2019",
    school: "Universidad Autónoma de Baja California",
    detail: { en: "Graphic Design", es: "Diseño Gráfico" },
  },
];

export const courses: Course[] = [
  { name: { en: "3D Modeling in Maya", es: "Modelado 3D en Maya" }, provider: "CEART" },
  {
    name: { en: "Web & Mobile Designer in 2022", es: "Web & Mobile Designer in 2022" },
    provider: "Zero To Mastery",
  },
];

export const languages: Language[] = [
  { name: { en: "Spanish", es: "Español" }, level: { en: "Native", es: "Nativo" } },
  { name: { en: "English", es: "Inglés" }, level: { en: "Conversational", es: "Conversacional" } },
];
