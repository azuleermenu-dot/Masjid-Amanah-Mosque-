"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveLearningResource(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const title = String(formData.get("title") ?? "").trim();
  const resourceType = String(formData.get("resource_type") ?? "");
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const sourceReference = String(formData.get("source_reference") ?? "").trim();
  const externalUrl = String(formData.get("external_url") ?? "").trim();
  const reviewedBy = String(formData.get("reviewed_by") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";
  const validTypes = ["quran", "hadith", "article", "external"];

  let safeUrl: string | null = null;
  if (externalUrl) {
    try {
      const parsed = new URL(externalUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Unsupported URL protocol");
      safeUrl = parsed.toString();
    } catch {
      redirect("/admin/learning?error=url");
    }
  }

  if (title.length < 3 || title.length > 180 || !validTypes.includes(resourceType) ||
      summary.length > 500 || body.length > 12000 || sourceReference.length > 300 ||
      ((resourceType === "quran" || resourceType === "hadith") && sourceReference.length < 2) ||
      (isPublished && reviewedBy.length < 2)) {
    redirect("/admin/learning?error=validation");
  }

  const { error } = await supabase.from("learning_resources").insert({
    title, resource_type: resourceType, summary, body: body || null,
    source_reference: sourceReference || null, external_url: safeUrl,
    reviewed_by: isPublished ? reviewedBy : reviewedBy || null,
    is_published: isPublished, created_by: claims.claims.sub,
  });
  if (error) redirect("/admin/learning?error=save");

  revalidatePath("/learning");
  revalidatePath("/admin");
  revalidatePath("/admin/learning");
  redirect("/admin/learning?saved=1");
}


export async function updateLearningResourcePublication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isPublished = formData.get("is_published") === "on";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/learning?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  if (isPublished) {
    const { data: resource } = await supabase.from("learning_resources")
      .select("resource_type,source_reference,reviewed_by").eq("id", id).maybeSingle();
    if (!resource || !resource.reviewed_by?.trim() ||
        (["quran", "hadith"].includes(resource.resource_type) && !resource.source_reference?.trim())) {
      redirect("/admin/learning?error=review");
    }
  }

  const { error } = await supabase.from("learning_resources").update({
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) redirect("/admin/learning?error=save");
  revalidatePath("/learning");
  revalidatePath("/admin");
  revalidatePath("/admin/learning");
  redirect("/admin/learning?saved=1");
}

export async function deleteLearningResource(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/learning?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { error } = await supabase.from("learning_resources").delete().eq("id", id);
  if (error) redirect("/admin/learning?error=delete");
  revalidatePath("/learning");
  revalidatePath("/admin");
  revalidatePath("/admin/learning");
  redirect("/admin/learning?deleted=1");
}
