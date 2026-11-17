"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLanguage, type Language } from "@/components/language-provider";

const links = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "prayerTimes", href: "/prayer-times" },
  { key: "programs", href: "/programs" },
  { key: "learning", href: "/learning" },
  { key: "madrasah", href: "/education" },
  { key: "news", href: "/news" },
  { key: "gallery", href: "/gallery" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Masjid Amanah home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">۞</span>
          <span className="brand-copy">
            <strong>MASJID AMANAH</strong>
            <span className="arabic" lang="ar">مسجد الأمانة</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((item) => <Link key={item.href} href={item.href}>{t(item.key)}</Link>)}
        </nav>

        <label className="language-picker">
          <span>{t("language")}</span>
          <select
            value={language}
            aria-label={t("language")}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="tl">Filipino / Tagalog</option>
            <option value="mr">Maranao</option>
            <option value="ar">العربية</option>
          </select>
        </label>

        <Link href="/contact" className="header-contact">{t("contact")} <ArrowUpRight size={14} /></Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? t("closeNavigation") : t("openNavigation")}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {links.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{t(item.key)}</Link>
          ))}
          <Link href="/donations" onClick={() => setOpen(false)}>{t("donationInfo")}</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>{t("contactMosque")}</Link>
        </nav>
      )}
    </header>
  );
}
