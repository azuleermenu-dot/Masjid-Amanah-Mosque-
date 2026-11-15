import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "About the Mosque" };

export default function AboutPage() {
  return (
    <PageShell eyebrow="About · عن المسجد" title="A place for worship and community." description="Get to know Masjid Amanah through information shared and approved by its representatives.">
      <div className="content-narrow">
        <p className="lead-copy">Masjid Amanah (مسجد الأمانة) is an existing mosque. This website is being prepared as its official digital home.</p>
        <PendingPanel title="The mosque's story is being prepared." description="The history, mission, facilities, leadership, and community services will be published here after they have been confirmed by authorized mosque representatives." />
      </div>
    </PageShell>
  );
}
