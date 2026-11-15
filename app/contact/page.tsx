import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = { title: "Contact & Location" };

export default function ContactPage() {
  return (
    <PageShell eyebrow="Get in touch · اتصل بنا" title="We look forward to hearing from you." description="Official contact and location information for Masjid Amanah.">
      <div className="contact-grid">
        <article className="contact-card"><MapPin size={21} /><h2>Visit the mosque</h2><p>Official address and map location pending confirmation.</p></article>
        <article className="contact-card"><Phone size={21} /><h2>Call the mosque</h2><p>Official telephone or mobile number pending confirmation.</p></article>
        <article className="contact-card"><Mail size={21} /><h2>Email</h2><p>Official email address pending confirmation.</p></article>
        <article className="contact-card"><MessageCircle size={21} /><h2>Social channels</h2><p>Official social media links pending confirmation.</p></article>
      </div>
      <PendingPanel title="Contact details need verification." description="The website will not publish a guessed address, map pin, phone number, email, or social account. An inquiry form will be enabled once a verified recipient and secure submission service are configured." />
    </PageShell>
  );
}
