"use client";

import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: Props) {
  const { language, translateText } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main lang={language === "tl" ? "fil" : language} dir={language === "ar" ? "rtl" : "ltr"}>
        <section className="page-hero">
          <div className="page-hero-pattern" aria-hidden="true" />
          <div className="container page-hero-content">
            <span className="eyebrow">{translateText(eyebrow)}</span>
            <h1 className="display">{translateText(title)}</h1>
            <p>{translateText(description)}</p>
            <span className="arabic page-arabic" lang="ar">مسجد الأمانة</span>
          </div>
        </section>
        <div className="container page-content">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
