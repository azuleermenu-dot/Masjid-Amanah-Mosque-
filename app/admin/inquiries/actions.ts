"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateInquiryStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["new", "in_progress", "resolved", "spam"].includes(status)) {
    redirect("/admin/inquiries?error=validation");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { error } = await supabase.from("contact_inquiries").update({ status }).eq("id", id);
  if (error) redirect("/admin/inquiries?error=save");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  redirect("/admin/inquiries?saved=1");
}
