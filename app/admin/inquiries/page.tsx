import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Inbox, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { updateInquiryStatus } from "./actions";

export const metadata: Metadata = { title: "Contact Inquiries", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function InquiriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: inquiries, error } = await supabase.from("contact_inquiries")
    .select("id,full_name,email,message,status,created_at")
    .order("created_at", { ascending: false }).limit(100);

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar"><Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link><form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form></header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Private correspondence</span><h1 className="display">Inquiries</h1><p>Messages are visible only to authorized mosque administrators.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>
        {params.saved === "1" && <p className="success-message" role="status">Inquiry status updated.</p>}
        {params.error && <p className="form-error" role="alert">The inquiry could not be updated. Check database setup and permissions.</p>}
        <section className="admin-list-section"><div className="admin-section-heading"><Inbox size={18} /><h2>Contact messages</h2></div>
          {error ? <p className="form-error">Unable to load inquiries.</p> : !inquiries?.length ? <p className="admin-empty">No contact inquiries received.</p> : <div className="inquiry-list">{inquiries.map((item) => <article className="inquiry-card" key={item.id}>
            <div className="inquiry-heading"><div><strong>{item.full_name}</strong><a href={`mailto:${item.email}`}>{item.email}</a></div><time dateTime={item.created_at}>{new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(item.created_at))}</time></div>
            <p>{item.message}</p>
            <form action={updateInquiryStatus} className="inquiry-status-form"><input type="hidden" name="id" value={item.id} /><label htmlFor={`status-${item.id}`}>Status</label><select id={`status-${item.id}`} name="status" defaultValue={item.status}><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="spam">Spam</option></select><button className="btn-primary" type="submit">Update status</button></form>
          </article>)}</div>}
        </section>
      </div>
    </main>
  );
}
