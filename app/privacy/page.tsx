import type { Metadata } from "next";
import { ShieldCheck, Database, UserRound, Clock3, Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Masjid Amanah handles information submitted through this website.",
};

const sections = [
  {
    icon: UserRound,
    title: "Information you submit",
    body: "When the contact form is enabled, it collects the name, email address, and message you choose to submit. Do not include passwords, payment credentials, government identification numbers, health details, or other sensitive information.",
  },
  {
    icon: Database,
    title: "Why information is used",
    body: "Contact details are used to receive, review, and respond to messages sent to the mosque. The website also uses an anti-bot verification service to help protect the form from automated abuse.",
  },
  {
    icon: ShieldCheck,
    title: "Access and protection",
    body: "Contact inquiries are stored in the configured mosque website database. The administration inbox is restricted to accounts specifically authorized by mosque management. Public visitors cannot browse submitted inquiries.",
  },
  {
    icon: Clock3,
    title: "Retention",
    body: "The mosque must approve and document a retention period for contact inquiries before the form is enabled for public use. Records should be kept only for the approved operational and record-keeping purpose, then handled according to that schedule.",
  },
  {
    icon: Mail,
    title: "Privacy questions or requests",
    body: "For questions about a message you submitted or a request concerning your information, use the verified contact channels on the Contact page. The mosque must provide an authorized privacy contact before the website is launched.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy · الخصوصية"
      title="Your information deserves care."
      description="This notice explains how information submitted through the Masjid Amanah website is intended to be handled."
    >
      <div className="privacy-intro">
        <span className="eyebrow">Website privacy notice</span>
        <p>
          This website is designed to collect only the information needed to respond to messages sent to the mosque. The final notice, data-retention schedule, and privacy contact must be reviewed and approved by authorized Masjid Amanah management before the public contact form is enabled.
        </p>
      </div>

      <div className="privacy-sections">
        {sections.map(({ icon: Icon, title, body }, index) => (
          <section className="privacy-section" key={title}>
            <span className="privacy-icon"><Icon size={19} /></span>
            <div>
              <span className="eyebrow">0{index + 1}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>

      <PendingPanel
        title="Management approval is required before launch."
        description="Mosque management should confirm the privacy contact, retention schedule, approved processing purposes, and final wording of this notice before public inquiry submissions are enabled."
      />
    </PageShell>
  );
}
