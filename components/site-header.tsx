"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Prayer times", href: "/prayer-times" },
  { label: "Programs", href: "/programs" },
  { label: "Learning", href: "/learning" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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
          {links.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>

        <Link href="/contact" className="header-contact">Contact <ArrowUpRight size={14} /></Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
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
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link href="/donations" onClick={() => setOpen(false)}>Donation information</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact the mosque</Link>
        </nav>
      )}
    </header>
  );
}
