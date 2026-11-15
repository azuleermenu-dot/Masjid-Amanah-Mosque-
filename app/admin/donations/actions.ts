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
