import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Building2, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { updateMosqueProfile } from "./actions";

export const metadata: Metadata = { title: "Manage Mosque Profile", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function MosqueProfileAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: profile, error } = await supabase.from("mosque_profile").select("*").eq("id", true).single();
  const facilityText = (profile?.facilities ?? []).join("\n");

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar"><Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link><form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form></header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Official mosque information</span><h1 className="display">Mosque profile</h1><p>Enter only details reviewed and approved by authorized Masjid Amanah representatives.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>
        {params.saved === "1" && <p className="success-message" role="status">Mosque profile updated.</p>}
        {params.error && <p className="form-error" role="alert">{params.error === "validation" ? "Check field lengths, email format, facility count, and website links." : "The profile could not be saved. Confirm that the database migration has been applied."}</p>}
        {error && <p className="form-error" role="alert">The profile could not be loaded. Apply the latest Supabase migration first.</p>}

        <form action={updateMosqueProfile} className="profile-admin-form">
          <section className="admin-editor">
            <div className="admin-section-heading"><Building2 size={18} /><h2>About the mosque</h2></div>
            <div className="admin-form">
              <label htmlFor="introduction">Introduction</label><textarea id="introduction" name="introduction" rows={4} maxLength={5000} defaultValue={profile?.introduction ?? ""} placeholder="Approved introduction for the mosque" />
              <label htmlFor="history">History and establishment</label><textarea id="history" name="history" rows={5} maxLength={5000} defaultValue={profile?.history ?? ""} />
              <label htmlFor="mission">Mission</label><textarea id="mission" name="mission" rows={3} maxLength={3000} defaultValue={profile?.mission ?? ""} />
              <label htmlFor="vision">Vision</label><textarea id="vision" name="vision" rows={3} maxLength={3000} defaultValue={profile?.vision ?? ""} />
              <label htmlFor="leadership_information">Leadership and administration</label><textarea id="leadership_information" name="leadership_information" rows={4} maxLength={3000} defaultValue={profile?.leadership_information ?? ""} />
              <label htmlFor="facilities">Facilities (one item per line)</label><textarea id="facilities" name="facilities" rows={4} maxLength={4000} defaultValue={facilityText} placeholder={"Prayer hall\nAblution area"} />
              <label htmlFor="community_information">Community involvement and services</label><textarea id="community_information" name="community_information" rows={4} maxLength={5000} defaultValue={profile?.community_information ?? ""} />
            </div>
          </section>

          <section className="admin-editor">
            <div className="admin-section-heading"><Building2 size={18} /><h2>Official contact and location</h2></div>
            <div className="admin-form">
              <label htmlFor="address">Full address</label><textarea id="address" name="address" rows={2} maxLength={500} defaultValue={profile?.address ?? ""} />
              <label htmlFor="phone">Official phone number</label><input id="phone" name="phone" maxLength={80} defaultValue={profile?.phone ?? ""} />
              <label htmlFor="email">Official email address</label><input id="email" name="email" type="email" maxLength={254} defaultValue={profile?.email ?? ""} />
              <label htmlFor="website_url">Official website URL</label><input id="website_url" name="website_url" type="url" maxLength={2000} defaultValue={profile?.website_url ?? ""} placeholder="https://" />
              <label htmlFor="map_url">Google Maps share URL</label><input id="map_url" name="map_url" type="url" maxLength={2000} defaultValue={profile?.map_url ?? ""} placeholder="https://" />
              <label htmlFor="facebook_url">Facebook page URL</label><input id="facebook_url" name="facebook_url" type="url" maxLength={2000} defaultValue={profile?.facebook_url ?? ""} placeholder="https://" />
              <label htmlFor="instagram_url">Instagram URL</label><input id="instagram_url" name="instagram_url" type="url" maxLength={2000} defaultValue={profile?.instagram_url ?? ""} placeholder="https://" />
              <label htmlFor="youtube_url">YouTube URL</label><input id="youtube_url" name="youtube_url" type="url" maxLength={2000} defaultValue={profile?.youtube_url ?? ""} placeholder="https://" />
            </div>
            <div className="profile-save-note">Saving these fields publishes them to the public About and Contact pages. Confirm every detail with mosque management first.</div>
            <button className="btn-primary admin-submit" type="submit">Save mosque profile</button>
          </section>
        </form>
      </div>
    </main>
  );
}
