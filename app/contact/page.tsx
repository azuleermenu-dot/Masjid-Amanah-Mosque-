import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact & Location" };

export default function ContactPage() {
  const hasContactSetup = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.TURNSTILE_ALLOWED_HOSTNAMES,
  );

  return (
    <PageShell eyebrow="Get in touch · اتصل بنا" title="We look forward to hearing from you." description="Official contact and location information for Masjid Amanah.">
      <div className="contact-grid">
        <article className="contact-card"><MapPin size={21} /><h2>Visit the mosque</h2><p>Official address and map location pending confirmation.</p></article>
        <article className="contact-card"><Phone size={21} /><h2>Call the mosque</h2><p>Official telephone or mobile number pending confirmation.</p></article>
        <article className="contact-card"><Mail size={21} /><h2>Email</h2><p>Official email address pending confirmation.</p></article>
        <article className="contact-card"><MessageCircle size={21} /><h2>Social channels</h2><p>Official social media links pending confirmation.</p></article>
      </div>

      {hasContactSetup ? (
        <ContactForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />
      ) : (
        <PendingPanel
          title="Secure messaging setup is required."
          description="The inquiry form will be enabled after the dedicated Masjid Amanah database and Cloudflare Turnstile keys are configured. Submissions will be stored in the private administration inbox."
        />
      )}

      <PendingPanel title="Contact details need verification." description="The website will not publish a guessed address, map pin, phone number, email, or social account. These details will be added after confirmation by mosque management." />
    </PageShell>
  );
}
