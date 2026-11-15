import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "News & Announcements" };

export default function NewsPage() {
  return (
    <PageShell eyebrow="Updates · الأخبار" title="What's happening at the mosque." description="Official announcements, schedule updates, and community news from Masjid Amanah.">
      <div className="empty-feed"><Megaphone size={28} /><span className="eyebrow">Official updates</span><h2>No announcements published yet.</h2><p>Updates approved by mosque management will appear here.</p></div>
      <PendingPanel title="Publication access is being prepared." description="Announcements will be published through an authorized content-management process. No unverified event or schedule information is shown." />
    </PageShell>
  );
}
