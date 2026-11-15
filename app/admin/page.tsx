import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CalendarDays, Images, Megaphone, MoonStar, ShieldCheck, BookOpen, Mail, LockKeyhole } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "./actions";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <main className="admin-screen">
        <section className="admin-card">
          <span className="admin-emblem"><LockKeyhole size={22} /></span>
          <span className="eyebrow">Administration setup</span>
          <h1 className="display">Content management</h1>
          <p>The secure dashboard is not connected yet. A dedicated Masjid Amanah Supabase project and its database migration are required before administrator access can be enabled.</p>
          <Link href="/admin/login" className="btn-primary">Administrator sign in</Link>
          <p className="form-hint"><Link href="/">Return to the public website</Link></p>
        </section>
      </main>
    );
  }

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("role,display_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !admin) {
    return (
      <main className="admin-screen">
        <section className="admin-card">
          <span className="admin-emblem"><ShieldCheck size={22} /></span>
          <span className="eyebrow">Access restricted</span>
          <h1 className="display">Administrator access required.</h1>
          <p>This account is authenticated but is not listed as an authorized Masjid Amanah administrator. Contact the mosque's approved website owner.</p>
          <form action={signOutAdmin}><button className="btn-primary admin-submit" type="submit">Sign out</button></form>
        </section>
      </main>
    );
  }

  const [announcements, events, prayerTimes, resources, gallery, inquiries] = await Promise.all([
    supabase.from("announcements").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("prayer_times").select("id", { count: "exact", head: true }),
    supabase.from("learning_resources").select("id", { count: "exact", head: true }),
    supabase.from("gallery_items").select("id", { count: "exact", head: true }),
    supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const stats = [
    { label: "Announcements", count: announcements.count, icon: Megaphone },
    { label: "Events", count: events.count, icon: CalendarDays },
    { label: "Prayer entries", count: prayerTimes.count, icon: MoonStar },
    { label: "Learning resources", count: resources.count, icon: BookOpen },
    { label: "Gallery items", count: gallery.count, icon: Images },
    { label: "New inquiries", count: inquiries.count, icon: Mail },
  ];

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link>
        <form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form>
      </header>
      <div className="admin-dashboard-wrap">
        <div className="admin-title-row">
          <div><span className="eyebrow">Secure administration</span><h1 className="display">Welcome{admin.display_name ? `, ${admin.display_name}` : ""}.</h1><p>Manage public information approved by mosque representatives.</p></div>
          <span className="status-pill"><ShieldCheck size={14} /> {admin.role} access</span>
        </div>

        <div className="admin-stats">
          {stats.map(({ label, count, icon: Icon }) => <article className="admin-stat" key={label}><Icon size={19} /><span>{label}</span><strong>{count ?? "—"}</strong></article>)}
        </div>

        <section className="admin-module">
          <div><span className="eyebrow">Content publishing</span><h2>Announcements</h2><p>Create, save, and publish official mosque updates.</p></div>
          <Link href="/admin/announcements" className="btn-primary">Manage announcements <ArrowUpRight size={14} /></Link>
        </section>

        <div className="admin-security-note"><ShieldCheck size={18} /><p>Content permissions are enforced by Supabase Row Level Security. Only user IDs explicitly listed in the admin_users table can manage mosque content.</p></div>
      </div>
    </main>
  );
}
