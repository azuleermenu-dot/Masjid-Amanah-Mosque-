import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FilePenLine, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { updateAnnouncement } from "../actions";

export const metadata: Metadata = { title: "Edit Announcement", robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditAnnouncementPage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: announcement, error } = await supabase
    .from("announcements")
    .select("id,title,slug,excerpt,body,is_published,published_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !announcement) notFound();

  const messages: Record<string, string> = {
    validation: "Check the title, summary, and announcement text.",
    slug: "The title must contain at least three letters or numbers.",
    duplicate: "Another announcement already uses a similar title. Choose a different title.",
    save: "The announcement could not be updated. Check the database setup and try again.",
  };

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link>
        <form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form>
      </header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin/announcements" className="admin-back"><ArrowLeft size={14} /> Announcements</Link>
        <div className="admin-title-row">
          <div><span className="eyebrow">Content editing</span><h1 className="display">Edit announcement</h1><p>Update wording, publication status, and the public announcement URL.</p></div>
          <span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span>
        </div>
        {query.error && <p className="form-error" role="alert">{messages[query.error] ?? "The request could not be completed."}</p>}
        <section className="admin-editor">
          <div className="admin-section-heading"><FilePenLine size={18} /><h2>{announcement.title}</h2></div>
          <form action={updateAnnouncement} className="admin-form">
            <input type="hidden" name="id" value={announcement.id} />
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required minLength={3} maxLength={160} defaultValue={announcement.title} />
            <label htmlFor="excerpt">Short summary</label>
            <input id="excerpt" name="excerpt" maxLength={400} defaultValue={announcement.excerpt} />
            <label htmlFor="body">Announcement details</label>
            <textarea id="body" name="body" rows={10} required maxLength={12000} defaultValue={announcement.body} />
            <label className="checkbox-label"><input type="checkbox" name="is_published" defaultChecked={announcement.is_published} /> Publish this announcement</label>
            <button className="btn-primary admin-submit" type="submit">Save changes</button>
            <p className="form-hint">The published date is preserved when an already published announcement is edited. Unpublishing removes it from the public feed and sitemap.</p>
          </form>
        </section>
      </div>
    </main>
  );
}
