import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { createAnnouncement, deleteAnnouncement, updateAnnouncementStatus } from "./actions";
import { ArrowLeft, Megaphone, Plus, ShieldCheck, Trash2 } from "lucide-react";

export const metadata: Metadata = { title: "Manage Announcements", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ saved?: string; deleted?: string; error?: string }> };

export default async function ManageAnnouncementsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");

  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("id,title,slug,is_published,created_at,published_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const errorText = {
    validation: "Please check the title, summary, and announcement text.",
    slug: "The title must contain at least three letters or numbers.",
    duplicate: "An announcement with a similar title already exists. Change the title and try again.",
    save: "The announcement could not be saved. Check the database setup and try again.",
    delete: "The announcement could not be deleted.",
  }[params.error ?? ""];

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link href="/" className="brand"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link>
        <form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form>
      </header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Content management</span><h1 className="display">Announcements</h1><p>Create and publish mosque-approved public updates.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>

        {params.saved === "1" && <p className="success-message" role="status">Announcement saved successfully.</p>}
        {params.deleted === "1" && <p className="success-message" role="status">Announcement deleted.</p>}
        {errorText && <p className="form-error" role="alert">{errorText}</p>}
        {error && <p className="form-error" role="alert">Unable to load announcements. Confirm the database migration has been applied.</p>}

        <section className="admin-editor">
          <div className="admin-section-heading"><Plus size={18} /><h2>New announcement</h2></div>
          <form action={createAnnouncement} className="admin-form">
            <label htmlFor="title">Title</label><input id="title" name="title" required minLength={3} maxLength={160} placeholder="Announcement title" />
            <label htmlFor="excerpt">Short summary</label><input id="excerpt" name="excerpt" maxLength={400} placeholder="A short description for the public page" />
            <label htmlFor="body">Announcement details</label><textarea id="body" name="body" required minLength={1} maxLength={12000} rows={7} placeholder="Write the approved announcement here." />
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish immediately</label>
            <button className="btn-primary admin-submit" type="submit">Save announcement <ArrowLeft size={15} style={{ transform: "rotate(180deg)" }} /></button>
            <p className="form-hint">Only information approved by authorized mosque representatives should be published.</p>
          </form>
        </section>

        <section className="admin-list-section">
          <div className="admin-section-heading"><Megaphone size={18} /><h2>Recent announcements</h2></div>
          {!announcements?.length ? <p className="admin-empty">No announcements saved yet.</p> : <div className="admin-list">
            {announcements.map((item) => <article className="admin-list-row" key={item.id}>
              <div><strong>{item.title}</strong><span>/{item.slug}</span></div>
              <div className="admin-row-actions">
                <form action={updateAnnouncementStatus} className="inline-status-form">
                  <input type="hidden" name="id" value={item.id} />
                  <label className="inline-checkbox"><input type="checkbox" name="is_published" defaultChecked={item.is_published} /> Publish</label>
                  <button className="small-admin-button" type="submit">Update</button>
                </form>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="icon-danger" type="submit" aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button>
                </form>
              </div>
            </article>)}
          </div>}
        </section>
      </div>
    </main>
  );
}
