import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: Props) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="page-hero-pattern" aria-hidden="true" />
          <div className="container page-hero-content">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="display">{title}</h1>
            <p>{description}</p>
            <span className="arabic page-arabic" lang="ar">مسجد الأمانة</span>
          </div>
        </section>
        <div className="container page-content">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
