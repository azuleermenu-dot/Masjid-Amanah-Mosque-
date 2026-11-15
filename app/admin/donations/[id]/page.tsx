import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, HeartHandshake, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { updateDonationMethod } from "../actions";

export const metadata: Metadata = {
  title: "Edit Donation Method",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditDonationMethodPage({ params, searchParams }: Props) {
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

  const { data: method, error } = await supabase
    .from("donation_methods")
    .select("id,label,purpose,instructions,provider_details,verified_by,verified_at,is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !method) notFound();

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
        <Link href="/admin/donations" className="admin-back">
          <ArrowLeft size={14} /> Donation methods
        </Link>

        <div className="admin-title-row">
          <div>
            <span className="eyebrow">Verified payment information</span>
            <h1 className="display">Edit donation method</h1>
            <p>Check every payment detail again with authorized mosque management before publishing changes.</p>
          </div>
          <span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span>
        </div>

        {query.error && (
          <p className="form-error" role="alert">
            {query.error === "validation"
              ? "Complete all fields and confirm the exact details before publishing."
              : "The donation method could not be updated. Check database setup and permissions."}
          </p>
        )}

        <section className="admin-editor">
          <div className="admin-section-heading">
            <HeartHandshake size={18} />
            <h2>{method.label}</h2>
          </div>

          <form action={updateDonationMethod} className="admin-form">
            <input type="hidden" name="id" value={method.id} />

            <label htmlFor="label">Method title</label>
            <input id="label" name="label" required minLength={2} maxLength={120} defaultValue={method.label} />

            <label htmlFor="purpose">Purpose</label>
            <input id="purpose" name="purpose" maxLength={500} defaultValue={method.purpose ?? ""} />

            <label htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" rows={4} required maxLength={2000} defaultValue={method.instructions} />

            <label htmlFor="provider_details">Payment details</label>
            <textarea id="provider_details" name="provider_details" rows={4} maxLength={2000} defaultValue={method.provider_details ?? ""} />

            <label htmlFor="verified_by">Verified by</label>
            <input id="verified_by" name="verified_by" maxLength={120} defaultValue={method.verified_by ?? ""} />

            <div className="verification-warning">
              <ShieldCheck size={17} />
              <span>Changing payment instructions or account details requires a new verification confirmation. Do not publish unverified payment information.</span>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" name="confirm_verified" />
              I re-confirmed these exact details with authorized mosque management.
            </label>

            <label className="checkbox-label">
              <input type="checkbox" name="is_published" defaultChecked={method.is_published} />
              Publish this donation method
            </label>

            <div className="admin-form-actions">
              <button className="btn-primary admin-submit" type="submit">Save changes</button>
              <Link href="/admin/donations" className="admin-cancel-link">Cancel editing</Link>
            </div>
            <p className="form-hint">
              When published, the verification timestamp is refreshed. Unpublishing immediately removes this method from the public donations page.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
