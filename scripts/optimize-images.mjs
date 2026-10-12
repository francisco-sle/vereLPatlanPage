// Converts the original artwork in Images/ into web-friendly WebP files.
// Usage: npm run images   (configure entries in scripts/images.json)
import { readFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "Images");
const outDir = path.join(root, "src/assets/images");

const DEFAULT_FULL = 1800;
const DEFAULT_THUMB = 440;

const { images } = JSON.parse(
  await readFile(path.join(root, "scripts/images.json"), "utf8"),
);

await mkdir(outDir, { recursive: true });

const encode = async (input, maxSize, output, quality) => {
  await sharp(input)
    .rotate()
    .toColorspace("srgb")
    .resize(maxSize, maxSize, { fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);
  const { size } = await stat(output);
  console.log(`  ${path.relative(root, output)} (${Math.round(size / 1024)} KB)`);
};

for (const entry of images) {
  const input = path.join(sourceDir, entry.source);
  console.log(entry.source);
  await encode(input, entry.full ?? DEFAULT_FULL, path.join(outDir, `${entry.name}.webp`), 84);
  if (entry.thumb !== false) {
    await encode(
      input,
      entry.thumb ?? DEFAULT_THUMB,
      path.join(outDir, `${entry.name}-thumb.webp`),
      80,
    );
  }
}
