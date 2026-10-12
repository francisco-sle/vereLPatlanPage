/** Texts and images for the "Home" tab windows. */
import type { Localized } from "../i18n/translations";
import heroImage from "../assets/images/hero.webp";
import profileImage from "../assets/images/profile.webp";

export const hero = { src: heroImage, width: 907, height: 605 };

export const profilePhoto = { src: profileImage, width: 539, height: 720 };

export const aboutText: Localized<string[]> = {
  en: [
    "Hello! My real name is Verenice López, and I'm a graduate graphic designer.",
    "I really love drawing, color and cats — that's why I merged them together into this brand about me.",
    "Feel free to look around and explore my projects and work.",
  ],
  es: [
    "¡Hola! Mi nombre real es Verenice López y soy diseñadora gráfica titulada.",
    "Me encanta dibujar, el color y los gatos; por eso los uní en esta marca que habla de mí.",
    "Siéntete libre de explorar este proyecto y conocer más de mi trabajo.",
  ],
};
