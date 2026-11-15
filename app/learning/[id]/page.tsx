import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 300;

type Props = {
  params: Promise<{ id: string }>;
};

async function getPublishedResource(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("learning_resources")
    .select("id,title,resource_type,summary,body,source_reference,external_url,reviewed_by,created_at,updated_at")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resource = await getPublishedResource(id);
  if (!resource) return { title: "Learning resource not found" };

  return {
    title: resource.title,
    description: resource.summary || resource.body?.slice(0, 155) || "An educational resource published by Masjid Amanah.",
  };
}

export default async function LearningResourceDetailPage({ params }: Props) {
  const { id } = await params;
  const resource = await getPublishedResource(id);
  if (!resource) notFound();

  const typeLabels: Record<string, string> = {
    quran: "Qur'an resource",
    hadith: "Hadith reference",
    article: "Educational article",
    external: "External learning resource",
  };
  const typeLabel = typeLabels[resource.resource_type] ?? "Learning resource";

  return (
    <PageShell
      eyebrow={`Knowledge · ${typeLabel}`}
      title={resource.title}
      description={resource.summary || "An educational resource published by Masjid Amanah."}
    >
      <article className="learning-detail">
        <div className="learning-detail-meta">
          <Link href="/learning" className="announcement-back-link">
            <ArrowLeft size={14} /> Back to learning resources
          </Link>
          {resource.source_reference ? <span>Source: {resource.source_reference}</span> : null}
        </div>

        {resource.body ? (
          <div className="learning-detail-body">{resource.body}</div>
        ) : (
          <div className="learning-empty-body">
            <BookOpen size={22} />
            <p>This item is an external learning resource. Use the verified source link below for the full material.</p>
          </div>
        )}

        {resource.external_url ? (
          <a className="learning-source-link" href={resource.external_url} target="_blank" rel="noopener noreferrer">
            Open verified source <ExternalLink size={14} />
          </a>
        ) : null}

        {resource.reviewed_by ? (
          <p className="learning-review-note">Reviewed by: {resource.reviewed_by}</p>
        ) : null}
      </article>
    </PageShell>
  );
}
