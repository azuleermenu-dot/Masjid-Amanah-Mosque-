import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { PrayerTimesBoard } from "@/components/prayer-times-board";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Prayer Times" };

function getManilaDate() {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export default async function PrayerTimesPage() {
  const supabase = await createSupabaseServerClient();
  const today = getManilaDate();
  const { data: entries, error } = supabase
    ? await supabase.from("prayer_times").select("id,prayer_name,prayer_time,prayer_date").eq("prayer_date", today).eq("is_published", true).order("prayer_time", { ascending: true })
    : { data: null, error: null };

  return (
    <PageShell eyebrow="Prayer information · مواقيت الصلاة" title="Make space for prayer." description="Find the mosque's official prayer schedule and congregational information.">
      {entries?.length ? <PrayerTimesBoard entries={entries} /> : <>
        <div className="prayer-toolbar"><div><span className="eyebrow">Daily timetable</span><h2>Prayer times</h2><p>Today's date · {today} · Asia/Manila</p></div><span className="status-pill"><CalendarDays size={14} /> Not yet published</span></div>
        <PendingPanel title="Official timetable required." description={error ? "The prayer timetable could not be loaded. Please check the database setup." : "No verified prayer schedule has been published for today. No prayer times or countdown are generated. Please refer to mosque management for the current congregational schedule."} />
      </>}
      <div className="notice-card"><CalendarDays size={20} /><p>Jummah time and special congregational schedules will be shown when confirmed by mosque management.</p></div>
    </PageShell>
  );
}
