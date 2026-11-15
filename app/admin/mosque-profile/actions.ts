"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeOptionalUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function updateMosqueProfile(formData: FormData) {
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

  const fields = {
    introduction: String(formData.get("introduction") ?? "").trim(),
    history: String(formData.get("history") ?? "").trim(),
    mission: String(formData.get("mission") ?? "").trim(),
    vision: String(formData.get("vision") ?? "").trim(),
    community_information: String(formData.get("community_information") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    website_url: String(formData.get("website_url") ?? "").trim(),
    map_url: String(formData.get("map_url") ?? "").trim(),
    facebook_url: String(formData.get("facebook_url") ?? "").trim(),
    instagram_url: String(formData.get("instagram_url") ?? "").trim(),
    youtube_url: String(formData.get("youtube_url") ?? "").trim(),
  };

  const facilities = String(formData.get("facilities") ?? "")
    .split("\n")
    .map((facility) => facility.trim())
    .filter(Boolean);

  const limits: Record<string, number> = {
    introduction: 5000, history: 5000, mission: 3000, vision: 3000,
    community_information: 5000, address: 500, phone: 80, email: 254,
    website_url: 2000, map_url: 2000, facebook_url: 2000, instagram_url: 2000, youtube_url: 2000,
  };

  const tooLong = Object.entries(fields).some(([key, value]) => value.length > limits[key]);
  const invalidEmail = fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);
  const invalidUrl = [
    fields.website_url, fields.map_url, fields.facebook_url, fields.instagram_url, fields.youtube_url,
  ].some((value) => !safeOptionalUrl(value));
  const invalidFacilities = facilities.length > 30 || facilities.some((value) => value.length > 120);

  if (tooLong || invalidEmail || invalidUrl || invalidFacilities) {
    redirect("/admin/mosque-profile?error=validation");
  }

  const { error } = await supabase.from("mosque_profile").update({
    ...fields,
    facilities,
    updated_by: claims.claims.sub,
    updated_at: new Date().toISOString(),
  }).eq("id", true);

  if (error) redirect("/admin/mosque-profile?error=save");

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin/mosque-profile");
  redirect("/admin/mosque-profile?saved=1");
}
