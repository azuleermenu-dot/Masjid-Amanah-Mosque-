import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, GraduationCap, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PendingPanel } from "@/components/pending-panel";
import { createMadrasahGraduate, createMadrasahProgram, deleteMadrasahGraduate, deleteMadrasahProgram } from "./actions";

export const metadata: Metadata = { title: "Madrasah management", robots: { index: false, follow: false } };

export default async function MadrasahAdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <main className="admin-dashboard"><div className="admin-dashboard-wrap"><PendingPanel title="Madrasah management is not connected." description="Connect the dedicated Masjid Amanah Supabase project and apply the Madrasah migration before managing education records." /><Link href="/admin" className="text-link"><ArrowLeft size={14} /> Back to dashboard</Link></div></main>;
  }

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (!admin) redirect("/admin");

  const [programResult, graduateResult] = await Promise.all([
    supabase.from("madrasah_programs").select("id,title,is_published").order("created_at", { ascending: false }),
    supabase.from("madrasah_public_graduates").select("id,graduate_name,program_label,completion_year,is_published,publication_consent_recorded,approved_for_publication").order("completion_year", { ascending: false }).order("graduate_name", { ascending: true }),
  ]);

  const schemaMissing = Boolean(programResult.error || graduateResult.error);
  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link>
        <Link className="admin-signout" href="/admin">Dashboard</Link>
      </header>
      <div className="admin-dashboard-wrap">
        <div className="admin-title-row">
          <div><span className="eyebrow">Education administration</span><h1 className="display">Madrasah records</h1><p>Manage verified programs and approved public graduate listings.</p></div>
          <span className="status-pill"><ShieldCheck size={14} /> Authorized access</span>
        </div>
        {schemaMissing ? (
          <PendingPanel title="Apply the Madrasah database migration." description="The education tables are not available yet. Apply supabase/migrations/20261116000400_add_madrasah_education.sql to the dedicated Masjid Amanah Supabase project, then refresh this page." />
        ) : (
          <>
            <div className="madrasah-admin-grid">
              <section className="madrasah-admin-panel">
                <span className="eyebrow">Learning pathways</span><h2>Add a program</h2>
                <form action={createMadrasahProgram} className="madrasah-admin-form">
                  <label>Program name<input name="title" required maxLength={120} placeholder="Enter the officially confirmed name" /></label>
                  <label>Description<textarea name="description" rows={3} maxLength={2000} placeholder="Use only mosque-approved details" /></label>
                  <label>Age guidance (optional)<input name="age_guidance" maxLength={120} placeholder="Only if officially confirmed" /></label>
                  <label className="madrasah-check"><input type="checkbox" name="is_published" /> Publish on the public education page</label>
                  <button className="btn-primary" type="submit"><Plus size={15} /> Save program</button>
                </form>
                <div className="madrasah-record-list">
                  {(programResult.data ?? []).map((program) => <div className="madrasah-record" key={program.id}><div><strong>{program.title}</strong><small>{program.is_published ? "Published" : "Draft"}</small></div><form action={deleteMadrasahProgram}><input type="hidden" name="id" value={program.id} /><button type="submit" className="madrasah-delete" aria-label={`Delete ${program.title}`}><Trash2 size={15} /></button></form></div>)}
                  {!programResult.data?.length ? <p className="subtle-copy">No programs have been entered.</p> : null}
                </div>
              </section>

              <section className="madrasah-admin-panel">
                <span className="eyebrow">Graduation archive</span><h2>Add a graduate</h2>
                <form action={createMadrasahGraduate} className="madrasah-admin-form">
                  <label>Graduate name<input name="graduate_name" required maxLength={160} placeholder="Enter the verified graduate name" /></label>
                  <label>Completed program<input name="program_label" required maxLength={120} placeholder="Official program name" /></label>
                  <label>Completion year<input name="completion_year" type="number" required min={1900} max={2200} inputMode="numeric" placeholder="YYYY" /></label>
                  <label>Distinction (optional)<input name="distinction" maxLength={160} placeholder="Only if officially awarded" /></label>
                  <label className="madrasah-check"><input type="checkbox" name="publication_consent_recorded" /> Student / guardian publication consent is recorded</label>
                  <label className="madrasah-check"><input type="checkbox" name="approved_for_publication" /> Mosque administrator has verified and approved this entry</label>
                  <label className="madrasah-check"><input type="checkbox" name="is_published" /> Publish this graduate name publicly</label>
                  <p className="madrasah-privacy-note">Do not add minors’ names unless the required parent or guardian permission has been obtained and recorded. Never enter private student or guardian contact details here.</p>
                  <button className="btn-primary" type="submit"><Plus size={15} /> Save graduate</button>
                </form>
                <div className="madrasah-record-list">
                  {(graduateResult.data ?? []).map((graduate) => <div className="madrasah-record" key={graduate.id}><div><strong>{graduate.graduate_name}</strong><small>{graduate.program_label} · {graduate.completion_year} · {graduate.is_published ? "Published" : "Private / draft"}</small></div><form action={deleteMadrasahGraduate}><input type="hidden" name="id" value={graduate.id} /><button type="submit" className="madrasah-delete" aria-label={`Delete ${graduate.graduate_name}`}><Trash2 size={15} /></button></form></div>)}
                  {!graduateResult.data?.length ? <p className="subtle-copy">No graduate records have been entered.</p> : null}
                </div>
              </section>
            </div>
            <section className="admin-security-note"><GraduationCap size={18} /><p>Student enrollment, guardian information, classes, and academic-year tables are private and restricted to authorized administrators. This page currently manages program listings and the minimal public graduate directory.</p></section>
          </>
        )}
        <Link href="/admin" className="text-link"><ArrowLeft size={14} /> Back to administration</Link>
      </div>
    </main>
  );
}
