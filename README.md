# Vere L Patlan · Portfolio

A pastel, retro-desktop portfolio for Verenice López. Folders open windows that can be
dragged (even out of maximized mode), resized, minimized to the taskbar (with hover previews)
and maximized. It also has a search in the taskbar, right-click quick actions, Contact links
that open a new email in Gmail or Outlook, and retro sound effects. Built with React 19, Vite and TypeScript, and deployed on Vercel.

## Getting started

Requires Node.js `^20.19` or `>=22.12`.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
npm run lint
```

## Deploying to Vercel

Import the repository in Vercel. It detects Vite automatically, and `vercel.json`
already sets the build command, output directory, SPA rewrites (so `/portfolio` and the other
page URLs work on refresh) and long-term caching for hashed assets. Each push to
`main` deploys to production, and other branches get preview URLs.

## Editing content

| What | Where |
| --- | --- |
| Contact email & webmail service (`gmail` / `outlook`), social links, credits, names, storage prefix | `src/config/site.ts` |
| Portfolio projects & categories | `src/content/portfolio.ts` |
| Curriculum (experience, education, courses, languages) | `src/content/curriculum.ts` |
| Software skills & levels | `src/content/skills.ts` |
| About text, hero & profile images | `src/content/about.ts` |
| UI text (English / Spanish) | `src/i18n/translations.ts` |
| Default window positions & sizes | `src/os/windowConfig.ts` |
| Sound effects (notes, volume) | `src/sound/sound.ts` |

### Adding a portfolio image

`Images/` holds the original artwork and is ignored by git. Only the optimized copies in
`src/assets/images/` are committed, so keep your originals backed up elsewhere.

1. Put the original file in `Images/`.
2. Add an entry to `scripts/images.json` (`source` file name and output `name`).
3. Run `npm run images` to generate optimized WebP files (full size and thumbnail) in
   `src/assets/images/`.
4. Import them in `src/content/portfolio.ts` and add the project. If a project has no
   `image`, it shows a "coming soon" tile.

## How it's organized

```
src/
  config/       site-wide settings (links, names…)
  content/      portfolio, CV, skills and about data
  i18n/         EN/ES translations + provider
  os/           window manager: state reducer, persistence, layout rules
  sound/        synthesized retro sound effects (Web Audio, no audio files)
  hooks/        drag/resize, localStorage, media queries…
  components/
    window/     reusable <Window> (drag, resize, minimize, maximize, animations)
    browser/    main browser window: tabs, search bar, credits
    pages/      Home, Curriculum, Portfolio tab contents
    apps/       Profile, About, Skills, Favorites, Image viewer
    portfolio/  project sections & cards
    search/     search box (browser address bar & taskbar)
    overlays/   right-click menus, toasts and confirm dialogs
    desktop/    desktop, folder icons, welcome hint
    taskbar/    taskbar, start menu, clock, language toggle
    ui/         icons, buttons, panels, progress bars
```

All state lives in `localStorage` under the `vere-os:v1:` prefix: window layout, active tab,
favorites, recently viewed projects, language, sound on/off, collapsed portfolio sections
and the dismissed welcome tip. Visitors can wipe it all from
the start menu or the desktop's right-click menu ("Reset all saved data…"). Bump `storagePrefix` in `src/config/site.ts` to reset every visitor's
saved state.
