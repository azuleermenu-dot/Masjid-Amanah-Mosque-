"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useLanguage, type Language } from "@/components/language-provider";

const navGroups = [
  {
    key: "worship",
    links: [
      { key: "prayerTimes", href: "/prayer-times" },
      { key: "programs", href: "/programs" },
    ],
  },
  {
    key: "discover",
    links: [
      { key: "about", href: "/about" },
      { key: "news", href: "/news" },
      { key: "gallery", href: "/gallery" },
    ],
  },
  {
    key: "education",
    links: [
      { key: "learning", href: "/learning" },
      { key: "madrasah", href: "/education" },
    ],
  },
] as const;

function LanguageSelect({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className={mobile ? "language-picker mobile-language-picker" : "language-picker"}>
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
  );
}

function NavigationGroups({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isCurrentPath = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      {navGroups.map((group) => (
        <details className={`${mobile ? "nav-group mobile-nav-group" : "nav-group"}${group.links.some((item) => isCurrentPath(item.href)) ? " is-active" : ""}`} key={group.key}>
          <summary>
            <span>{t(group.key)}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div className="nav-dropdown">
            {group.links.map((item) => (
              <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={isCurrentPath(item.href) ? "page" : undefined}>
                {t(item.key)}
                {mobile ? <ArrowUpRight size={13} aria-hidden="true" /> : null}
              </Link>
            ))}
          </div>
        </details>
      ))}
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Masjid Amanah home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">۞</span>
          <span className="brand-copy">
            <strong>MASJID AMANAH</strong>
            <span className="arabic" lang="ar">مسجد الأمانة</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className="nav-home-link" href="/" aria-current={pathname === "/" ? "page" : undefined}>{t("home")}</Link>
          <NavigationGroups />
        </nav>

        <LanguageSelect />
        <Link href="/contact" className="header-contact">
          {t("contact")} <ArrowUpRight size={14} aria-hidden="true" />
        </Link>

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

      {open ? (
        <>
          <button
            className="mobile-nav-backdrop"
            type="button"
            aria-label={t("closeNavigation")}
            onClick={closeMenu}
          />
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            <Link className="mobile-home-link" href="/" onClick={closeMenu}>{t("home")}</Link>
            <NavigationGroups mobile onNavigate={closeMenu} />
            <Link href="/donations" onClick={closeMenu}>{t("donationInfo")}</Link>
            <Link href="/contact" onClick={closeMenu}>{t("contactMosque")}</Link>
            <LanguageSelect mobile />
          </nav>
        </>
      ) : null}
    </header>
  );
}
