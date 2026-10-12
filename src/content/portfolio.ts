/**
 * Portfolio projects. To add one:
 *  1. Drop the original image into `Images/` and add it to `scripts/images.json`.
 *  2. Run `npm run images` to generate the optimized WebP files.
 *  3. Import them below and add an entry to `projects`.
 * Leave `image` out to show a "coming soon" placeholder tile.
 */
import type { Localized } from "../i18n/translations";

import beatMusic from "../assets/images/beat-music.webp";
import beatMusicThumb from "../assets/images/beat-music-thumb.webp";
import cheemz from "../assets/images/cheemz-boba-tea.webp";
import cheemzThumb from "../assets/images/cheemz-boba-tea-thumb.webp";
import devoralia from "../assets/images/devoralia-frutos-rojos.webp";
import devoraliaThumb from "../assets/images/devoralia-frutos-rojos-thumb.webp";
import cooperativas from "../assets/images/dia-cooperativas.webp";
import cooperativasThumb from "../assets/images/dia-cooperativas-thumb.webp";
import rabia from "../assets/images/dia-de-la-rabia.webp";
import rabiaThumb from "../assets/images/dia-de-la-rabia-thumb.webp";
import radio from "../assets/images/dia-de-la-radio.webp";
import radioThumb from "../assets/images/dia-de-la-radio-thumb.webp";
import forestal from "../assets/images/dia-forestal.webp";
import forestalThumb from "../assets/images/dia-forestal-thumb.webp";
import edgar from "../assets/images/edgar-jugo-verde.webp";
import edgarThumb from "../assets/images/edgar-jugo-verde-thumb.webp";
import luckyLapin from "../assets/images/lucky-lapin.webp";
import luckyLapinThumb from "../assets/images/lucky-lapin-thumb.webp";
import maneki from "../assets/images/maneki-brew.webp";
import manekiThumb from "../assets/images/maneki-brew-thumb.webp";
import myriam from "../assets/images/myriam-mapa.webp";
import myriamThumb from "../assets/images/myriam-mapa-thumb.webp";
import nutribibi from "../assets/images/nutribibi-musculo-grasa.webp";
import nutribibiThumb from "../assets/images/nutribibi-musculo-grasa-thumb.webp";
import terapia from "../assets/images/terapia-nutricional.webp";
import terapiaThumb from "../assets/images/terapia-nutricional-thumb.webp";

type CategoryId = "branding" | "social" | "illustration" | "web";

export interface Category {
  id: CategoryId;
  name: Localized;
  /** Shape of the thumbnails in this section. */
  aspect: "square" | "portrait" | "tall" | "landscape";
  /** `contain` keeps logos whole on a white card; `cover` fills the frame. */
  fit: "contain" | "cover";
}

interface ProjectImage {
  thumb: string;
  full: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  category: CategoryId;
  title: Localized;
  client: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Shown as the image viewer's window title. */
  fileName: string;
  image?: ProjectImage;
}

export const categories: Category[] = [
  {
    id: "branding",
    name: { en: "Branding", es: "Branding" },
    aspect: "square",
    fit: "contain",
  },
  {
    id: "social",
    name: { en: "Social Advertising", es: "Publicidad en redes" },
    aspect: "portrait",
    fit: "cover",
  },
  {
    id: "illustration",
    name: { en: "Illustration", es: "Ilustración" },
    aspect: "tall",
    fit: "cover",
  },
  {
    id: "web",
    name: { en: "Web Design", es: "Diseño web" },
    aspect: "landscape",
    fit: "cover",
  },
];

const BURO = "Buró de diseño";

