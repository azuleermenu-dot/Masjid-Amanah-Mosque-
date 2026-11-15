import type { MetadataRoute } from "next";

const publicPages = [
  "",
  "/about",
  "/prayer-times",
  "/programs",
  "/learning",
  "/news",
  "/gallery",
  "/donations",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const approved = process.env.PUBLIC_CONTENT_APPROVED === "true";

  // Do not advertise an unverified or placeholder production URL to search engines.
  if (!siteUrl || !approved) return [];

  const base = siteUrl.replace(/\/$/, "");
  return publicPages.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
