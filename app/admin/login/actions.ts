"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null };

export async function signInAdmin(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid administrator email address." };
  }
  if (password.length < 8 || password.length > 200) {
    return { error: "Enter your password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Administrator access is not configured yet." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Unable to sign in. Check your credentials or contact the mosque's website administrator." };

  redirect("/admin");
}
