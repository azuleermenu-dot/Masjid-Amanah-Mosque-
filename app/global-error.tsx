"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    if (error.digest) console.error("Masjid Amanah global error:", error.digest);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f8f7f1", color: "#202923", fontFamily: "Arial, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ width: "min(100%, 520px)", padding: 36, background: "#fffefa", border: "1px solid #e7e7dd" }}>
            <p style={{ color: "#b99b63", letterSpacing: ".18em", fontSize: 11 }}>MASJID AMANAH · مسجد الأمانة</p>
            <h1 style={{ color: "#123d32", fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 40 }}>The website is temporarily unavailable.</h1>
            <p style={{ color: "#69736c", fontSize: 14, lineHeight: 1.8 }}>Please try loading the page again. Internal error details are not shown here.</p>
            <button onClick={() => reset()} style={{ minHeight: 46, padding: "0 18px", border: 0, background: "#123d32", color: "#fff", cursor: "pointer" }}>Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
