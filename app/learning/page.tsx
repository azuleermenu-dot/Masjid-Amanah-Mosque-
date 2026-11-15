import type { Metadata } from "next";
import { BookOpenCheck, BookText, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "Islamic Learning" };

export default function LearningPage() {
  return (
    <PageShell eyebrow="Knowledge · العلم" title="Learn with care and reliable sources." description="A space for educational resources shared with accurate references and appropriate review.">
      <div className="feature-grid">
        <article className="feature-card"><BookOpenCheck size={23} /><h2>Qur'an resources</h2><p>Verified Qur'an reading and study resources, with surah and ayah references.</p></article>
        <article className="feature-card"><BookText size={23} /><h2>Hadith references</h2><p>Hadith material will include source collections and reference details.</p></article>
        <article className="feature-card"><GraduationCap size={23} /><h2>Learning articles</h2><p>Educational articles will be reviewed before publication.</p></article>
      </div>
      <PendingPanel title="Reviewed resources will appear here." description="No Qur'an translation, Hadith, religious ruling, or scholarly attribution will be generated or presented as mosque-approved without a reliable reference and review." />
    </PageShell>
  );
}
