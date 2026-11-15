import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "Donation Information" };

export default function DonationsPage() {
  return (
    <PageShell eyebrow="Giving · الصدقة" title="Support the mosque responsibly." description="Find clear, verified information about supporting Masjid Amanah and its community.">
      <div className="donation-intro">
        <HeartHandshake size={30} strokeWidth={1.4} />
        <h2>Give through official channels only.</h2>
        <p>Donation purposes, authorized recipients, and accepted payment methods must be confirmed by mosque management before being published.</p>
      </div>
      <PendingPanel title="Verified donation details are not available yet." description="No bank account, GCash number, QR code, payment link, zakat recipient, or donation recipient is displayed until the mosque authorizes and verifies it. Please contact mosque management through its confirmed official channels." />
      <div className="trust-note"><ShieldCheck size={17} /><span>Protect yourself from unofficial payment requests. Verify donation instructions directly with the mosque.</span></div>
    </PageShell>
  );
}
