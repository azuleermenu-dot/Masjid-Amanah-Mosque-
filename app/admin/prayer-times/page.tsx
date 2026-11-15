import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock3, ShieldCheck, Trash2, CalendarPlus } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { savePrayerTime, saveDailyPrayerSchedule, deletePrayerTime, updatePrayerTimePublication } from "./actions";

export const metadata: Metadata = { title: "Manage Prayer Times", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; bulkSaved?: string; deleted?: string; error?: string }> };

export default async function ManagePrayerTimesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: entries, error } = await supabase.from("prayer_times")
    .select("id,prayer_date,prayer_name,prayer_time,is_published,note")
    .order("prayer_date", { ascending: false }).order("prayer_time", { ascending: true }).limit(100);

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link>
        <form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form>
      </header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Daily schedule</span><h1 className="display">Prayer times</h1><p>Enter only the actual timetable approved by mosque management. Times are interpreted as Philippines local time (UTC+8).</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>

        {params.saved === "1" && <p className="success-message" role="status">Prayer time saved or updated.</p>}
        {params.bulkSaved === "1" && <p className="success-message" role="status">Daily prayer schedule saved or updated.</p>}
        {params.deleted === "1" && <p className="success-message" role="status">Prayer time deleted.</p>}
        {params.error && <p className="form-error" role="alert">{params.error === "empty" ? "Enter at least one prayer time before saving." : params.error === "validation" ? "Check the date, prayer name, time, and note." : params.error === "delete" ? "The prayer time could not be deleted." : "The prayer time could not be saved. Confirm the database migration has been applied."}</p>}

        <section className="admin-editor">
          <div className="admin-section-heading"><CalendarPlus size={18} /><h2>Set a full day schedule</h2></div>
          <form action={saveDailyPrayerSchedule} className="admin-form">
            <label htmlFor="bulk_prayer_date">Date · Philippines (UTC+8)</label>
            <input id="bulk_prayer_date" name="prayer_date" type="date" required />
            <div className="prayer-bulk-grid">
              {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Jummah"].map((name) => (
                <div className="prayer-bulk-field" key={name}>
                  <label htmlFor={`bulk-${name}`}>{name}</label>
                  <input id={`bulk-${name}`} name={name} type="time" />
                </div>
              ))}
            </div>
            <label htmlFor="bulk_note">Schedule note (optional)</label>
            <input id="bulk_note" name="note" maxLength={200} placeholder="Optional note for this day's schedule" />
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish all entered times</label>
            <button className="btn-primary admin-submit" type="submit">Save daily schedule</button>
            <p className="form-hint">Leave fields blank for prayers without a supplied time. Existing entries for the same date and prayer name will be updated. No calculation is performed.</p>
          </form>
        </section>

        <section className="admin-editor">
          <div className="admin-section-heading"><Clock3 size={18} /><h2>Add or update a single prayer time</h2></div>
          <form action={savePrayerTime} className="admin-form">
            <label htmlFor="prayer_date">Date (Philippines)</label><input id="prayer_date" name="prayer_date" type="date" required />
            <label htmlFor="prayer_name">Prayer</label><select id="prayer_name" name="prayer_name" required defaultValue="Fajr"><option>Fajr</option><option>Sunrise</option><option>Dhuhr</option><option>Asr</option><option>Maghrib</option><option>Isha</option><option>Jummah</option></select>
            <label htmlFor="prayer_time">Time (24-hour format)</label><input id="prayer_time" name="prayer_time" type="time" required />
            <label htmlFor="note">Optional note</label><input id="note" name="note" maxLength={200} placeholder="Optional schedule note" />
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish this time publicly</label>
            <button className="btn-primary admin-submit" type="submit">Save prayer time</button>
            <p className="form-hint">Saving the same date and prayer name updates the existing entry. No automatic prayer calculation is used.</p>
          </form>
        </section>

        <section className="admin-list-section">
          <div className="admin-section-heading"><Clock3 size={18} /><h2>Saved timetable entries</h2></div>
          {error ? <p className="form-error">Unable to load entries. Check the Supabase migration and permissions.</p> : !entries?.length ? <p className="admin-empty">No prayer times have been saved.</p> : <div className="admin-list">
            {entries.map((entry) => <article className="admin-list-row" key={entry.id}>
              <div><strong>{entry.prayer_date} · {entry.prayer_name}</strong><span>{String(entry.prayer_time).slice(0, 5)} · UTC+8 {entry.note ? "· " + entry.note : ""}</span></div>
              <div className="admin-row-actions">
                <form action={updatePrayerTimePublication} className="inline-status-form">
                  <input type="hidden" name="id" value={entry.id} />
                  <label className="inline-checkbox"><input type="checkbox" name="is_published" defaultChecked={entry.is_published} /> Publish</label>
                  <button className="small-admin-button" type="submit">Update</button>
                </form>
                <form action={deletePrayerTime}><input type="hidden" name="id" value={entry.id} /><button className="icon-danger" type="submit" aria-label="Delete prayer time entry"><Trash2 size={15} /></button></form>
              </div>
            </article>)}
          </div>}
        </section>
      </div>
    </main>
  );
}
