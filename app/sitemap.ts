import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 3600;

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

function getApprovedSiteBase() {
  if (process.env.PUBLIC_CONTENT_APPROVED !== "true") return null;

  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
    if (url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getApprovedSiteBase();

  // Do not advertise an unverified domain or unapproved pages to search engines.
  if (!base) return [];

  const staticEntries: MetadataRoute.Sitemap = publicPages.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const supabase = await createSupabaseServerClient();
  if (!supabase) return staticEntries;

  const [{ data: announcements }, { data: learningResources }] = await Promise.all([
    supabase
      .from("announcements")
      .select("slug,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(500),
    supabase
      .from("learning_resources")
      .select("id,updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(500),
  ]);

  const announcementEntries: MetadataRoute.Sitemap = (announcements ?? []).map((item) => ({
    url: `${base}/news/${encodeURIComponent(item.slug)}`,
    lastModified: item.published_at ? new Date(item.published_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const learningEntries: MetadataRoute.Sitemap = (learningResources ?? []).map((item) => ({
    url: `${base}/learning/${item.id}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : undefined,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticEntries, ...announcementEntries, ...learningEntries];
}
