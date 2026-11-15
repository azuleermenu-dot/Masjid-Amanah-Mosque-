import type { Metadata } from "next";
import Image from "next/image";
import { Images } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PendingPanel } from "@/components/pending-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const supabase = await createSupabaseServerClient();
  const { data: items, error } = supabase
    ? await supabase.from("gallery_items").select("id,title,image_path,alt_text,category").eq("is_published", true).order("created_at", { ascending: false }).limit(60)
    : { data: null, error: null };

  const publicImages = items?.length && supabase ? await Promise.all(items.map(async (item) => {
    const { data, error: signingError } = await supabase.storage.from("mosque-gallery").createSignedUrl(item.image_path, 3600);
    return { ...item, imageUrl: signingError ? null : data.signedUrl };
  })) : [];

  return (
    <PageShell eyebrow="Gallery · معرض الصور" title="Moments from the community." description="Photographs of the actual mosque, its activities, and community life.">
      {publicImages.length ? <div className="gallery-grid">{publicImages.map((item) => item.imageUrl ? <figure className="gallery-card" key={item.id}><div className="gallery-image"><Image src={item.imageUrl} alt={item.alt_text} fill sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></div><figcaption><strong>{item.title}</strong>{item.category && <span>{item.category}</span>}</figcaption></figure> : null)}</div> : <div className="empty-feed"><Images size={30} /><span className="eyebrow">Photo gallery</span><h2>Gallery coming soon.</h2><p>{error ? "The gallery could not be loaded." : "Only photographs provided or approved by the mosque will be displayed."}</p></div>}
      {!supabase && <PendingPanel title="Gallery is not connected yet." description="The gallery will remain empty until actual mosque photographs are provided with permission and the dedicated storage project is configured." />}
    </PageShell>
  );
}
