export default function Loading() {
  return (
    <main className="system-loading-screen" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading Masjid Amanah page…</span>
      <div className="loading-brand"><span className="loading-mark">۞</span><span>MASJID AMANAH</span></div>
      <div className="loading-hero">
        <div className="loading-line loading-eyebrow" />
        <div className="loading-line loading-title" />
        <div className="loading-line loading-title-short" />
        <div className="loading-line loading-copy" />
        <div className="loading-line loading-button" />
      </div>
      <div className="loading-content">
        <div className="loading-line loading-section-title" />
        <div className="loading-card-grid">
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      </div>
    </main>
  );
}
