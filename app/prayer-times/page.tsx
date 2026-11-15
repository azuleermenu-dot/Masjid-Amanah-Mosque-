import type { Metadata } from "next";
import { Clock3, CalendarDays } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "Prayer Times" };

const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function PrayerTimesPage() {
  return (
    <PageShell eyebrow="Prayer information · مواقيت الصلاة" title="Make space for prayer." description="Find the mosque's official prayer schedule and congregational information.">
      <div className="prayer-toolbar">
        <div><span className="eyebrow">Daily timetable</span><h2>Prayer times</h2><p>Local schedule · Asia/Manila, when confirmed</p></div>
        <span className="status-pill"><Clock3 size={14} /> Not yet published</span>
      </div>
      <div className="prayer-list">
        {prayers.map((prayer) => <div className="prayer-row" key={prayer}><span>{prayer}</span><strong>Pending confirmation</strong></div>)}
      </div>
      <div className="notice-card"><CalendarDays size={20} /><p>Jummah time and special congregational schedules will be added after confirmation by mosque management.</p></div>
      <PendingPanel title="Official timetable required." description="No prayer times or countdown are being generated yet. The mosque's actual schedule and preferred calculation or manual adjustment method must be supplied first." />
    </PageShell>
  );
}
