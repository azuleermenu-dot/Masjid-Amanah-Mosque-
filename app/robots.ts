import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Keep indexing disabled until the mosque confirms the production domain and content.
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
