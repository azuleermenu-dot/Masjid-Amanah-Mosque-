import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import {
  createEvent,
  deleteEvent,
  updateEvent,
  updateEventPublication,
} from "./actions";

export const metadata: Metadata = {
  title: "Manage Events",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    saved?: string;
    updated?: string;
    deleted?: string;
    edit?: string;
    error?: string;
  }>;
};

function toManilaDateTimeInput(value: string | null) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export default async function ManageEventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", claims.claims.sub)
    .maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const [{ data: events, error }, { data: editingEvent }] = await Promise.all([
    supabase
      .from("events")
      .select("id,title,description,venue,starts_at,ends_at,is_published")
      .order("starts_at", { ascending: false })
      .limit(100),
    params.edit && /^[0-9a-f-]{36}$/i.test(params.edit)
      ? supabase
          .from("events")
          .select("id,title,description,venue,starts_at,ends_at,is_published")
          .eq("id", params.edit)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const formError =
    params.error === "validation"
      ? "Check the event title, description, venue, and Philippines date/time values."
      : params.error
        ? "The event could not be saved. Check the database setup and permissions."
        : null;

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">۞</span>
          <span className="brand-copy">
            <strong>MASJID AMANAH</strong>
            <span className="arabic" lang="ar">مسجد الأمانة</span>
          </span>
        </Link>
        <form action={signOutAdmin}>
          <button className="admin-signout" type="submit">Sign out</button>
        </form>
      </header>

      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back">
          <ArrowLeft size={14} /> Dashboard
        </Link>

        <div className="admin-title-row">
          <div>
            <span className="eyebrow">Community calendar</span>
            <h1 className="display">Events</h1>
            <p>Add and maintain confirmed mosque classes, gatherings, and activities.</p>
          </div>
          <span className="status-pill">
            <ShieldCheck size={14} /> Authorized administrator
          </span>
        </div>

        {params.saved === "1" && <p className="success-message" role="status">Event created successfully.</p>}
        {params.updated === "1" && <p className="success-message" role="status">Event changes saved.</p>}
        {params.deleted === "1" && <p className="success-message" role="status">Event deleted.</p>}
        {formError && <p className="form-error" role="alert">{formError}</p>}

        <section className="admin-editor">
          <div className="admin-section-heading">
            {editingEvent ? <Pencil size={18} /> : <CalendarDays size={18} />}
            <h2>{editingEvent ? "Edit event" : "New event"}</h2>
          </div>

          {editingEvent ? (
            <form action={updateEvent} className="admin-form">
              <input type="hidden" name="id" value={editingEvent.id} />
              <label htmlFor="title">Event title</label>
              <input id="title" name="title" required minLength={3} maxLength={160} defaultValue={editingEvent.title} />

              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={5} maxLength={8000} defaultValue={editingEvent.description ?? ""} />

              <label htmlFor="venue">Venue (optional)</label>
              <input id="venue" name="venue" maxLength={200} defaultValue={editingEvent.venue ?? ""} />

              <label htmlFor="starts_at">Starts at · Philippine time (UTC+8)</label>
              <input id="starts_at" name="starts_at" type="datetime-local" required defaultValue={toManilaDateTimeInput(editingEvent.starts_at)} />

              <label htmlFor="ends_at">Ends at · optional · Philippine time</label>
              <input id="ends_at" name="ends_at" type="datetime-local" defaultValue={toManilaDateTimeInput(editingEvent.ends_at)} />

              <label className="checkbox-label">
                <input type="checkbox" name="is_published" defaultChecked={editingEvent.is_published} />
                Publish this event
              </label>

              <div className="admin-form-actions">
                <button className="btn-primary admin-submit" type="submit">Save changes</button>
                <Link className="admin-cancel-link" href="/admin/events">Cancel editing</Link>
              </div>
            </form>
          ) : (
            <form action={createEvent} className="admin-form">
              <label htmlFor="title">Event title</label>
              <input id="title" name="title" required minLength={3} maxLength={160} />

              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={5} maxLength={8000} />

              <label htmlFor="venue">Venue (optional)</label>
              <input id="venue" name="venue" maxLength={200} />

              <label htmlFor="starts_at">Starts at · Philippine time (UTC+8)</label>
              <input id="starts_at" name="starts_at" type="datetime-local" required />

              <label htmlFor="ends_at">Ends at · optional · Philippine time</label>
              <input id="ends_at" name="ends_at" type="datetime-local" />

              <label className="checkbox-label">
                <input type="checkbox" name="is_published" />
                Publish immediately
              </label>

              <button className="btn-primary admin-submit" type="submit">Save event</button>
            </form>
          )}

          <p className="form-hint">
            Use confirmed details only. Date and time entries are interpreted as Philippine local time (UTC+8).
          </p>
        </section>

        <section className="admin-list-section">
          <div className="admin-section-heading">
            <CalendarDays size={18} />
            <h2>Saved events</h2>
          </div>

          {error ? (
            <p className="form-error">Unable to load events. Check the Supabase migration.</p>
          ) : !events?.length ? (
            <p className="admin-empty">No events have been saved.</p>
          ) : (
            <div className="admin-list">
              {events.map((event) => (
                <article className="admin-list-row" key={event.id}>
                  <div>
                    <strong>{event.title}</strong>
                    <span>
                      {new Intl.DateTimeFormat("en-PH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Manila",
                      }).format(new Date(event.starts_at))}
                      {event.venue ? ` · ${event.venue}` : ""}
                    </span>
                  </div>

                  <div className="admin-row-actions">
                    <Link
                      href={`/admin/events?edit=${event.id}`}
                      className="small-admin-button edit-admin-link"
                      aria-label={`Edit ${event.title}`}
                    >
                      <Pencil size={13} /> Edit
                    </Link>

                    <form action={updateEventPublication} className="inline-status-form">
                      <input type="hidden" name="id" value={event.id} />
                      <label className="inline-checkbox">
                        <input type="checkbox" name="is_published" defaultChecked={event.is_published} />
                        Publish
                      </label>
                      <button className="small-admin-button" type="submit">Update</button>
                    </form>

                    <form action={deleteEvent}>
                      <input type="hidden" name="id" value={event.id} />
                      <button className="icon-danger" type="submit" aria-label={`Delete ${event.title}`}>
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
