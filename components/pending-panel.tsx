import { ShieldCheck } from "lucide-react";

export function PendingPanel({ title, description }: { title: string; description: string }) {
  return (
    <section className="pending-panel" aria-live="polite">
      <span className="pending-icon"><ShieldCheck size={21} strokeWidth={1.6} /></span>
      <div>
        <span className="eyebrow">Awaiting official confirmation</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
