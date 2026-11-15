import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link className="brand brand-light" href="/">
            <span className="brand-mark" aria-hidden="true">۞</span>
            <span className="brand-copy">
              <strong>MASJID AMANAH</strong>
              <span className="arabic" lang="ar">مسجد الأمانة</span>
            </span>
          </Link>
          <p>A place of worship, knowledge, unity, and community.</p>
        </div>
        <div>
          <span className="footer-label">Explore</span>
          <div className="footer-links">
            <Link href="/about">About the mosque</Link>
            <Link href="/prayer-times">Prayer times</Link>
            <Link href="/programs">Programs & activities</Link>
            <Link href="/learning">Islamic learning</Link>
          </div>
        </div>
        <div>
          <span className="footer-label">Information</span>
          <div className="footer-links">
            <Link href="/news">News & announcements</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/donations">Donation information</Link>
            <Link href="/contact">Contact & location</Link>
          </div>
        </div>
        <div className="footer-contact">
          <span className="footer-label">Official details</span>
          <p>Address, contact channels, and official social links will be published after confirmation by mosque management.</p>
          <span className="pending-label">Details pending verification</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Masjid Amanah. All rights reserved.</span>
        <span className="arabic" lang="ar">مسجد الأمانة</span>
      </div>
    </footer>
  );
}
