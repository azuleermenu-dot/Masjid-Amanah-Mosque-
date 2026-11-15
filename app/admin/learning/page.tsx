import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { saveLearningResource } from "./actions";

export const metadata: Metadata = { title: "Manage Learning Resources", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function ManageLearningPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: resources, error } = await supabase.from("learning_resources")
    .select("id,title,resource_type,source_reference,reviewed_by,is_published,created_at")
    .order("created_at", { ascending: false }).limit(50);

  const messages: Record<string, string> = {
    validation: "Check the title, resource type, reference, and reviewer details.",
    url: "Only valid HTTP or HTTPS links are accepted.",
    save: "The resource could not be saved. Check the database migration and permissions.",
  };

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar"><Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link><form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form></header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Reviewed learning content</span><h1 className="display">Islamic learning</h1><p>Publish educational material only with reliable references and appropriate review.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>
        {params.saved === "1" && <p className="success-message" role="status">Learning resource saved.</p>}
        {params.error && <p className="form-error" role="alert">{messages[params.error] ?? "The request could not be completed."}</p>}

        <section className="admin-editor"><div className="admin-section-heading"><BookOpen size={18} /><h2>Add learning resource</h2></div>
          <form action={saveLearningResource} className="admin-form">
            <label htmlFor="title">Title</label><input id="title" name="title" required minLength={3} maxLength={180} />
            <label htmlFor="resource_type">Resource type</label><select id="resource_type" name="resource_type" defaultValue="article"><option value="article">Educational article</option><option value="quran">Qur'an resource</option><option value="hadith">Hadith reference</option><option value="external">External learning link</option></select>
            <label htmlFor="summary">Summary</label><input id="summary" name="summary" maxLength={500} />
            <label htmlFor="source_reference">Source reference (required for Qur'an and Hadith)</label><input id="source_reference" name="source_reference" maxLength={300} placeholder="Surah and ayah, or collection and hadith reference" />
            <label htmlFor="body">Article or study notes</label><textarea id="body" name="body" rows={5} maxLength={12000} />
            <label htmlFor="external_url">External URL (optional)</label><input id="external_url" name="external_url" type="url" maxLength={2000} placeholder="https://" />
            <label htmlFor="reviewed_by">Reviewed by</label><input id="reviewed_by" name="reviewed_by" maxLength={120} placeholder="Reviewer or authorized scholar" />
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish after review</label>
            <button className="btn-primary admin-submit" type="submit">Save learning resource</button>
            <p className="form-hint">Published items require a reviewer. Qur'an and Hadith records must include a precise source reference. Do not add unverified rulings or attributions.</p>
          </form>
        </section>

        <section className="admin-list-section"><div className="admin-section-heading"><BookOpen size={18} /><h2>Saved learning resources</h2></div>
          {error ? <p className="form-error">Unable to load resources.</p> : !resources?.length ? <p className="admin-empty">No learning resources have been saved.</p> : <div className="admin-list">{resources.map((item) => <article className="admin-list-row" key={item.id}><div><strong>{item.title}</strong><span>{item.resource_type} · {item.source_reference || "No source reference"}{item.reviewed_by ? ` · Reviewed by ${item.reviewed_by}` : ""}</span></div><span className={item.is_published ? "published-badge" : "draft-badge"}>{item.is_published ? "Published" : "Draft"}</span></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
