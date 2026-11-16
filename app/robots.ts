import type { MetadataRoute } from "next";

function getApprovedSiteUrl() {
  if (process.env.PUBLIC_CONTENT_APPROVED !== "true") return null;

  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getApprovedSiteUrl();

  if (!siteUrl) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl.origin}/sitemap.xml`,
  };
}
