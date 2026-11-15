import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, ShieldCheck, Trash2 } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { createEvent, deleteEvent } from "./actions";

export const metadata: Metadata = { title: "Manage Events", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; deleted?: string; error?: string }> };

export default async function ManageEventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: events, error } = await supabase.from("events")
    .select("id,title,venue,starts_at,ends_at,is_published")
    .order("starts_at", { ascending: false }).limit(100);

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link>
        <form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form>
      </header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Community calendar</span><h1 className="display">Events</h1><p>Add confirmed mosque classes, gatherings, and community activities.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>

        {params.saved === "1" && <p className="success-message" role="status">Event saved successfully.</p>}
        {params.deleted === "1" && <p className="success-message" role="status">Event deleted.</p>}
        {params.error && <p className="form-error" role="alert">{params.error === "validation" ? "Check the event title, description, venue, and Philippines date/time values." : "The event could not be saved or deleted. Check database setup and permissions."}</p>}

        <section className="admin-editor">
          <div className="admin-section-heading"><CalendarDays size={18} /><h2>New event</h2></div>
          <form action={createEvent} className="admin-form">
            <label htmlFor="title">Event title</label><input id="title" name="title" required minLength={3} maxLength={160} />
            <label htmlFor="description">Description</label><textarea id="description" name="description" rows={5} maxLength={8000} />
            <label htmlFor="venue">Venue (optional)</label><input id="venue" name="venue" maxLength={200} />
            <label htmlFor="starts_at">Starts at · Philippine time (UTC+8)</label><input id="starts_at" name="starts_at" type="datetime-local" required />
            <label htmlFor="ends_at">Ends at · optional · Philippine time</label><input id="ends_at" name="ends_at" type="datetime-local" />
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish immediately</label>
            <button className="btn-primary admin-submit" type="submit">Save event</button>
          </form>
        </section>

        <section className="admin-list-section">
          <div className="admin-section-heading"><CalendarDays size={18} /><h2>Saved events</h2></div>
          {error ? <p className="form-error">Unable to load events. Check the Supabase migration.</p> : !events?.length ? <p className="admin-empty">No events have been saved.</p> : <div className="admin-list">
            {events.map((event) => <article className="admin-list-row" key={event.id}>
              <div><strong>{event.title}</strong><span>{new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(event.starts_at))}{event.venue ? ` · ${event.venue}` : ""}</span></div>
              <div className="admin-row-actions"><span className={event.is_published ? "published-badge" : "draft-badge"}>{event.is_published ? "Published" : "Draft"}</span><form action={deleteEvent}><input type="hidden" name="id" value={event.id} /><button className="icon-danger" type="submit" aria-label={`Delete ${event.title}`}><Trash2 size={15} /></button></form></div>
            </article>)}
          </div>}
        </section>
      </div>
    </main>
  );
}
