"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveDonationMethod(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const label = String(formData.get("label") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const providerDetails = String(formData.get("provider_details") ?? "").trim();
  const verifiedBy = String(formData.get("verified_by") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";
  const confirmsVerification = formData.get("confirm_verified") === "on";

  if (label.length < 2 || label.length > 120 || purpose.length > 500 ||
      instructions.length < 1 || instructions.length > 2000 || providerDetails.length > 2000 ||
      (isPublished && (!confirmsVerification || verifiedBy.length < 2 || verifiedBy.length > 120))) {
    redirect("/admin/donations?error=validation");
  }

  const { error } = await supabase.from("donation_methods").insert({
    label, purpose, instructions, provider_details: providerDetails || null,
    verified_by: isPublished ? verifiedBy : null,
    verified_at: isPublished ? new Date().toISOString() : null,
    is_published: isPublished,
    created_by: claims.claims.sub,
  });
  if (error) redirect("/admin/donations?error=save");

  revalidatePath("/donations");
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
  redirect("/admin/donations?saved=1");
}


export async function updateDonationMethodPublication(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isPublished = formData.get("is_published") === "on";
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/donations?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  if (isPublished) {
    const { data: method } = await supabase.from("donation_methods")
      .select("verified_by,verified_at").eq("id", id).maybeSingle();
    if (!method?.verified_by?.trim() || !method.verified_at) {
      redirect("/admin/donations?error=verification");
    }
  }

  const { error } = await supabase.from("donation_methods").update({ is_published: isPublished }).eq("id", id);
  if (error) redirect("/admin/donations?error=save");
  revalidatePath("/donations");
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
  redirect("/admin/donations?saved=1");
}

export async function deleteDonationMethod(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/donations?error=validation");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { error } = await supabase.from("donation_methods").delete().eq("id", id);
  if (error) redirect("/admin/donations?error=delete");
  revalidatePath("/donations");
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
  redirect("/admin/donations?deleted=1");
}


export async function updateDonationMethod(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/donations?error=validation");

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

  const label = String(formData.get("label") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const providerDetails = String(formData.get("provider_details") ?? "").trim();
  const verifiedBy = String(formData.get("verified_by") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";
  const confirmsVerification = formData.get("confirm_verified") === "on";

  if (
    label.length < 2 ||
    label.length > 120 ||
    purpose.length > 500 ||
    instructions.length < 1 ||
    instructions.length > 2000 ||
    providerDetails.length > 2000 ||
    verifiedBy.length > 120 ||
    (isPublished && (!confirmsVerification || verifiedBy.length < 2))
  ) {
    redirect(`/admin/donations/${id}?error=validation`);
  }

  const { error } = await supabase
    .from("donation_methods")
    .update({
      label,
      purpose,
      instructions,
      provider_details: providerDetails || null,
      verified_by: isPublished ? verifiedBy : null,
      verified_at: isPublished ? new Date().toISOString() : null,
      is_published: isPublished,
    })
    .eq("id", id);

  if (error) redirect(`/admin/donations/${id}?error=save`);

  revalidatePath("/donations");
  revalidatePath("/admin");
  revalidatePath("/admin/donations");
  redirect("/admin/donations?updated=1");
}
