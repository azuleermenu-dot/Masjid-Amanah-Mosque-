"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toPhilippinesIso(value: string): string | null {
  if (!/^\\d{4}-\\d{2}-\\d{2}T([01]\\d|2[0-3]):[0-5]\\d$/.test(value)) return null;
  const date = new Date(`${value}:00+08:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function createEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const startsAt = toPhilippinesIso(String(formData.get("starts_at") ?? ""));
  const endsInput = String(formData.get("ends_at") ?? "");
  const endsAt = endsInput ? toPhilippinesIso(endsInput) : null;
  const isPublished = formData.get("is_published") === "on";

  if (title.length < 3 || title.length > 160 || description.length > 8000 || venue.length > 200 ||
      !startsAt || (endsInput && !endsAt) || (endsAt && new Date(endsAt) < new Date(startsAt))) {
    redirect("/admin/events?error=validation");
  }

  const { error } = await supabase.from("events").insert({
    title, description, venue: venue || null, starts_at: startsAt, ends_at: endsAt,
    is_published: isPublished, created_by: claims.claims.sub,
  });
  if (error) redirect("/admin/events?error=save");

  revalidatePath("/programs");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  redirect("/admin/events?saved=1");
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/events?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) redirect("/admin/events?error=delete");
  revalidatePath("/programs");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  redirect("/admin/events?deleted=1");
}
