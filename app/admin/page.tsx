import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main className="admin-screen">
      <section className="admin-card">
        <span className="admin-emblem"><ShieldCheck size={22} /></span>
        <span className="eyebrow">Administration</span>
        <h1 className="display">Content management</h1>
        <p>The secure dashboard is being prepared. Content editing will only be available to accounts explicitly authorized by mosque management.</p>
        <Link href="/admin/login" className="btn-primary">Administrator sign in</Link>
      </section>
    </main>
  );
}
