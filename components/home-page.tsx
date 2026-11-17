"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Clock3, HeartHandshake, MapPin, Megaphone, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

export type MosqueHomeProfile = {
  introduction: string | null;
  address: string | null;
  map_url: string | null;
};

export type LatestAnnouncement = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published_at: string | null;
};

export default function HomePage({
  profile,
  latestAnnouncement,
}: {
  profile: MosqueHomeProfile | null;
  latestAnnouncement: LatestAnnouncement | null;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { t, language } = useLanguage();
  const pathways = [
    { icon: Clock3, title: t("prayerTimes"), copy: t("prayerCopy"), href: "/prayer-times", label: t("viewPrayerInfo") },
    { icon: BookOpen, title: t("learning"), copy: t("learningCopy"), href: "/learning", label: t("exploreResources") },
    { icon: Users, title: t("programs"), copy: t("programsCopy"), href: "/programs", label: t("seePrograms") },
  ];
  const dateLocale = language === "tl" ? "fil-PH" : language === "mr" ? "en-PH" : language === "ar" ? "ar" : "en-PH";

  return (
    <>
      <div className="topline"><div className="container topline-inner"><span>MASJID AMANAH <i>·</i> <span className="arabic" lang="ar">مسجد الأمانة</span></span><span>{t("unofficial")}</span></div></div>
      <SiteHeader />
      <main>
        <section className="home-hero" id="home">
          <div className="hero-pattern" aria-hidden="true" />
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="container hero-layout">
            <motion.div initial={shouldReduceMotion ? false : "hidden"} animate="visible" variants={reveal} className="hero-copy">
              <span className="eyebrow">{t("welcome")}</span>
              <h1 className="display">{t("heroTitle")}</h1>
              <p>{t("heroIntro")}</p>
              <div className="hero-actions">
                <Link href="/prayer-times" className="btn-primary">{t("prayerInformation")} <ArrowRight size={15} /></Link>
                <Link href="/about" className="btn-light-outline">{t("discoverMosque")}</Link>
              </div>
              <div className="hero-caption"><span /> {t("communityRooted")}</div>
            </motion.div>
            <motion.div initial={shouldReduceMotion ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: shouldReduceMotion ? 0 : .9 }} className="hero-art" aria-label="Decorative Islamic geometric artwork">
              <div className="art-diamond diamond-one" />
              <div className="art-diamond diamond-two" />
              <div className="art-emblem">
                <span className="arabic" lang="ar">الأمانة</span>
                <i />
                <small>MASJID AMANAH</small>
              </div>
              <span className="art-note">ISLAMIC GEOMETRIC ARTWORK · ILLUSTRATIVE</span>
            </motion.div>
          </div>
          <a className="hero-scroll" href="#welcome" aria-label="Scroll to introduction">↓</a>
        </section>

        <section className="section welcome-section" id="welcome">
          <div className="container welcome-layout">
            <div className="section-heading">
              <span className="eyebrow">{t("warmWelcome")}</span>
              <h2 className="display">{t("introTitle")}</h2>
            </div>
            <div className="welcome-copy">
              <p>{profile?.introduction?.trim() || t("introBody")}</p>
              <p>{t("verificationNote")}</p>
              <Link href="/about" className="text-link">{t("aboutMasjid")} <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </section>

        <section className="quick-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">{t("explore")}</span>
              <h2 className="display">{t("findWhatYouNeed")}</h2>
              <p>{t("resourcesIntro")}</p>
            </div>
            <div className="quick-grid">
              {pathways.map(({ icon: Icon, title, copy, href, label }) => (
                <article className="quick-card" key={href}>
                  <span className="quick-icon"><Icon size={21} strokeWidth={1.6} /></span>
                  <h3>{title}</h3><p>{copy}</p>
                  <Link href={href}>{label} <ArrowRight size={14} /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section updates-section">
          <div className="container updates-layout">
            <div>
              <span className="eyebrow">{t("stayInformed")}</span>
              <h2 className="display">{t("updatesTitle")}</h2>
              <p>{t("updatesIntro")}</p>
              <Link href="/news" className="text-link">{t("visitAnnouncements")} <ArrowUpRight size={15} /></Link>
            </div>
            <div className="update-placeholder">
              <Megaphone size={23} /><span className="eyebrow">{t("officialAnnouncements")}</span>
              {latestAnnouncement ? <>
                <h3><Link href={"/news/" + latestAnnouncement.slug}>{latestAnnouncement.title}</Link></h3>
                <p>{latestAnnouncement.excerpt || latestAnnouncement.body.slice(0, 180)}</p>
                {latestAnnouncement.published_at ? <time dateTime={latestAnnouncement.published_at}>{new Intl.DateTimeFormat(dateLocale, { dateStyle: "long", timeZone: "Asia/Manila" }).format(new Date(latestAnnouncement.published_at))}</time> : null}
              </> : <>
                <h3>{t("latestAnnouncement")}</h3>
                <p>{t("announcementFallback")}</p>
              </>}
              <Link href="/news" className="text-link">{t("readAnnouncements")} <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </section>

        <section className="support-section">
          <div className="support-pattern" aria-hidden="true" />
          <div className="container support-content">
            <span className="eyebrow">{t("support")}</span>
            <h2 className="display">{t("supportTitle")}</h2>
            <p>{t("supportIntro")}</p>
            <Link href="/donations" className="btn-gold"><HeartHandshake size={16} /> {t("donationInformation")} <ArrowRight size={14} /></Link>
          </div>
        </section>

        <section className="location-strip">
          <div className="container location-inner">
            <span className="location-icon"><MapPin size={20} /></span>
            <div><strong>{t("findMasjid")}</strong><p>{profile?.address?.trim() || t("addressPending")}</p></div>
            {profile?.map_url?.trim() ? <a href={profile.map_url} className="text-link" target="_blank" rel="noopener noreferrer">{t("openMap")} <ArrowUpRight size={15} /></a> : <Link href="/contact" className="text-link">{t("contactInformation")} <ArrowUpRight size={15} /></Link>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
