/**
 * Writes the search-engine and social-preview tags into the HTML, and at build
 * time emits one HTML file per page (so `/curriculum` and `/portfolio` get their
 * own title, description and canonical URL before any JavaScript runs), plus
 * `404.html`, `robots.txt` and `sitemap.xml`.
 *
 * Absolute URLs (canonical, og:url, og:image, sitemap) need the site's address:
 * set `SITE_URL` (e.g. https://example.com). On Vercel it defaults to the
 * project's production domain.
 */
import { loadEnv, type Plugin } from "vite";
import { siteConfig } from "../src/config/site";
import { ogImage, pageSeo, seoRole, type PageSeo } from "../src/config/seo";
import { education } from "../src/content/curriculum";
import { TAB_IDS } from "../src/os/types";

const PLACEHOLDER = "<!--seo-->";
const START = "<!--seo:start-->";
const END = "<!--seo:end-->";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Social links that are still placeholders aren't real profiles. */
const realSocialUrls = siteConfig.socials
  .map((social) => social.url)
  .filter((url) => !url.includes("your-handle"));

function resolveSiteUrl(env: Record<string, string>) {
  const explicit = env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return vercel ? `https://${vercel}` : "";
}

function structuredData(siteUrl: string) {
  const home = pageSeo.home;
  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: siteConfig.ownerName,
    alternateName: siteConfig.siteName,
    jobTitle: seoRole.en,
    url: `${siteUrl}/`,
    image: `${siteUrl}${ogImage.path}`,
    knowsLanguage: ["es", "en"],
    alumniOf: education.map((study) => ({
      "@type": "EducationalOrganization",
      name: study.school,
    })),
    ...(realSocialUrls.length > 0 && { sameAs: realSocialUrls }),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: siteConfig.siteName,
        description: home.description.en,
        inLanguage: ["en", "es"],
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: `${siteUrl}/`,
        name: home.title.en,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

function headTags(page: PageSeo, siteUrl: string, options: { home: boolean; noindex?: boolean }) {
  const title = escapeHtml(page.title.en);
  const description = escapeHtml(page.description.en);
  const url = siteUrl && `${siteUrl}${page.path}`;
  const image = siteUrl && `${siteUrl}${ogImage.path}`;
  const imageAlt = escapeHtml(ogImage.alt);

  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="author" content="${escapeHtml(siteConfig.ownerName)}" />`,
    options.noindex && `<meta name="robots" content="noindex" />`,
    url && !options.noindex && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${options.home ? "profile" : "website"}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteConfig.siteName)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="es_MX" />`,
    image && `<meta property="og:image" content="${image}" />`,
    image && `<meta property="og:image:width" content="${ogImage.width}" />`,
    image && `<meta property="og:image:height" content="${ogImage.height}" />`,
    image && `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    image && `<meta name="twitter:image" content="${image}" />`,
    image && `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    options.home &&
      siteUrl &&
      `<script type="application/ld+json">${JSON.stringify(structuredData(siteUrl)).replace(/</g, "\\u003c")}</script>`,
  ];
  return [START, ...tags.filter(Boolean), END].join("\n    ");
}

function withPageTags(html: string, tags: string) {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1) throw new Error("seo: markers missing from index.html");
  return html.slice(0, start) + tags + html.slice(end + END.length);
}

const stripMarkers = (html: string) =>
  html.replace(new RegExp(`\\s*(${START}|${END})`, "g"), "");

function sitemap(siteUrl: string) {
  const urls = TAB_IDS.map(
    (tab) => `  <url>\n    <loc>${siteUrl}${pageSeo[tab].path}</loc>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export function seo(): Plugin {
  let siteUrl = "";

  return {
    name: "site-seo",
    enforce: "post",

    configResolved(config) {
      const envDir = config.envDir === false ? config.root : config.envDir;
      siteUrl = resolveSiteUrl(loadEnv(config.mode, envDir, ""));
      if (config.command === "build" && !siteUrl) {
        config.logger.warn(
          "\n[seo] SITE_URL is not set: building without canonical URLs, og:image or sitemap.xml.",
        );
      }
    },

    transformIndexHtml(html) {
      if (!html.includes(PLACEHOLDER)) throw new Error(`seo: ${PLACEHOLDER} missing from index.html`);
      return html.replace(PLACEHOLDER, headTags(pageSeo.home, siteUrl, { home: true }));
    },

    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") throw new Error("seo: index.html not found in bundle");
      const html = String(index.source);

      index.source = stripMarkers(html);
      for (const tab of TAB_IDS) {
        if (tab === "home") continue;
        this.emitFile({
          type: "asset",
          fileName: `${tab}.html`,
          source: stripMarkers(withPageTags(html, headTags(pageSeo[tab], siteUrl, { home: false }))),
        });
      }
      // Unknown URLs get a real 404 status; the page still loads the desktop.
      this.emitFile({
        type: "asset",
        fileName: "404.html",
        source: stripMarkers(
          withPageTags(html, headTags(pageSeo.home, siteUrl, { home: false, noindex: true })),
        ),
      });

      const robots = ["User-agent: *", "Allow: /"];
      if (siteUrl) robots.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `${robots.join("\n")}\n` });
      if (siteUrl) this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(siteUrl) });
    },
  };
}
