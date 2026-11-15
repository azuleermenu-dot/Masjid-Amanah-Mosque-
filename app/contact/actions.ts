"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContactFormState = {
  success: boolean;
  message: string | null;
  fieldErrors?: {
    fullName?: string;
    email?: string;
    message?: string;
  };
};

const initialState: ContactFormState = { success: false, message: null };

export async function submitContactInquiry(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("company_website") ?? "");
  const token = String(formData.get("cf-turnstile-response") ?? "");

  // Quietly accept honeypot submissions without storing them.
  if (honeypot) {
    return { success: true, message: "Thank you. Your message has been received." };
  }

  const fieldErrors: NonNullable<ContactFormState["fieldErrors"]> = {};
  if (fullName.length < 2 || fullName.length > 100) {
    fieldErrors.fullName = "Enter a name between 2 and 100 characters.";
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (message.length < 10 || message.length > 4000) {
    fieldErrors.message = "Your message must be between 10 and 4,000 characters.";
  }
  if (Object.keys(fieldErrors).length) {
    return { success: false, message: "Please review the highlighted fields.", fieldErrors };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const allowedHostnames = (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

  if (!secret || !allowedHostnames.length) {
    return { success: false, message: "The secure message form is not configured yet. Please try again later." };
  }

  if (!token || token.length > 2048) {
    return { success: false, message: "Complete the security verification and try again." };
  }

  try {
    const verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret,
          response: token,
          idempotency_key: randomUUID(),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!verificationResponse.ok) {
      return { success: false, message: "Security verification is temporarily unavailable. Please try again later." };
    }

    const verification = await verificationResponse.json() as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };

    const verifiedHostname = verification.hostname?.toLowerCase() ?? "";
    if (
      verification.success !== true ||
      verification.action !== "contact" ||
      !allowedHostnames.includes(verifiedHostname)
    ) {
      return { success: false, message: "Security verification failed. Please complete it again." };
    }
  } catch {
    return { success: false, message: "Security verification is temporarily unavailable. Please try again later." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { success: false, message: "The message service is not connected yet. Please try again later." };
  }

  const { error } = await supabase.from("contact_inquiries").insert({
    full_name: fullName,
    email,
    message,
  });

  if (error) {
    return { success: false, message: "Your message could not be sent. Please try again later." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");

  return {
    ...initialState,
    success: true,
    message: "Thank you. Your message has been sent to the mosque's administration inbox.",
  };
}
