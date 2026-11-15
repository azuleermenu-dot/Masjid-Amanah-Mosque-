import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle, ExternalLink, Globe } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { ContactForm } from "./contact-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Contact & Location" };

export default async function ContactPage() {
  const supabase = await createSupabaseServerClient();
  const { data: profile, error } = supabase
    ? await supabase.from("mosque_profile").select("address,phone,email,website_url,map_url,facebook_url,instagram_url,youtube_url").eq("id", true).maybeSingle()
    : { data: null, error: null };

  const hasContactSetup = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    process.env.TURNSTILE_SECRET_KEY &&
    process.env.TURNSTILE_ALLOWED_HOSTNAMES,
  );

  const socialLinks = [
    { label: "Facebook", url: profile?.facebook_url },
    { label: "Instagram", url: profile?.instagram_url },
    { label: "YouTube", url: profile?.youtube_url },
  ].filter((item) => item.url?.trim());

  return (
    <PageShell eyebrow="Get in touch · اتصل بنا" title="We look forward to hearing from you." description="Official contact and location information for Masjid Amanah.">
      <div className="contact-grid">
        <article className="contact-card"><MapPin size={21} /><h2>Visit the mosque</h2>
          {profile?.address?.trim() ? <><p>{profile.address}</p>{profile.map_url?.trim() ? <a href={profile.map_url} target="_blank" rel="noopener noreferrer">Open map <ExternalLink size={13} /></a> : null}</> : <p>Official address and map location pending confirmation.</p>}
        </article>
        <article className="contact-card"><Phone size={21} /><h2>Call the mosque</h2>
          {profile?.phone?.trim() ? <p><a href={`tel:${profile.phone.replace(/[^+0-9]/g, "")}`}>{profile.phone}</a></p> : <p>Official telephone or mobile number pending confirmation.</p>}
        </article>
        <article className="contact-card"><Mail size={21} /><h2>Email</h2>
          {profile?.email?.trim() ? <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p> : <p>Official email address pending confirmation.</p>}
        </article>
        <article className="contact-card"><MessageCircle size={21} /><h2>Social channels</h2>
          {socialLinks.length ? <div className="social-contact-links">{socialLinks.map((item) => <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer">{item.label} <ExternalLink size={12} /></a>)}</div> : <p>Official social media links pending confirmation.</p>}
          {profile?.website_url?.trim() ? <a href={profile.website_url} target="_blank" rel="noopener noreferrer"><Globe size={13} /> Official website <ExternalLink size={12} /></a> : null}
        </article>
      </div>

      {hasContactSetup ? (
        <ContactForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />
      ) : (
        <PendingPanel title="Secure messaging setup is required." description="The inquiry form will be enabled after the dedicated Masjid Amanah database and Cloudflare Turnstile keys are configured. Submissions will be stored in the private administration inbox." />
      )}

      {error && <PendingPanel title="Contact details could not be loaded." description="Please check the mosque profile database setup. Only approved contact details will be displayed." />}
    </PageShell>
  );
}
