"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Clock3, Menu, X, BookOpen, Users, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  ["About", "#about"],
  ["Prayer times", "#prayer-times"],
  ["Programs", "#programs"],
  ["Updates", "#updates"],
  ["Contact", "#contact"],
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <div style={{ background: "var(--green-deep)", color: "#e9e7db", fontSize: 11, letterSpacing: ".08em" }}>
        <div className="container" style={{ minHeight: 34, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span>MASJID AMANAH <span style={{ color: "var(--gold)" }}>·</span> مسجد الأمانة</span>
          <span style={{ opacity: .72 }}>Official mosque website</span>
        </div>
      </div>

      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", position: "relative", zIndex: 20 }}>
        <div className="container" style={{ minHeight: 82, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <a href="#home" aria-label="Masjid Amanah home" style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <span style={{ width: 42, height: 42, display: "grid", placeItems: "center", border: "1px solid #d8c9a7", color: "var(--green)", fontSize: 23, borderRadius: "50%" }}>۞</span>
            <span>
              <strong style={{ display: "block", fontSize: 13, letterSpacing: ".12em", color: "var(--green)" }}>MASJID AMANAH</strong>
              <span className="arabic" style={{ display: "block", fontSize: 15, color: "var(--gold)", lineHeight: 1.3 }}>مسجد الأمانة</span>
            </span>
          </a>

          <nav aria-label="Main navigation" className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {navItems.map(([label, href]) => <a key={label} href={href} style={{ fontSize: 12, color: "var(--muted)" }}>{label}</a>)}
          </nav>
          <a href="#contact" className="btn-primary desktop-cta">Get in touch <ArrowRight size={14} /></a>
          <button aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu" style={{ display: "none", border: 0, background: "transparent", color: "var(--green)", padding: 8 }}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && <nav aria-label="Mobile navigation" style={{ display: "grid", gap: 0, padding: "0 24px 18px", background: "var(--paper)" }}>
          {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: "13px 0", borderTop: "1px solid var(--line)", fontSize: 13 }}>{label}</a>)}
        </nav>}
      </header>

      <section id="home" style={{ background: "var(--green-deep)", color: "white", position: "relative", overflow: "hidden", minHeight: 650 }}>
        <div className="pattern" style={{ position: "absolute", inset: 0, opacity: .65 }} />
        <div style={{ position: "absolute", width: 600, height: 600, border: "1px solid rgba(185,155,99,.18)", borderRadius: "50%", right: "-120px", top: "-180px" }} />
        <div style={{ position: "absolute", width: 440, height: 440, border: "1px solid rgba(185,155,99,.16)", borderRadius: "50%", right: "-40px", top: "-100px" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, minHeight: 650, display: "grid", gridTemplateColumns: "1.05fr .95fr", alignItems: "center", gap: 40, paddingTop: 70, paddingBottom: 70 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <SectionLabel>Welcome · أهلاً وسهلاً</SectionLabel>
            <h1 className="display" style={{ fontSize: "clamp(54px, 7vw, 88px)", lineHeight: .98, margin: "22px 0 22px", maxWidth: 620 }}>A place to pause, <em style={{ color: "#d7c49b", fontWeight: 400 }}>pray</em>, and belong.</h1>
            <p style={{ maxWidth: 470, color: "rgba(255,255,255,.7)", lineHeight: 1.9, fontSize: 14 }}>Welcome to Masjid Amanah — a place of worship, knowledge, unity, and community.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <a className="btn-primary" href="#prayer-times" style={{ background: "#c4a875", borderColor: "#c4a875", color: "#152f27" }}>Prayer information <ArrowRight size={14} /></a>
              <a className="btn-outline" href="#about">Discover the mosque</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 52, color: "rgba(255,255,255,.55)", fontSize: 11, letterSpacing: ".08em" }}>
              <span style={{ width: 34, height: 1, background: "var(--gold)" }} /> A COMMUNITY, ROOTED IN FAITH
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9 }} style={{ minHeight: 440, display: "grid", placeItems: "center", position: "relative" }} aria-label="Decorative Islamic geometric artwork">
            <div style={{ position: "absolute", width: "min(100%, 430px)", aspectRatio: "1", border: "1px solid rgba(201,174,125,.45)", transform: "rotate(45deg)" }} />
            <div style={{ position: "absolute", width: "min(84%, 360px)", aspectRatio: "1", border: "1px solid rgba(201,174,125,.32)", transform: "rotate(22.5deg)" }} />
            <div style={{ position: "relative", width: "min(72%, 310px)", aspectRatio: ".78", border: "1px solid rgba(201,174,125,.7)", borderRadius: "48% 48% 4px 4px", background: "linear-gradient(160deg, rgba(217,198,158,.16), rgba(255,255,255,.015))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "0 30px 100px rgba(0,0,0,.18)" }}>
              <span className="arabic" style={{ color: "#e0cda5", fontSize: 54 }}>الأمانة</span>
              <span style={{ width: 45, height: 1, background: "var(--gold)", margin: "14px 0" }} />
              <span style={{ color: "rgba(255,255,255,.6)", fontSize: 9, letterSpacing: ".24em" }}>MASJID AMANAH</span>
            </div>
            <span style={{ position: "absolute", bottom: 10, right: 0, color: "rgba(255,255,255,.42)", fontSize: 10, letterSpacing: ".12em" }}>ISLAMIC GEOMETRIC ARTWORK · ILLUSTRATIVE</span>
          </motion.div>
        </div>
        <a href="#about" aria-label="Scroll to learn about the mosque" style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,.55)" }}><ArrowDown size={17} /></a>
      </section>

      <section id="prayer-times" className="section" style={{ background: "var(--paper)" }}>
        <div className="container">
          <div className="section-heading">
            <SectionLabel>Prayer information · مواقيت الصلاة</SectionLabel>
            <h2>A moment for what matters.</h2>
            <p>Prayer times will be published here once confirmed by Masjid Amanah management. Please refer to the mosque directly for the current congregational schedule.</p>
          </div>
          <div style={{ border: "1px solid var(--line)", background: "var(--ivory)", padding: "30px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 48, height: 48, display: "grid", placeItems: "center", background: "var(--green-soft)", color: "var(--green)" }}><Clock3 /></span>
              <div><strong style={{ display: "block", fontSize: 14, color: "var(--green)" }}>Prayer schedule pending confirmation</strong><span style={{ display: "block", color: "var(--muted)", fontSize: 12, marginTop: 5 }}>Official times will appear after verification.</span></div>
            </div>
            <span style={{ border: "1px solid #d8d8ca", padding: "9px 13px", fontSize: 10, letterSpacing: ".12em", color: "var(--muted)" }}>NOT YET PUBLISHED</span>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: " .85fr 1.15fr", gap: 80, alignItems: "start" }}>
          <div>
            <SectionLabel>About the mosque · عن المسجد</SectionLabel>
            <h2 className="display" style={{ fontSize: "clamp(42px, 5vw, 62px)", lineHeight: 1.03, margin: "18px 0" }}>A home for worship and community.</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.9, fontSize: 13 }}>Learn about Masjid Amanah, its story, the people who serve it, and the community it welcomes.</p>
            <a href="#contact" style={{ display: "inline-flex", gap: 9, alignItems: "center", color: "var(--green)", fontSize: 12, fontWeight: 700, marginTop: 22 }}>Ask the mosque directly <ArrowRight size={14} /></a>
          </div>
          <div style={{ borderTop: "1px solid var(--line)" }}>
            {[
              ["Our story", "The mosque's history and establishment will be shared when verified by its representatives."],
              ["Our mission", "The official mission and vision will be published following confirmation."],
              ["Our community", "Information about community services and facilities will be added with approval."],
            ].map(([title, text], i) => <div key={title} style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 16, padding: "25px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ color: "var(--gold)", fontFamily: "var(--font-display)", fontSize: 20 }}>0{i + 1}</span>
              <div><h3 style={{ margin: "0 0 8px", color: "var(--green)", fontSize: 16, fontWeight: 600 }}>{title}</h3><p style={{ margin: 0, color: "var(--muted)", fontSize: 12, lineHeight: 1.8 }}>{text}</p></div>
            </div>)}
          </div>
        </div>
      </section>

      <section id="programs" className="section" style={{ background: "#eef1e9" }}>
        <div className="container">
          <div className="section-heading">
            <SectionLabel>Community · المجتمع</SectionLabel>
            <h2>Growing together in knowledge.</h2>
            <p>Updates about classes, gatherings, and community programs will be listed here once details are confirmed.</p>
          </div>
          <div className="program-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              [BookOpen, "Qur'an & learning", "Information about learning sessions will be announced by the mosque."],
              [Users, "Community programs", "Community activities and services will be shared when scheduled."],
              [CalendarDays, "Events & gatherings", "Upcoming events will be published with confirmed dates and details."],
            ].map(([Icon, title, desc]: any) => <article key={title} style={{ background: "var(--paper)", padding: 28, minHeight: 220, border: "1px solid #e2e5dc" }}>
              <Icon size={22} color="var(--gold)" strokeWidth={1.5} />
              <h3 style={{ color: "var(--green)", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 25, margin: "28px 0 9px" }}>{title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.8 }}>{desc}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="updates" className="section" style={{ background: "var(--paper)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <SectionLabel>Stay informed · آخر الأخبار</SectionLabel>
            <h2 className="display" style={{ fontSize: "clamp(42px, 5vw, 58px)", lineHeight: 1.04, margin: "18px 0" }}>News from the mosque.</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.9 }}>Official announcements, schedule changes, and community updates will be shared here.</p>
          </div>
          <div style={{ border: "1px solid var(--line)", padding: 28, display: "flex", gap: 18, alignItems: "flex-start" }}>
            <span style={{ width: 42, height: 42, background: "var(--green-soft)", display: "grid", placeItems: "center", color: "var(--green)", flexShrink: 0 }}><Megaphone size={19} /></span>
            <div><span className="eyebrow">Announcements</span><h3 style={{ fontFamily: "var(--font-display)", color: "var(--green)", fontWeight: 500, fontSize: 24, margin: "10px 0" }}>No announcements published yet</h3><p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.8, margin: 0 }}>Please check back for updates approved by mosque management.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--green)", color: "white", position: "relative", overflow: "hidden" }}>
        <div className="pattern" style={{ position: "absolute", inset: 0, opacity: .35 }} />
        <div className="container" style={{ position: "relative", textAlign: "center", maxWidth: 760 }}>
          <SectionLabel>Support the community</SectionLabel>
          <h2 className="display" style={{ fontSize: "clamp(42px, 6vw, 64px)", margin: "18px 0", lineHeight: 1.02 }}>Every act of care begins with intention.</h2>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1.9, maxWidth: 540, margin: "0 auto 28px" }}>For verified donation information and authorized giving methods, please contact Masjid Amanah management directly.</p>
          <a href="#contact" className="btn-primary" style={{ background: "#c4a875", borderColor: "#c4a875", color: "#152f27" }}>Request donation information <ArrowRight size={14} /></a>
        </div>
      </section>

      <footer id="contact" style={{ background: "#0b2822", color: "white", padding: "76px 0 24px" }}>
        <div className="container">
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr .7fr .8fr", gap: 50, paddingBottom: 58 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "var(--gold)", fontSize: 28 }}>۞</span>
                <div><strong style={{ display: "block", letterSpacing: ".13em", fontSize: 12 }}>MASJID AMANAH</strong><span className="arabic" style={{ color: "#c8ad7c", fontSize: 15 }}>مسجد الأمانة</span></div>
              </div>
              <p style={{ color: "rgba(255,255,255,.58)", maxWidth: 330, fontSize: 12, lineHeight: 1.9, marginTop: 20 }}>A place of worship, knowledge, unity, and community.</p>
            </div>
            <div><span className="eyebrow">Explore</span><div style={{ display: "grid", gap: 14, marginTop: 20 }}>{navItems.map(([label, href]) => <a key={label} href={href} style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>{label}</a>)}</div></div>
            <div><span className="eyebrow">Contact</span><p style={{ color: "rgba(255,255,255,.58)", fontSize: 12, lineHeight: 1.8, marginTop: 20 }}>Official contact details and mosque location will be added after verification.</p><span style={{ color: "#c8ad7c", fontSize: 11 }}>Contact information pending</span></div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.13)", paddingTop: 20, display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", color: "rgba(255,255,255,.42)", fontSize: 10 }}>
            <span>© {new Date().getFullYear()} Masjid Amanah. All rights reserved.</span><span>Built with care and respect.</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media (max-width: 760px) {
          .desktop-nav, .desktop-cta { display: none !important; }
          .mobile-menu { display: block !important; }
          #home > .container { grid-template-columns: 1fr !important; gap: 12px !important; padding-top: 76px !important; padding-bottom: 70px !important; }
          #home > .container > div:nth-child(2) { min-height: 330px !important; }
          #about > .container { grid-template-columns: 1fr !important; gap: 30px !important; }
          .program-grid { grid-template-columns: 1fr !important; }
          #updates > .container { grid-template-columns: 1fr !important; gap: 28px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 34px !important; }
        }
      `}</style>
    </main>
  );
}
