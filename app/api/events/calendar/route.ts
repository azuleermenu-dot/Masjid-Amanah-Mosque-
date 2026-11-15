import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublicEvent = {
  id: string;
  title: string;
  description: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
};

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatUtc(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function foldIcsLine(line: string) {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let current = "";
  let byteLength = 0;

  for (const character of line) {
    const nextLength = encoder.encode(character).length;
    if (byteLength + nextLength > 73 && current) {
      chunks.push(current);
      current = ` ${character}`;
      byteLength = 1 + nextLength;
    } else {
      current += character;
      byteLength += nextLength;
    }
  }

  chunks.push(current);
  return chunks.join("\r\n");
}

function eventToLines(event: PublicEvent) {
  const description = event.description?.trim() ?? "";
  const location = event.venue?.trim() ?? "";

  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.id}@masjid-amanah`,
    `DTSTAMP:${formatUtc(new Date().toISOString())}`,
    `DTSTART:${formatUtc(event.starts_at)}`,
  ];

  if (event.ends_at) lines.push(`DTEND:${formatUtc(event.ends_at)}`);

  lines.push(
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
  );

  if (location) lines.push(`LOCATION:${escapeIcsText(location)}`);

  lines.push("STATUS:CONFIRMED", "CLASS:PUBLIC", "END:VEVENT");
  return lines;
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "The mosque event calendar is not configured yet." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const now = new Date();
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setUTCFullYear(oneYearFromNow.getUTCFullYear() + 1);

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,description,venue,starts_at,ends_at")
    .eq("is_published", true)
    .gte("starts_at", now.toISOString())
    .lte("starts_at", oneYearFromNow.toISOString())
    .order("starts_at", { ascending: true })
    .limit(500);

  if (error) {
    return NextResponse.json(
      { error: "The mosque event calendar is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const calendarLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Masjid Amanah//Community Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Masjid Amanah Events",
    "X-WR-TIMEZONE:Asia/Manila",
    ...(events ?? []).flatMap((event) => eventToLines(event as PublicEvent)),
    "END:VCALENDAR",
  ];

  const body = calendarLines.map(foldIcsLine).join("\r\n") + "\r\n";

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="masjid-amanah-events.ics"',
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
