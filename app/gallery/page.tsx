import type { Metadata } from "next";
import { Images } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <PageShell eyebrow="Gallery · معرض الصور" title="Moments from the community." description="Photographs of the actual mosque, its activities, and community life.">
      <div className="empty-feed"><Images size={30} /><span className="eyebrow">Photo gallery</span><h2>Gallery coming soon.</h2><p>Only photographs provided or approved by the mosque will be displayed.</p></div>
      <PendingPanel title="No illustrative images are presented as real mosque photographs." description="The gallery will remain empty until actual photographs are supplied with permission to publish." />
    </PageShell>
  );
}
