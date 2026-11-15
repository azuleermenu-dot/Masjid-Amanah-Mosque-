import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const approved = process.env.PUBLIC_CONTENT_APPROVED === "true" && Boolean(siteUrl);

  if (!approved) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl!.replace(/\/$/, "")}/sitemap.xml`,
  };
}
