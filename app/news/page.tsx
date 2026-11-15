import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "News & Announcements" };

export default async function NewsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: announcements, error } = supabase
    ? await supabase.from("announcements").select("id,title,slug,excerpt,body,published_at,created_at").eq("is_published", true).order("published_at", { ascending: false }).limit(30)
    : { data: null, error: null };

  return (
    <PageShell eyebrow="Updates · الأخبار" title="What's happening at the mosque." description="Official announcements, schedule updates, and community news from Masjid Amanah.">
      {announcements?.length ? <div className="announcement-list">
        {announcements.map((item) => <article className="announcement-card" key={item.id}>
          <span className="eyebrow">Masjid announcement</span><h2>{item.title}</h2><p>{item.excerpt || item.body.slice(0, 230)}</p>
          {item.published_at && <time dateTime={item.published_at}>{new Intl.DateTimeFormat("en-PH", { dateStyle: "long", timeZone: "Asia/Manila" }).format(new Date(item.published_at))}</time>}
        </article>)}
      </div> : <div className="empty-feed"><Megaphone size={28} /><span className="eyebrow">Official updates</span><h2>No announcements published yet.</h2><p>{error ? "The announcement feed is temporarily unavailable." : "Updates approved by mosque management will appear here."}</p></div>}
      {!supabase && <PendingPanel title="Live updates are not connected yet." description="Connect the dedicated Masjid Amanah database to publish verified announcements from the administrator dashboard." />}
    </PageShell>
  );
}
