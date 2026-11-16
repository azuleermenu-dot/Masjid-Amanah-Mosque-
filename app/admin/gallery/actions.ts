"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function hasValidImageSignature(file: File): Promise<boolean> {
  // Validate the actual file bytes rather than trusting the browser-provided MIME type.
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (file.type === "image/jpeg") {
    return bytes.length >= 3 &&
      bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (file.type === "image/png") {
    return bytes.length >= 8 &&
      bytes[0] === 0x89 && bytes[1] === 0x50 &&
      bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a &&
      bytes[6] === 0x1a && bytes[7] === 0x0a;
  }

  if (file.type === "image/webp") {
    return bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }

  return false;
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

export async function uploadGalleryItem(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const file = formData.get("image");
  const title = String(formData.get("title") ?? "").trim();
  const altText = String(formData.get("alt_text") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";

  if (!(file instanceof File) || file.size < 1 || file.size > 5 * 1024 * 1024 ||
      !extensions[file.type] || title.length < 2 || title.length > 140 ||
      altText.length < 5 || altText.length > 240 || category.length > 80) {
    redirect("/admin/gallery?error=validation");
  }

  if (!(await hasValidImageSignature(file))) {
    redirect("/admin/gallery?error=validation");
  }

  const path = `${randomUUID()}.${extensions[file.type]}`;
  const { error: uploadError } = await supabase.storage.from("mosque-gallery").upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) redirect("/admin/gallery?error=upload");

  const { error: insertError } = await supabase.from("gallery_items").insert({
    title, image_path: path, alt_text: altText, category: category || null,
    is_published: isPublished, created_by: userId,
  });

  if (insertError) {
    await supabase.storage.from("mosque-gallery").remove([path]);
    redirect("/admin/gallery?error=save");
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  redirect("/admin/gallery?saved=1");
}

export async function deleteGalleryItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/gallery?error=validation");

  const { data: item, error: findError } = await supabase.from("gallery_items").select("image_path").eq("id", id).single();
  if (findError || !item) redirect("/admin/gallery?error=delete");

  const { error: deleteError } = await supabase.from("gallery_items").delete().eq("id", id);
  if (deleteError) redirect("/admin/gallery?error=delete");

  await supabase.storage.from("mosque-gallery").remove([item.image_path]);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  redirect("/admin/gallery?deleted=1");
}