export const projects: Project[] = [
  // Branding
  {
    id: "cheemz-boba-tea",
    category: "branding",
    title: { en: "The Cheemz Boba Tea", es: "The Cheemz Boba Tea" },
    client: "The Cheemz",
    date: "2022-07-26",
    fileName: "the-cheemz.jpg",
    image: { thumb: cheemzThumb, full: cheemz, width: 1800, height: 1800 },
  },
  {
    id: "terapia-nutricional",
    category: "branding",
    title: { en: "Terapia Nutricional", es: "Terapia Nutricional" },
    client: "Terapia Nutricional",
    date: "2018-09-20",
    fileName: "terapia-nutricional.jpg",
    image: { thumb: terapiaThumb, full: terapia, width: 1800, height: 1391 },
  },
  {
    id: "maneki-brew",
    category: "branding",
    title: { en: "Maneki Brew", es: "Maneki Brew" },
    client: "Maneki Brew",
    date: "2023-01-06",
    fileName: "maneki-brew.png",
    image: { thumb: manekiThumb, full: maneki, width: 1800, height: 1800 },
  },

  // Social advertising
  {
    id: "edgar-magana",
    category: "social",
    title: { en: "Edgar Magaña", es: "Edgar Magaña" },
    client: "Edgar Magaña",
    date: "2022-08-18",
    fileName: "jugo-verde.jpg",
    image: { thumb: edgarThumb, full: edgar, width: 1000, height: 1200 },
  },
  {
    id: "miriam-guerrero",
    category: "social",
    title: { en: "Miriam Guerrero", es: "Miriam Guerrero" },
    client: "Miriam Guerrero",
    date: "2023-06-10",
    fileName: "myriam-mapa.jpg",
    image: { thumb: myriamThumb, full: myriam, width: 1536, height: 1800 },
  },
  {
    id: "devoralia",
    category: "social",
    title: { en: "Devoralia", es: "Devoralia" },
    client: "Devoralia",
    date: "2022-02-25",
    fileName: "frutos-rojos.jpg",
    image: { thumb: devoraliaThumb, full: devoralia, width: 1000, height: 1200 },
  },
  {
    id: "nutribibi",
    category: "social",
    title: { en: "Nutribibi", es: "Nutribibi" },
    client: "Nutribibi",
    date: "2022-03-14",
    fileName: "musculo-vs-grasa.jpg",
    image: { thumb: nutribibiThumb, full: nutribibi, width: 1000, height: 1200 },
  },

  // Illustration
  {
    id: "dia-cooperativas",
    category: "illustration",
    title: { en: "Cooperatives Day", es: "Día de las Cooperativas" },
    client: BURO,
    date: "2020-07-10",
    fileName: "dia-cooperativas.png",
    image: { thumb: cooperativasThumb, full: cooperativas, width: 1166, height: 1800 },
  },
  {
    id: "dia-de-la-radio",
    category: "illustration",
    title: { en: "World Radio Day", es: "Día Mundial de la Radio" },
    client: BURO,
    date: "2020-02-08",
    fileName: "dia-de-la-radio.png",
    image: { thumb: radioThumb, full: radio, width: 1165, height: 1800 },
  },
  {
    id: "dia-forestal",
    category: "illustration",
    title: { en: "World Forestry Day", es: "Día Forestal Mundial" },
    client: BURO,
    date: "2019-03-11",
    fileName: "dia-forestal.jpg",
    image: { thumb: forestalThumb, full: forestal, width: 792, height: 1224 },
  },
  {
    id: "dia-de-la-rabia",
    category: "illustration",
    title: { en: "World Rabies Day", es: "Día Mundial de la Rabia" },
    client: BURO,
    date: "2019-03-14",
    fileName: "dia-de-la-rabia.png",
    image: { thumb: rabiaThumb, full: rabia, width: 792, height: 1224 },
  },

  // Web design
  {
    id: "lucky-lapin",
    category: "web",
    title: { en: "Lucky Lapin", es: "Lucky Lapin" },
    client: BURO,
    date: "2019-03-11",
    fileName: "lucky-lapin.png",
    image: { thumb: luckyLapinThumb, full: luckyLapin, width: 1405, height: 664 },
  },
  {
    id: "beat",
    category: "web",
    title: { en: "Beat", es: "Beat" },
    client: BURO,
    date: "2019-03-11",
    fileName: "beat.png",
    image: { thumb: beatMusicThumb, full: beatMusic, width: 1309, height: 823 },
  },
  {
    // TODO: add the "Pettite Machine" mockup image when it's available.
    id: "pettite-machine",
    category: "web",
    title: { en: "Pettite Machine", es: "Pettite Machine" },
    client: BURO,
    date: "2019-03-11",
    fileName: "pettite-machine.png",
  },
];

export const projectsById = new Map(projects.map((project) => [project.id, project]));

/** Projects that have an image, in display order (used for viewer navigation). */
export const viewableProjects = projects.filter((project) => project.image);
