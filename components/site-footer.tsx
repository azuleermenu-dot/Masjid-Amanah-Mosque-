"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();

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
          <p>{t("footerTagline")}</p>
        </div>
        <div>
          <span className="footer-label">{t("footerExplore")}</span>
          <div className="footer-links">
            <Link href="/about">{t("aboutMasjid")}</Link>
            <Link href="/prayer-times">{t("prayerTimes")}</Link>
            <Link href="/programs">{t("programs")}</Link>
            <Link href="/learning">{t("learning")}</Link>
          </div>
        </div>
        <div>
          <span className="footer-label">{t("footerInformation")}</span>
          <div className="footer-links">
            <Link href="/news">{t("news")}</Link>
            <Link href="/gallery">{t("gallery")}</Link>
            <Link href="/donations">{t("donationInfo")}</Link>
            <Link href="/contact">{t("contactInformation")}</Link>
            <Link href="/privacy">{t("privacyNotice")}</Link>
          </div>
        </div>
        <div className="footer-contact">
          <span className="footer-label">{t("footerOfficialDetails")}</span>
          <p>{t("footerPending")}</p>
          <span className="pending-label">{t("pendingVerification")}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Masjid Amanah. {t("allRightsReserved")}</span>
        <span className="arabic" lang="ar">مسجد الأمانة</span>
      </div>
    </footer>
  );
}
