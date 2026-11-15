"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 170);
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");
  return { supabase, userId: claims.claims.sub };
}

export async function createAnnouncement(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
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
    created_by: userId,
  });

  if (error) redirect(error.code === "23505" ? "/admin/announcements?error=duplicate" : "/admin/announcements?error=save");
  revalidatePath("/news");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements?saved=1");
}

export async function updateAnnouncementStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isPublished = formData.get("is_published") === "on";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/announcements?error=validation");

  const { error } = await supabase.from("announcements").update({
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  }).eq("id", id);

  if (error) redirect("/admin/announcements?error=save");
  revalidatePath("/news");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements?saved=1");
}

export async function deleteAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/announcements?error=validation");

  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) redirect("/admin/announcements?error=delete");
  revalidatePath("/news");
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements?deleted=1");
}


export async function updateAnnouncement(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";

  if (!/^[0-9a-f-]{36}$/i.test(id) || title.length < 3 || title.length > 160 ||
      excerpt.length > 400 || body.length < 1 || body.length > 12000) {
    redirect(`/admin/announcements/${id}?error=validation`);
  }

  const slug = slugify(title);
  if (slug.length < 3) redirect(`/admin/announcements/${id}?error=slug`);

  const { data: current, error: currentError } = await supabase
    .from("announcements")
    .select("slug,published_at")
    .eq("id", id)
    .maybeSingle();
  if (currentError || !current) redirect("/admin/announcements?error=save");

  const publishedAt = isPublished ? current.published_at ?? new Date().toISOString() : null;
  const { error } = await supabase.from("announcements").update({
    title,
    slug,
    excerpt,
    body,
    is_published: isPublished,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) {
    const reason = error.code === "23505" ? "duplicate" : "save";
    redirect(`/admin/announcements/${id}?error=${reason}`);
  }

  revalidatePath("/news");
  revalidatePath(`/news/${current.slug}`);
  revalidatePath(`/news/${slug}`);
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements?saved=1");
}
