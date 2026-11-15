import type { Metadata } from "next";
import { BookOpen, Users, CalendarDays, MoonStar, CalendarPlus } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Programs & Activities" };

const categories = [
  { icon: BookOpen, title: "Qur'an & learning", text: "Details of classes and learning sessions will be added when confirmed." },
  { icon: Users, title: "Community programs", text: "Community services and activities will be listed with approved details." },
  { icon: CalendarDays, title: "Events & gatherings", text: "Confirmed dates, times, and registration details will be published here." },
  { icon: MoonStar, title: "Ramadan & Eid", text: "Seasonal announcements will be shared by the mosque." },
];

export default async function ProgramsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: events, error } = supabase
    ? await supabase.from("events").select("id,title,description,venue,starts_at,ends_at").eq("is_published", true).gte("starts_at", new Date().toISOString()).order("starts_at", { ascending: true }).limit(20)
    : { data: null, error: null };

  return (
    <PageShell eyebrow="Community · المجتمع" title="Come together, learn, and grow." description="Explore the mosque's classes, events, and community activities.">
      <div className="feature-grid">{categories.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><Icon size={23} /><h2>{title}</h2><p>{text}</p></article>)}</div>
      <div className="event-section">
        <div className="event-section-heading">
          <div><span className="eyebrow">Upcoming events</span><h2 className="display">Gatherings at Masjid Amanah.</h2></div>
          {events?.length ? <a className="calendar-download" href="/api/events/calendar"><CalendarPlus size={15} /> Add to calendar</a> : null}
        </div>
        {events?.length ? <div className="event-list">{events.map((event) => <article className="event-row" key={event.id}>
          <div><strong>{event.title}</strong><p>{event.description}</p>{event.venue && <small>{event.venue}</small>}</div>
          <time dateTime={event.starts_at}>{new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(event.starts_at))}</time>
        </article>)}</div> : <p className="subtle-copy">{error ? "The events feed could not be loaded." : "No upcoming events have been published yet."}</p>}
      </div>
      {!supabase && <PendingPanel title="Live programs are not connected yet." description="Published mosque activities will appear here after the dedicated content database is configured." />}
    </PageShell>
  );
}
