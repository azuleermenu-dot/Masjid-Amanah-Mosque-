"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    // Log only the digest for platform diagnostics; do not display internal details.
    if (error.digest) console.error("Masjid Amanah page error:", error.digest);
  }, [error]);

  return (
    <main className="system-state-screen">
      <section className="system-state-card" role="alert" aria-live="assertive">
        <span className="system-state-icon"><AlertCircle size={24} /></span>
        <span className="eyebrow">Something went wrong</span>
        <h1 className="display">This page is temporarily unavailable.</h1>
        <p>Please try again. Your visit has not changed any mosque information or administrative content.</p>
        <div className="system-state-actions">
          <button type="button" className="btn-primary" onClick={() => reset()}>
            <RefreshCw size={15} /> Try again
          </button>
          <Link href="/" className="system-state-link"><ArrowLeft size={14} /> Return home</Link>
        </div>
      </section>
    </main>
  );
}
