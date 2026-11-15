"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 170);
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");

  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";

  if (title.length < 3 || title.length > 160 || excerpt.length > 400 || body.length < 1 || body.length > 12000) {
    redirect("/admin/announcements?error=validation");
  }

  const slug = slugify(title);
  if (slug.length < 3) redirect("/admin/announcements?error=slug");

  const { error } = await supabase.from("announcements").insert({
    title, slug, excerpt, body, is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    created_by: claims.claims.sub,
  });

  if (error) {
    redirect(error.code === "23505" ? "/admin/announcements?error=duplicate" : "/admin/announcements?error=save");
  }

  revalidatePath("/news");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements?saved=1");
}
