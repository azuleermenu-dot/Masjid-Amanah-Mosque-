"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireMadrasahAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin");

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) redirect("/admin");
  return { supabase, userId };
}

function requiredText(formData: FormData, key: string, max: number) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value || value.length > max) throw new Error(`Invalid ${key.replaceAll("_", " ")}.`);
  return value;
}

export async function createMadrasahProgram(formData: FormData) {
  const { supabase, userId } = await requireMadrasahAdmin();
  const title = requiredText(formData, "title", 120);
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  const ageGuidance = String(formData.get("age_guidance") ?? "").trim().slice(0, 120);
  const isPublished = formData.get("is_published") === "on";

  const { error } = await supabase.from("madrasah_programs").insert({
    title,
    description,
    age_guidance: ageGuidance,
    is_published: isPublished,
    created_by: userId,
  });
  if (error) throw new Error("The program could not be saved. Check that the Madrasah migration has been applied.");
  revalidatePath("/education");
  revalidatePath("/admin/madrasah");
}

export async function createMadrasahGraduate(formData: FormData) {
  const { supabase, userId } = await requireMadrasahAdmin();
  const graduateName = requiredText(formData, "graduate_name", 160);
  const programLabel = requiredText(formData, "program_label", 120);
  const yearText = requiredText(formData, "completion_year", 4);
  const completionYear = Number(yearText);
  if (!Number.isInteger(completionYear) || completionYear < 1900 || completionYear > 2200) {
    throw new Error("Enter a valid completion year.");
  }

  const publicationConsentRecorded = formData.get("publication_consent_recorded") === "on";
  const approvedForPublication = formData.get("approved_for_publication") === "on";
  const isPublished = formData.get("is_published") === "on";
  if (isPublished && (!publicationConsentRecorded || !approvedForPublication)) {
    throw new Error("Public listing requires recorded consent and administrator approval.");
  }

  const distinction = String(formData.get("distinction") ?? "").trim().slice(0, 160);
  const { error } = await supabase.from("madrasah_public_graduates").insert({
    graduate_name: graduateName,
    program_label: programLabel,
    completion_year: completionYear,
    distinction,
    publication_consent_recorded: publicationConsentRecorded,
    approved_for_publication: approvedForPublication,
    is_published: isPublished,
    created_by: userId,
  });
  if (error) throw new Error("The graduate record could not be saved. Check the migration and the publication requirements.");
  revalidatePath("/education");
  revalidatePath("/admin/madrasah");
}

export async function deleteMadrasahProgram(formData: FormData) {
  const { supabase } = await requireMadrasahAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid program record.");
  const { error } = await supabase.from("madrasah_programs").delete().eq("id", id);
  if (error) throw new Error("The program could not be deleted.");
  revalidatePath("/education");
  revalidatePath("/admin/madrasah");
}

export async function deleteMadrasahGraduate(formData: FormData) {
  const { supabase } = await requireMadrasahAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid graduate record.");
  const { error } = await supabase.from("madrasah_public_graduates").delete().eq("id", id);
  if (error) throw new Error("The graduate record could not be deleted.");
  revalidatePath("/education");
  revalidatePath("/admin/madrasah");
}
