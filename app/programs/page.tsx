import type { Metadata } from "next";
import { BookOpen, Users, CalendarDays, MoonStar } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "Programs & Activities" };

const categories = [
  { icon: BookOpen, title: "Qur'an & learning", text: "Details of classes and learning sessions will be added when confirmed." },
  { icon: Users, title: "Community programs", text: "Community services and activities will be listed with approved details." },
  { icon: CalendarDays, title: "Events & gatherings", text: "Confirmed dates, times, and registration details will be published here." },
  { icon: MoonStar, title: "Ramadan & Eid", text: "Seasonal announcements will be shared by the mosque." },
];

export default function ProgramsPage() {
  return (
    <PageShell eyebrow="Community · المجتمع" title="Come together, learn, and grow." description="Explore the mosque's classes, events, and community activities.">
      <div className="feature-grid">
        {categories.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><Icon size={23} /><h2>{title}</h2><p>{text}</p></article>)}
      </div>
      <PendingPanel title="Program schedule pending approval." description="No class, teacher, event, or schedule is listed as confirmed until the mosque provides and approves the details." />
    </PageShell>
  );
}
