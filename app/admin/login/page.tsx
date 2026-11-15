import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Administrator Sign In", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="admin-screen">
      <section className="admin-card">
        <Link href="/" className="admin-back">← Back to public website</Link>
        <span className="admin-emblem"><LockKeyhole size={22} /></span>
        <span className="eyebrow">Restricted area</span>
        <h1 className="display">Mosque administration</h1>
        <p>Administrator sign-in will be enabled after the mosque's dedicated Supabase project and authorized administrator accounts are configured.</p>
        <div className="admin-notice"><ShieldCheck size={18} /><span>This area is not accepting sign-ins yet. Public registration is disabled by design.</span></div>
      </section>
    </main>
  );
}
