import type { Metadata } from "next";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Madrasah Education",
  description: "Explore education information and the approved graduate directory of Masjid Amanah.",
};

type Program = {
  id: string;
  title: string;
  description: string;
  age_guidance: string;
};

type Graduate = {
  id: string;
  graduate_name: string;
  program_label: string;
  completion_year: number;
  distinction: string;
};

export default async function EducationPage() {
  const supabase = await createSupabaseServerClient();

  const [programResult, graduateResult] = supabase
    ? await Promise.all([
        supabase
          .from("madrasah_programs")
          .select("id,title,description,age_guidance")
          .eq("is_published", true)
          .order("display_order", { ascending: true })
          .order("title", { ascending: true }),
        supabase
          .from("madrasah_public_graduates")
          .select("id,graduate_name,program_label,completion_year,distinction")
          .eq("is_published", true)
          .eq("publication_consent_recorded", true)
          .eq("approved_for_publication", true)
          .order("completion_year", { ascending: false })
          .order("display_order", { ascending: true })
          .order("graduate_name", { ascending: true })
          .limit(200),
      ])
    : [{ data: null, error: null }, { data: null, error: null }];

  const programs = (programResult.data ?? []) as Program[];
  const graduates = (graduateResult.data ?? []) as Graduate[];
  const hasLoadError = Boolean(programResult.error || graduateResult.error);

  return (
    <PageShell
      eyebrow="Education · التعليم"
      title="Learning, growth, and a legacy of knowledge."
      description="The Madrasah education section is being prepared as part of Masjid Amanah’s community learning work. Official program details and graduate names will appear here only after confirmation and approval."
    >
      <section className="education-intro-grid">
        <article className="feature-card education-intro-card">
          <BookOpen size={24} />
          <span className="eyebrow">Learning</span>
          <h2>Madrasah programs</h2>
          <p>Find confirmed information about classes, learning pathways, and enrollment when details are officially published.</p>
        </article>
        <article className="feature-card education-intro-card">
          <GraduationCap size={24} />
          <span className="eyebrow">Achievement</span>
          <h2>Graduate directory</h2>
          <p>Recognizing students who have completed a program, with names displayed only when publication has been authorized.</p>
        </article>
        <article className="feature-card education-intro-card">
          <Users size={24} />
          <span className="eyebrow">Community</span>
          <h2>Student care</h2>
          <p>Student and guardian records are kept in a private administrative system and are never shown in this public directory.</p>
        </article>
      </section>

      <section className="education-section">
        <div className="education-section-heading">
          <span className="eyebrow">Official learning pathways</span>
          <h2 className="display">Madrasah programs</h2>
          <p>Only programs confirmed by authorized mosque representatives are listed.</p>
        </div>
        {hasLoadError ? (
          <p className="subtle-copy">Program information is temporarily unavailable. Please check again later.</p>
        ) : programs.length ? (
          <div className="feature-grid">
            {programs.map((program) => (
              <article className="feature-card" key={program.id}>
                <BookOpen size={21} />
                <h3>{program.title}</h3>
                {program.description ? <p>{program.description}</p> : null}
                {program.age_guidance ? <small>{program.age_guidance}</small> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="education-empty-state">
            <BookOpen size={22} />
            <h3>Program details are being confirmed.</h3>
            <p>No Madrasah programs have been approved for public display yet.</p>
          </div>
        )}
      </section>

      <section className="education-section education-graduates">
        <div className="education-section-heading">
          <span className="eyebrow">Honoring achievement</span>
          <h2 className="display">Graduate directory</h2>
          <p>A growing archive of graduates, organized by completion year.</p>
        </div>
        {hasLoadError ? (
          <p className="subtle-copy">The graduate directory is temporarily unavailable.</p>
        ) : graduates.length ? (
          <div className="graduate-list">
            {graduates.map((graduate) => (
              <article className="graduate-row" key={graduate.id}>
                <div className="graduate-year">{graduate.completion_year}</div>
                <div className="graduate-details">
                  <h3>{graduate.graduate_name}</h3>
                  <p>{graduate.program_label}</p>
                </div>
                {graduate.distinction ? <span className="graduate-distinction">{graduate.distinction}</span> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="education-empty-state">
            <GraduationCap size={22} />
            <h3>The graduate archive will appear here.</h3>
            <p>Graduate names will be published only after the mosque verifies the records, confirms permission to publish, and approves each entry.</p>
          </div>
        )}
      </section>

      {!supabase ? (
        <PendingPanel
          title="Education records are not connected yet."
          description="Connect the dedicated Masjid Amanah Supabase project and apply the Madrasah migration to manage approved programs and the public graduate directory."
        />
      ) : null}
    </PageShell>
  );
}
