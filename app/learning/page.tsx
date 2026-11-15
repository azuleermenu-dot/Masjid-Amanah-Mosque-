import type { Metadata } from "next";
import { BookOpenCheck, BookText, GraduationCap, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Islamic Learning" };

export default async function LearningPage() {
  const supabase = await createSupabaseServerClient();
  const { data: resources, error } = supabase
    ? await supabase.from("learning_resources").select("id,title,resource_type,summary,source_reference,external_url,reviewed_by").eq("is_published", true).order("created_at", { ascending: false }).limit(30)
    : { data: null, error: null };

  return (
    <PageShell eyebrow="Knowledge · العلم" title="Learn with care and reliable sources." description="A space for educational resources shared with accurate references and appropriate review.">
      <div className="feature-grid">
        <article className="feature-card"><BookOpenCheck size={23} /><h2>Qur'an resources</h2><p>Qur'an reading and study materials with surah and ayah references.</p></article>
        <article className="feature-card"><BookText size={23} /><h2>Hadith references</h2><p>Hadith material with collection and reference details.</p></article>
        <article className="feature-card"><GraduationCap size={23} /><h2>Learning articles</h2><p>Educational articles reviewed before publication.</p></article>
      </div>
      <div className="resource-section"><span className="eyebrow">Published resources</span><h2 className="display">Study and reflect.</h2>
        {resources?.length ? <div className="resource-grid">{resources.map((item) => <article className="resource-card" key={item.id}>
          <span className="eyebrow">{item.resource_type.replace("_", " ")}</span><h3>{item.title}</h3><p>{item.summary}</p>
          {item.source_reference && <small>Reference: {item.source_reference}</small>}
          {item.reviewed_by && <small>Reviewed by: {item.reviewed_by}</small>}
          {item.external_url && <a href={item.external_url} target="_blank" rel="noreferrer">Open resource <ExternalLink size={13} /></a>}
        </article>)}</div> : <p className="subtle-copy">{error ? "The learning resources could not be loaded." : "No learning resources have been approved for publication yet."}</p>}
      </div>
      {!supabase && <PendingPanel title="Reviewed resources will appear here." description="Connect the dedicated Masjid Amanah database to publish content approved by mosque management. No Qur'an translation, Hadith, or religious ruling is generated automatically." />}
    </PageShell>
  );
}
