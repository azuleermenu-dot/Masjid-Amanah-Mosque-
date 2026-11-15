"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Clock3, HeartHandshake, MapPin, Megaphone, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const pathways = [
  { icon: Clock3, title: "Prayer times", copy: "Find the mosque's confirmed daily prayer information.", href: "/prayer-times", label: "View prayer information" },
  { icon: BookOpen, title: "Learning", copy: "Explore educational resources with reliable references.", href: "/learning", label: "Explore resources" },
  { icon: Users, title: "Programs", copy: "Discover classes, activities, and community gatherings.", href: "/programs", label: "See programs" },
];

export default function Home() {
  return (
    <>
      <div className="topline"><div className="container topline-inner"><span>MASJID AMANAH <i>·</i> <span className="arabic" lang="ar">مسجد الأمانة</span></span><span>Official mosque website</span></div></div>
      <SiteHeader />
      <main>
        <section className="home-hero" id="home">
          <div className="hero-pattern" aria-hidden="true" />
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="container hero-layout">
            <motion.div initial="hidden" animate="visible" variants={reveal} className="hero-copy">
              <span className="eyebrow">Welcome · أهلاً وسهلاً</span>
              <h1 className="display">A place to pause, <em>pray</em>, and belong.</h1>
              <p>Welcome to Masjid Amanah — a place of worship, knowledge, unity, and community.</p>
              <div className="hero-actions">
                <Link href="/prayer-times" className="btn-primary">Prayer information <ArrowRight size={15} /></Link>
                <Link href="/about" className="btn-light-outline">Discover the mosque</Link>
              </div>
              <div className="hero-caption"><span /> A COMMUNITY, ROOTED IN FAITH</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9 }} className="hero-art" aria-label="Decorative Islamic geometric artwork">
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
              <span className="eyebrow">A warm welcome · مرحباً بكم</span>
              <h2 className="display">A home for worship, learning, and connection.</h2>
            </div>
            <div className="welcome-copy">
              <p>Masjid Amanah's website brings together practical mosque information, community updates, learning resources, and ways to stay connected.</p>
              <p>Information specific to the mosque will be published only after it has been confirmed by its authorized representatives.</p>
              <Link href="/about" className="text-link">About Masjid Amanah <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </section>

        <section className="quick-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Explore · اكتشف</span>
              <h2 className="display">Find what you need.</h2>
              <p>Useful information and community resources, gathered in one place.</p>
            </div>
            <div className="quick-grid">
              {pathways.map(({ icon: Icon, title, copy, href, label }) => (
                <article className="quick-card" key={title}>
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
            <div><span className="eyebrow">Stay informed · ابق على اطلاع</span><h2 className="display">News and community updates.</h2><p>Official announcements and upcoming activities will be shared here when details are confirmed.</p><Link href="/news" className="text-link">Visit announcements <ArrowUpRight size={15} /></Link></div>
            <div className="update-placeholder"><Megaphone size={23} /><span className="eyebrow">Official announcements</span><h3>No announcements published yet.</h3><p>Check back for updates approved by mosque management.</p></div>
          </div>
        </section>

        <section className="support-section">
          <div className="support-pattern" aria-hidden="true" />
          <div className="container support-content">
            <span className="eyebrow">Support · المساهمة</span>
            <h2 className="display">Support the mosque with confidence.</h2>
            <p>Donation information will be shared only through payment methods and recipients verified by mosque management.</p>
            <Link href="/donations" className="btn-gold"><HeartHandshake size={16} /> Donation information <ArrowRight size={14} /></Link>
          </div>
        </section>

        <section className="location-strip">
          <div className="container location-inner">
            <span className="location-icon"><MapPin size={20} /></span>
            <div><strong>Find Masjid Amanah</strong><p>The official address and map location will be added after verification.</p></div>
            <Link href="/contact" className="text-link">Contact information <ArrowUpRight size={15} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
