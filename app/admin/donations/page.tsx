import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, HeartHandshake, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { saveDonationMethod, updateDonationMethodPublication, deleteDonationMethod } from "./actions";

export const metadata: Metadata = { title: "Manage Donations", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; updated?: string; deleted?: string; error?: string }> };

export default async function ManageDonationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: methods, error } = await supabase.from("donation_methods")
    .select("id,label,purpose,is_published,verified_by,verified_at,created_at")
    .order("created_at", { ascending: false }).limit(50);

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar"><Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link><form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form></header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Transparent giving</span><h1 className="display">Donation methods</h1><p>Publish payment information only after checking it directly with the mosque.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>
        {params.saved === "1" && <p className="success-message" role="status">Donation method saved or updated.</p>}
        {params.deleted === "1" && <p className="success-message" role="status">Donation method deleted.</p>}
        {params.updated === "1" && <p className="success-message" role="status">Donation method updated.</p>}
        {params.error && <p className="form-error" role="alert">{params.error === "validation" ? "Complete all required fields and confirm verification before publishing." : params.error === "verification" ? "This record has no verification record. Re-enter and confirm the exact payment information before publishing." : params.error === "delete" ? "The donation method could not be deleted." : "The donation method could not be saved."}</p>}

        <section className="admin-editor">
          <div className="admin-section-heading"><HeartHandshake size={18} /><h2>Add donation instructions</h2></div>
          <form action={saveDonationMethod} className="admin-form">
            <label htmlFor="label">Method title</label><input id="label" name="label" required minLength={2} maxLength={120} placeholder="Example: Official bank transfer" />
            <label htmlFor="purpose">Purpose</label><input id="purpose" name="purpose" maxLength={500} placeholder="What this donation supports" />
            <label htmlFor="instructions">Instructions</label><textarea id="instructions" name="instructions" rows={4} required maxLength={2000} />
            <label htmlFor="provider_details">Payment details (only visible when published)</label><textarea id="provider_details" name="provider_details" rows={3} maxLength={2000} placeholder="Enter only the exact payment details authorized by the mosque." />
            <label htmlFor="verified_by">Verified by</label><input id="verified_by" name="verified_by" maxLength={120} placeholder="Authorized representative's name" />
            <label className="checkbox-label"><input type="checkbox" name="confirm_verified" /> I personally confirmed these exact payment details with authorized mosque management.</label>
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish this donation method</label>
            <button className="btn-primary admin-submit" type="submit">Save donation method</button>
            <p className="form-hint">Publishing requires a named verifier and explicit confirmation. Draft records remain private to admins.</p>
          </form>
        </section>

        <section className="admin-list-section"><div className="admin-section-heading"><HeartHandshake size={18} /><h2>Saved donation methods</h2></div>
          {error ? <p className="form-error">Unable to load donation methods.</p> : !methods?.length ? <p className="admin-empty">No donation methods have been added.</p> : <div className="admin-list">{methods.map((method) => <article className="admin-list-row" key={method.id}>
              <div><strong>{method.label}</strong><span>{method.purpose || "No purpose description"}{method.verified_by ? ` · Verified by ${method.verified_by}` : ""}</span></div>
              <div className="admin-row-actions">
                <Link href={`/admin/donations/${method.id}`} className="small-admin-button edit-admin-link" aria-label={`Edit ${method.label}`}>
                  <Pencil size={13} /> Edit
                </Link>
                <form action={updateDonationMethodPublication} className="inline-status-form">
                  <input type="hidden" name="id" value={method.id} />
                  <label className="inline-checkbox"><input type="checkbox" name="is_published" defaultChecked={method.is_published} /> Publish</label>
                  <button className="small-admin-button" type="submit">Update</button>
                </form>
                <form action={deleteDonationMethod}><input type="hidden" name="id" value={method.id} /><button className="icon-danger" type="submit" aria-label={`Delete ${method.label}`}><Trash2 size={15} /></button></form>
              </div>
            </article>)}</div>}
        </section>
      </div>
    </main>
  );
}
