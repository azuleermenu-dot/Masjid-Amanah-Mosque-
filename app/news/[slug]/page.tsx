import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getAnnouncement(slug: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("announcements")
    .select("title,slug,excerpt,body,published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);

  if (!announcement) return { title: "Announcement not found" };

  return {
    title: announcement.title,
    description: announcement.excerpt || announcement.body.slice(0, 155),
  };
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);

  if (!announcement) notFound();

  return (
    <PageShell
      eyebrow="Official announcement · إعلان رسمي"
      title={announcement.title}
      description={announcement.excerpt || "An update published by Masjid Amanah."}
    >
      <article className="announcement-detail">
        <div className="announcement-detail-meta">
          <Link href="/news" className="announcement-back-link">
            <ArrowLeft size={14} /> Back to announcements
          </Link>
          {announcement.published_at ? (
            <span><CalendarDays size={14} />{new Intl.DateTimeFormat("en-PH", {
              dateStyle: "long",
              timeZone: "Asia/Manila",
            }).format(new Date(announcement.published_at))}</span>
          ) : null}
        </div>
        <div className="announcement-detail-body">{announcement.body}</div>
        <div className="announcement-detail-bottom">
          <span className="eyebrow">Masjid Amanah · مسجد الأمانة</span>
          <Link href="/news" className="text-link">More announcements <ArrowLeft size={14} /></Link>
        </div>
      </article>
    </PageShell>
  );
}
