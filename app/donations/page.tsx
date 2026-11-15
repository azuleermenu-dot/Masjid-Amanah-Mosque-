import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Donation Information" };

export default async function DonationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: methods, error } = supabase
    ? await supabase.from("donation_methods").select("id,label,purpose,instructions,provider_details,verified_by,verified_at").eq("is_published", true).not("verified_at", "is", null).order("created_at", { ascending: false })
    : { data: null, error: null };

  return (
    <PageShell eyebrow="Giving · الصدقة" title="Support the mosque responsibly." description="Find clear, verified information about supporting Masjid Amanah and its community.">
      <div className="donation-intro"><HeartHandshake size={30} strokeWidth={1.4} /><h2>Give through official channels only.</h2><p>Donation purposes, authorized recipients, and accepted payment methods must be confirmed by mosque management before being published.</p></div>
      {methods?.length ? <div className="donation-methods">{methods.map((method) => <article className="donation-method" key={method.id}>
        <span className="eyebrow">Verified donation method</span><h2>{method.label}</h2><p>{method.purpose}</p><div>{method.instructions}</div>{method.provider_details && <pre>{method.provider_details}</pre>}
        <small><ShieldCheck size={13} /> Verified by {method.verified_by} · {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(method.verified_at))}</small>
      </article>)}</div> : <PendingPanel title="Verified donation details are not available yet." description={error ? "Donation information could not be loaded." : "No bank account, GCash number, QR code, payment link, zakat recipient, or donation recipient is displayed until the mosque authorizes and verifies it. Please contact mosque management through its confirmed official channels."} />}
      <div className="trust-note"><ShieldCheck size={17} /><span>Protect yourself from unofficial payment requests. Verify donation instructions directly with the mosque.</span></div>
      {!supabase && <PendingPanel title="Donation information is not connected yet." description="A dedicated Masjid Amanah database is required before verified payment instructions can be published." />}
    </PageShell>
  );
}
