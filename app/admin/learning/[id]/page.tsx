import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { updateLearningResource } from "../actions";

export const metadata: Metadata = {
  title: "Edit Learning Resource",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditLearningResourcePage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");

  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", claims.claims.sub)
    .maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: resource, error } = await supabase
    .from("learning_resources")
    .select("id,title,resource_type,summary,body,source_reference,external_url,reviewed_by,is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !resource) notFound();

  const messages: Record<string, string> = {
    validation: "Check the title, resource type, reference, and reviewer details.",
    url: "Only valid HTTP or HTTPS links are accepted.",
    save: "The learning resource could not be updated. Check database setup and permissions.",
  };

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">۞</span>
          <span className="brand-copy">
            <strong>MASJID AMANAH</strong>
            <span className="arabic" lang="ar">مسجد الأمانة</span>
          </span>
        </Link>
        <form action={signOutAdmin}>
          <button className="admin-signout" type="submit">Sign out</button>
        </form>
      </header>

      <div className="admin-dashboard-wrap">
        <Link href="/admin/learning" className="admin-back">
          <ArrowLeft size={14} /> Islamic learning
        </Link>

        <div className="admin-title-row">
          <div>
            <span className="eyebrow">Reviewed learning content</span>
            <h1 className="display">Edit resource</h1>
            <p>Update educational content while preserving its source and review details.</p>
          </div>
          <span className="status-pill">
            <ShieldCheck size={14} /> Authorized administrator
          </span>
        </div>

        {query.error && <p className="form-error" role="alert">{messages[query.error] ?? "The request could not be completed."}</p>}

        <section className="admin-editor">
          <div className="admin-section-heading">
            <BookOpen size={18} />
            <h2>{resource.title}</h2>
          </div>

          <form action={updateLearningResource} className="admin-form">
            <input type="hidden" name="id" value={resource.id} />

            <label htmlFor="title">Title</label>
            <input id="title" name="title" required minLength={3} maxLength={180} defaultValue={resource.title} />

            <label htmlFor="resource_type">Resource type</label>
            <select id="resource_type" name="resource_type" defaultValue={resource.resource_type}>
              <option value="article">Educational article</option>
              <option value="quran">Qur&apos;an resource</option>
              <option value="hadith">Hadith reference</option>
              <option value="external">External learning link</option>
            </select>

            <label htmlFor="summary">Summary</label>
            <input id="summary" name="summary" maxLength={500} defaultValue={resource.summary ?? ""} />

            <label htmlFor="source_reference">Source reference (required for Qur&apos;an and Hadith)</label>
            <input id="source_reference" name="source_reference" maxLength={300} defaultValue={resource.source_reference ?? ""} />

            <label htmlFor="body">Article or study notes</label>
            <textarea id="body" name="body" rows={8} maxLength={12000} defaultValue={resource.body ?? ""} />

            <label htmlFor="external_url">External URL (optional)</label>
            <input id="external_url" name="external_url" type="url" maxLength={2000} defaultValue={resource.external_url ?? ""} />

            <label htmlFor="reviewed_by">Reviewed by</label>
            <input id="reviewed_by" name="reviewed_by" maxLength={120} defaultValue={resource.reviewed_by ?? ""} />

            <label className="checkbox-label">
              <input type="checkbox" name="is_published" defaultChecked={resource.is_published} />
              Publish after review
            </label>

            <div className="admin-form-actions">
              <button className="btn-primary admin-submit" type="submit">Save changes</button>
              <Link href="/admin/learning" className="admin-cancel-link">Cancel editing</Link>
            </div>

            <p className="form-hint">
              Publishing requires a reviewer. Qur&apos;an and Hadith records must retain a precise source reference. Do not publish religious rulings or attributions without appropriate review.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
