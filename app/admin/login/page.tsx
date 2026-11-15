import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Administrator Sign In", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();

  return (
    <main className="admin-screen">
      <section className="admin-card">
        <Link href="/" className="admin-back">← Back to public website</Link>
        <span className="admin-emblem"><LockKeyhole size={22} /></span>
        <span className="eyebrow">Restricted area</span>
        <h1 className="display">Mosque administration</h1>
        <p>Sign in using an administrator account authorized by Masjid Amanah management.</p>
        {supabase ? <LoginForm /> : (
          <div className="admin-notice"><ShieldCheck size={18} /><span>Supabase is not configured yet. Connect a dedicated Masjid Amanah Supabase project before enabling administrator sign-in.</span></div>
        )}
        <p className="form-hint">Public account registration is disabled. Administrator access is assigned manually by an authorized project owner.</p>
      </section>
    </main>
  );
}
