import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="system-state-screen">
      <section className="system-state-card">
        <span className="system-state-icon"><Compass size={24} /></span>
        <span className="eyebrow">404 · Page not found</span>
        <h1 className="display">This page could not be found.</h1>
        <p>The page may have moved, or the link may no longer be available. You can return to the Masjid Amanah homepage.</p>
        <Link href="/" className="btn-primary"><ArrowLeft size={15} /> Return home</Link>
      </section>
    </main>
  );
}
