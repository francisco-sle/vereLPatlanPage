export type Lang = "en" | "es";

/** A value available in every supported language. */
export type Localized<T = string> = Record<Lang, T>;

export const LANGS: readonly Lang[] = ["en", "es"];

export const LOCALES: Record<Lang, string> = {
  en: "en-US",
  es: "es-MX",
};

const en = {
  // Tabs / pages
  "tab.home": "Home",
  "tab.curriculum": "Curriculum",
  "tab.portfolio": "Portfolio",

  // Window titles
  "window.browser": "Browser",
  "window.profile": "Profile",
  "window.about": "About Me",
  "window.skills": "Software Skills",
  "window.favorites": "Favorites",
  "window.viewer": "Image Viewer",
  "contact.label": "Contact",

  // Window controls
  "control.minimize": "Minimize",
  "control.maximize": "Maximize",
  "control.restore": "Restore",
  "control.close": "Close",

  // Browser chrome
  "browser.favorites": "Open favorites",
  "browser.searchPlaceholder": "Search projects, pages…",
  "browser.searchLabel": "Search the portfolio",
  "browser.tabs": "Pages",
  "search.noResults": "No results for “{query}”",
  "search.pages": "Pages",
  "search.apps": "Windows",
  "search.clear": "Clear search",

  // Desktop
  "desktop.label": "Desktop",
  "desktop.icons": "Desktop folders",
  "desktop.openFolder": "Open {name}",
  "desktop.closeFolder": "Close {name}",

  // Taskbar
  "taskbar.start": "Start menu",
  "taskbar.openWindows": "Open windows",
  "taskbar.social": "Social links",
  "taskbar.language": "Change language",
  "taskbar.minimized": "minimized",

  // Start menu
  "start.subtitle": "Graphic designer & illustrator",
  "start.apps": "Open",
  "start.recent": "Recently viewed",
  "start.settings": "Settings",
  "start.resetLayout": "Reset desktop layout",
  "start.social": "Find me on",

  // Home
  "home.heroAlt": "Portfolio illustration: a girl with a cat beanie reading on a crescent moon between clouds",
  "home.profileAlt": "Portrait of Verenice López",

  // Curriculum
  "cv.experience": "Experience",
  "cv.education": "Education",
  "cv.courses": "Courses",
  "cv.languages": "Languages",
  "cv.reference": "Reference",

  // Skills
  "skills.level": "{name}: {level}% proficiency",

  // Portfolio
  "portfolio.all": "All",
  "portfolio.favorites": "Favorites",
  "portfolio.filter": "Filter projects",
  "portfolio.addFavorite": "Add {name} to favorites",
  "portfolio.removeFavorite": "Remove {name} from favorites",
  "portfolio.open": "Open {name}",
  "portfolio.comingSoon": "Coming soon",
  "portfolio.noFavorites": "No favorites yet. Tap the ☆ on any project to save it here.",

  // Viewer
  "viewer.previous": "Previous project",
  "viewer.next": "Next project",
  "viewer.openOriginal": "Open full size",
  "viewer.position": "{current} of {total}",

  // Favorites window
  "favorites.empty": "Nothing saved yet.",
  "favorites.hint": "Use the ☆ on any project in the Portfolio to keep it here.",
  "favorites.browse": "Browse portfolio",

  // Hints / misc
  "sound.toggle": "Sound effects",
  "sound.on": "Sound effects: on",
  "sound.off": "Sound effects: off",

  "hint.title": "Welcome!",
  "hint.body":
    "Click a folder to open it. Drag windows by their title bar, resize them from the edges, and use the taskbar to bring back minimized windows.",
  "hint.dismiss": "Got it",

  // Boot & welcome screens
  "boot.starting": "Starting up…",
  "boot.edition": "Portfolio Edition",
  "boot.copyright": "Copyright © {year} {name}",
  "login.begin": "To begin, click the user name",
  "login.loading": "Loading your personal settings…",
  "login.welcome": "welcome",
  "login.loggingOff": "Logging off…",
  "login.restart": "Restart",
  "login.tip": "After you log on, open the folders on the desktop to explore my work.",
  "start.logOff": "Log off",
  "menu.emailMe": "Send me an email",
  "menu.emailWith": "Email me with {service}",
  "menu.copyEmail": "Copy email address",
  "menu.showDesktop": "Show desktop",
  "menu.resetWindow": "Reset size & position",
  "menu.resetAll": "Reset all saved data…",
  "menu.open": "Open",
  "toast.emailCopied": "Email address copied!",
  "toast.copyFailed": "Couldn't copy. The address is {email}",
  "toast.layoutReset": "Desktop layout reset",
  "confirm.resetTitle": "Reset everything?",
  "confirm.resetMessage":
    "This clears your favorites, recently viewed projects, window layout and settings on this device.",
  "confirm.resetConfirm": "Reset",
  "dialog.cancel": "Cancel",

  "contact.defaultSubject": "Hello from your portfolio!",
  "contact.cta": "Contact me",
  "taskbar.email": "Email",
  "a11y.newTab": "opens in a new tab",

  "a11y.skip": "Skip to content",
  "footer.webDev": "Web Dev",
  "footer.design": "Design",
  "footer.onGithub": "on GitHub",
} as const;

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
  "tab.home": "Inicio",
  "tab.curriculum": "Currículum",
  "tab.portfolio": "Portafolio",

  "window.browser": "Navegador",
  "window.profile": "Perfil",
  "window.about": "Sobre mí",
  "window.skills": "Habilidades de software",
  "window.favorites": "Favoritos",
  "window.viewer": "Visor de imágenes",
  "contact.label": "Contacto",

  "control.minimize": "Minimizar",
  "control.maximize": "Maximizar",
  "control.restore": "Restaurar",
  "control.close": "Cerrar",

  "browser.favorites": "Abrir favoritos",
  "browser.searchPlaceholder": "Buscar proyectos, páginas…",
  "browser.searchLabel": "Buscar en el portafolio",
  "browser.tabs": "Páginas",
  "search.noResults": "Sin resultados para “{query}”",
  "search.pages": "Páginas",
  "search.apps": "Ventanas",
  "search.clear": "Limpiar búsqueda",

  "desktop.label": "Escritorio",
  "desktop.icons": "Carpetas del escritorio",
  "desktop.openFolder": "Abrir {name}",
  "desktop.closeFolder": "Cerrar {name}",

  "taskbar.start": "Menú de inicio",
  "taskbar.openWindows": "Ventanas abiertas",
  "taskbar.social": "Redes sociales",
  "taskbar.language": "Cambiar idioma",
  "taskbar.minimized": "minimizada",

  "start.subtitle": "Diseñadora gráfica e ilustradora",
  "start.apps": "Abrir",
  "start.recent": "Vistos recientemente",
  "start.settings": "Ajustes",
  "start.resetLayout": "Restablecer escritorio",
  "start.social": "Encuéntrame en",

  "home.heroAlt": "Ilustración del portafolio: una chica con gorro de gato leyendo sobre una luna entre nubes",
  "home.profileAlt": "Retrato de Verenice López",

  "cv.experience": "Experiencia",
  "cv.education": "Educación",
  "cv.courses": "Cursos",
  "cv.languages": "Idiomas",
  "cv.reference": "Referencia",

  "skills.level": "{name}: {level}% de dominio",

  "portfolio.all": "Todos",
  "portfolio.favorites": "Favoritos",
  "portfolio.filter": "Filtrar proyectos",
  "portfolio.addFavorite": "Agregar {name} a favoritos",
  "portfolio.removeFavorite": "Quitar {name} de favoritos",
  "portfolio.open": "Abrir {name}",
  "portfolio.comingSoon": "Próximamente",
  "portfolio.noFavorites": "Aún no hay favoritos. Toca la ☆ de cualquier proyecto para guardarlo aquí.",

  "viewer.previous": "Proyecto anterior",
  "viewer.next": "Proyecto siguiente",
  "viewer.openOriginal": "Ver en tamaño completo",
  "viewer.position": "{current} de {total}",

  "favorites.empty": "Aún no hay nada guardado.",
  "favorites.hint": "Usa la ☆ de cualquier proyecto del Portafolio para guardarlo aquí.",
  "favorites.browse": "Ver portafolio",

  "sound.toggle": "Efectos de sonido",
  "sound.on": "Efectos de sonido: activados",
  "sound.off": "Efectos de sonido: desactivados",

  "hint.title": "¡Bienvenid@!",
  "hint.body":
    "Haz clic en una carpeta para abrirla. Arrastra las ventanas desde su barra de título, cambia su tamaño desde los bordes y usa la barra de tareas para recuperar las ventanas minimizadas.",
  "hint.dismiss": "Entendido",

  "boot.starting": "Iniciando…",
  "boot.edition": "Edición Portafolio",
  "boot.copyright": "Copyright © {year} {name}",
  "login.begin": "Para comenzar, haz clic en el nombre de usuario",
  "login.loading": "Cargando tu configuración personal…",
  "login.welcome": "bienvenid@",
  "login.loggingOff": "Cerrando sesión…",
  "login.restart": "Reiniciar",
  "login.tip": "Después de iniciar sesión, abre las carpetas del escritorio para explorar mi trabajo.",
  "start.logOff": "Cerrar sesión",
  "menu.emailMe": "Envíame un correo",
  "menu.emailWith": "Escríbeme con {service}",
  "menu.copyEmail": "Copiar dirección de correo",
  "menu.showDesktop": "Mostrar escritorio",
  "menu.resetWindow": "Restablecer tamaño y posición",
  "menu.resetAll": "Borrar todos los datos guardados…",
  "menu.open": "Abrir",
  "toast.emailCopied": "¡Correo copiado!",
  "toast.copyFailed": "No se pudo copiar. La dirección es {email}",
  "toast.layoutReset": "Escritorio restablecido",
  "confirm.resetTitle": "¿Restablecer todo?",
  "confirm.resetMessage":
    "Esto borra tus favoritos, proyectos vistos, la posición de las ventanas y tus ajustes en este dispositivo.",
  "confirm.resetConfirm": "Restablecer",
  "dialog.cancel": "Cancelar",

  "contact.defaultSubject": "¡Hola desde tu portafolio!",
  "contact.cta": "Contáctame",
  "taskbar.email": "Correo",
  "a11y.newTab": "se abre en una pestaña nueva",

  "a11y.skip": "Saltar al contenido",
  "footer.webDev": "Web Dev",
  "footer.design": "Diseño",
  "footer.onGithub": "en GitHub",
};

export const translations: Record<Lang, Record<TranslationKey, string>> = { en, es };
