"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function savePrayerTime(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");

  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const prayerDate = String(formData.get("prayer_date") ?? "");
  const prayerName = String(formData.get("prayer_name") ?? "");
  const prayerTime = String(formData.get("prayer_time") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";
  const validNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Jummah"];

  const [year, month, day] = prayerDate.split("-").map(Number);
  const validCalendarDate = prayerDate.length === 10 && !Number.isNaN(Date.UTC(year, month - 1, day)) &&
    new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) === prayerDate;

  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(prayerDate) || !validCalendarDate ||
      !validNames.includes(prayerName) || !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(prayerTime) || note.length > 200) {
    redirect("/admin/prayer-times?error=validation");
  }

  const { error } = await supabase.from("prayer_times").upsert({
    prayer_date: prayerDate,
    prayer_name: prayerName,
    prayer_time: `${prayerTime}:00`,
    note: note || null,
    is_published: isPublished,
    updated_by: claims.claims.sub,
    updated_at: new Date().toISOString(),
  }, { onConflict: "prayer_date,prayer_name" });

  if (error) redirect("/admin/prayer-times?error=save");

  revalidatePath("/prayer-times");
  revalidatePath("/admin");
  revalidatePath("/admin/prayer-times");
  redirect("/admin/prayer-times?saved=1");
}


export async function deletePrayerTime(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/prayer-times?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");
  const { error } = await supabase.from("prayer_times").delete().eq("id", id);
  if (error) redirect("/admin/prayer-times?error=delete");
  revalidatePath("/prayer-times");
  revalidatePath("/admin");
  revalidatePath("/admin/prayer-times");
  redirect("/admin/prayer-times?deleted=1");
}

export async function updatePrayerTimePublication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isPublished = formData.get("is_published") === "on";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/prayer-times?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");
  const { error } = await supabase.from("prayer_times").update({
    is_published: isPublished,
    updated_by: claims.claims.sub,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) redirect("/admin/prayer-times?error=save");
  revalidatePath("/prayer-times");
  revalidatePath("/admin");
  revalidatePath("/admin/prayer-times");
  redirect("/admin/prayer-times?saved=1");
}


export async function saveDailyPrayerSchedule(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", claims.claims.sub)
    .maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const prayerDate = String(formData.get("prayer_date") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";
  const names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Jummah"];
  const [year, month, day] = prayerDate.split("-").map(Number);
  const utcDate = Date.UTC(year, month - 1, day);
  const validCalendarDate =
    prayerDate.length === 10 &&
    !Number.isNaN(utcDate) &&
    new Date(utcDate).toISOString().slice(0, 10) === prayerDate;

  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(prayerDate) || !validCalendarDate || note.length > 200) {
    redirect("/admin/prayer-times?error=validation");
  }

  const entries = names.flatMap((prayerName) => {
    const value = String(formData.get(prayerName) ?? "");
    if (!value) return [];
    if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      redirect("/admin/prayer-times?error=validation");
    }

    return [{
      prayer_date: prayerDate,
      prayer_name: prayerName,
      prayer_time: `${value}:00`,
      note: note || null,
      is_published: isPublished,
      updated_by: claims.claims.sub,
      updated_at: new Date().toISOString(),
    }];
  });

  if (!entries.length) redirect("/admin/prayer-times?error=empty");

  const { error } = await supabase
    .from("prayer_times")
    .upsert(entries, { onConflict: "prayer_date,prayer_name" });

  if (error) redirect("/admin/prayer-times?error=save");

  revalidatePath("/prayer-times");
  revalidatePath("/admin");
  revalidatePath("/admin/prayer-times");
  redirect("/admin/prayer-times?bulkSaved=1");
}
