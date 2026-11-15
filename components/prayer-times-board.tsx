"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";

type PrayerEntry = { id: string; prayer_name: string; prayer_time: string; prayer_date: string };
const CORE_PRAYERS = new Set(["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]);

function formatTime(value: string) {
  const [hours, minutes] = value.split(":");
  const date = new Date(`1970-01-01T${hours}:${minutes}:00+08:00`);
  return new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" }).format(date);
}

function toManilaTimestamp(date: string, time: string) {
  return new Date(`${date}T${time}+08:00`).getTime();
}

export function PrayerTimesBoard({ entries }: { entries: PrayerEntry[] }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const nextPrayer = useMemo(() => entries
    .filter((entry) => CORE_PRAYERS.has(entry.prayer_name))
    .map((entry) => ({ ...entry, timestamp: toManilaTimestamp(entry.prayer_date, entry.prayer_time) }))
    .filter((entry) => entry.timestamp > now)
    .sort((a, b) => a.timestamp - b.timestamp)[0], [entries, now]);

  const remaining = nextPrayer ? Math.max(0, nextPrayer.timestamp - now) : 0;
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);

  return (
    <div className="prayer-board">
      <div className="prayer-next">
        <span className="eyebrow">Next prayer · الصلاة القادمة</span>
        {nextPrayer ? <>
          <strong>{nextPrayer.prayer_name}</strong>
          <span>{formatTime(nextPrayer.prayer_time)}</span>
          <small>{hours > 0 ? `${hours}h ` : ""}{minutes}m remaining · Asia/Manila</small>
        </> : <>
          <strong>No upcoming prayer time posted.</strong>
          <small>Check the mosque's latest confirmed timetable.</small>
        </>}
      </div>
      <div className="prayer-table">
        {entries.map((entry) => <div className="prayer-row" key={entry.id}><span>{entry.prayer_name}</span><strong>{formatTime(entry.prayer_time)}</strong></div>)}
      </div>
      <p className="prayer-footnote"><Clock3 size={14} /> Official mosque timetable · Philippines time (UTC+8)</p>
    </div>
  );
}
