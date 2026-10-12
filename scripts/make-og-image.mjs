// Builds the 1200×630 social preview image (public/og-image.png) from the hero art.
// Usage: npm run og-image
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hero = path.join(root, "src/assets/images/hero.webp");
const output = path.join(root, "public/og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

// Desktop wallpaper colors (src/styles/tokens.css) with a soft grid.
const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8b84ff" />
      <stop offset="1" stop-color="#aea6ff" />
    </linearGradient>
    <pattern id="grid" width="94" height="94" patternUnits="userSpaceOnUse">
      <path d="M94 0H0V94" fill="none" stroke="rgb(232,236,255)" stroke-opacity="0.3" stroke-width="2" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  <rect x="150" y="28" width="900" height="574" rx="28" fill="#f7f6ff" stroke="#361dc7" stroke-width="4" />
</svg>`);

const art = await sharp(hero).resize({ height: 560, fit: "inside" }).toBuffer();
const { width: artWidth = 0, height: artHeight = 0 } = await sharp(art).metadata();

await sharp(background)
  .composite([
    {
      input: art,
      left: Math.round((WIDTH - artWidth) / 2),
      top: Math.round((HEIGHT - artHeight) / 2),
    },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(output);

console.log(`  ${path.relative(root, output)}`);
