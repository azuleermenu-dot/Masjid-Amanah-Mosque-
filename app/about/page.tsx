import type { Metadata } from "next";
import { Building2, Eye, Goal, Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "About the Mosque" };

export default async function AboutPage() {
  const supabase = await createSupabaseServerClient();
  const { data: profile, error } = supabase
    ? await supabase.from("mosque_profile").select("introduction,history,mission,vision,leadership_information,facilities,community_information").eq("id", true).maybeSingle()
    : { data: null, error: null };

  const sections = [
    { key: "history", label: "Our story", icon: Building2, value: profile?.history },
    { key: "mission", label: "Our mission", icon: Goal, value: profile?.mission },
    { key: "vision", label: "Our vision", icon: Eye, value: profile?.vision },
    { key: "leadership_information", label: "Leadership & administration", icon: Users, value: profile?.leadership_information },
    { key: "community_information", label: "Our community", icon: Users, value: profile?.community_information },
  ].filter((section) => section.value?.trim());

  return (
    <PageShell eyebrow="About · عن المسجد" title="A place for worship and community." description="Get to know Masjid Amanah through information shared and approved by its representatives.">
      <div className="content-narrow">
        {profile?.introduction?.trim() ? <p className="lead-copy">{profile.introduction}</p> : <p className="lead-copy">Masjid Amanah (مسجد الأمانة) — a place of worship, knowledge, unity, and community.</p>}
        {sections.length ? <div className="profile-sections">
          {sections.map(({ key, label, icon: Icon, value }) => <section className="profile-section" key={key}>
            <span className="profile-section-icon"><Icon size={20} /></span><div><span className="eyebrow">{label}</span><p>{value}</p></div>
          </section>)}
        </div> : <PendingPanel title="The mosque's story is being prepared." description={error ? "The official mosque profile could not be loaded. Please check the database setup." : "The history, mission, vision, and community information will be published here after confirmation by authorized mosque representatives."} />}

        {profile?.facilities?.length ? <section className="facility-section"><span className="eyebrow">Facilities</span><h2 className="display">Around the mosque.</h2><ul>{profile.facilities.map((facility: string) => <li key={facility}>{facility}</li>)}</ul></section> : null}
        {!supabase && <PendingPanel title="Official profile not connected yet." description="A dedicated Masjid Amanah database is required before approved mosque details can be published." />}
      </div>
    </PageShell>
  );
}
