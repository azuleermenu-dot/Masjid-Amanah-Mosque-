import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowLeft, Images, ShieldCheck, Trash2 } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin } from "@/app/admin/actions";
import { deleteGalleryItem, uploadGalleryItem } from "./actions";

export const metadata: Metadata = { title: "Manage Gallery", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ saved?: string; deleted?: string; error?: string }> };

export default async function ManageGalleryPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?setup=required");
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("role").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) redirect("/admin/login?access=denied");

  const { data: items, error } = await supabase.from("gallery_items")
    .select("id,title,image_path,alt_text,category,is_published,created_at")
    .order("created_at", { ascending: false }).limit(60);

  const messages: Record<string, string> = {
    validation: "Use a JPG, PNG, or WebP image up to 5 MB. Check title and descriptive alt text.",
    upload: "The image upload failed. Check the mosque-gallery bucket and its policies.",
    save: "The image uploaded but the gallery record could not be saved. Please try again.",
    delete: "The gallery item could not be deleted.",
  };

  const previews = items?.length ? await Promise.all(items.map(async (item) => {
    const { data } = await supabase.storage.from("mosque-gallery").createSignedUrl(item.image_path, 3600);
    return { ...item, previewUrl: data?.signedUrl ?? null };
  })) : [];

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar"><Link className="brand" href="/"><span className="brand-mark">۞</span><span className="brand-copy"><strong>MASJID AMANAH</strong><span className="arabic" lang="ar">مسجد الأمانة</span></span></Link><form action={signOutAdmin}><button className="admin-signout" type="submit">Sign out</button></form></header>
      <div className="admin-dashboard-wrap">
        <Link href="/admin" className="admin-back"><ArrowLeft size={14} /> Dashboard</Link>
        <div className="admin-title-row"><div><span className="eyebrow">Approved photography</span><h1 className="display">Gallery</h1><p>Upload real mosque and community photographs only when permission to publish has been granted.</p></div><span className="status-pill"><ShieldCheck size={14} /> Authorized administrator</span></div>
        {params.saved === "1" && <p className="success-message" role="status">Gallery image saved.</p>}
        {params.deleted === "1" && <p className="success-message" role="status">Gallery image deleted.</p>}
        {params.error && <p className="form-error" role="alert">{messages[params.error] ?? "The request could not be completed."}</p>}

        <section className="admin-editor"><div className="admin-section-heading"><Images size={18} /><h2>Upload a photograph</h2></div>
          <form action={uploadGalleryItem} className="admin-form" encType="multipart/form-data">
            <label htmlFor="title">Photo title</label><input id="title" name="title" required minLength={2} maxLength={140} />
            <label htmlFor="alt_text">Describe the photograph for accessibility</label><input id="alt_text" name="alt_text" required minLength={5} maxLength={240} />
            <label htmlFor="category">Category (optional)</label><input id="category" name="category" maxLength={80} />
            <label htmlFor="image">Image file · JPG, PNG, or WebP · maximum 5 MB</label><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
            <label className="checkbox-label"><input type="checkbox" name="is_published" /> Publish this photograph</label>
            <button className="btn-primary admin-submit" type="submit">Upload gallery image</button>
            <p className="form-hint">Do not upload private images or photographs of people without appropriate permission.</p>
          </form>
        </section>

        <section className="admin-list-section"><div className="admin-section-heading"><Images size={18} /><h2>Uploaded photographs</h2></div>
          {error ? <p className="form-error">Unable to load gallery records.</p> : !previews.length ? <p className="admin-empty">No photographs have been uploaded.</p> : <div className="admin-list">{previews.map((item) => {
            return <article className="admin-list-row" key={item.id}>
              <div className="admin-gallery-preview">{item.previewUrl ? <Image src={item.previewUrl} alt="" width={76} height={60} unoptimized /> : <span className="gallery-preview-missing">Preview unavailable</span>}<div><strong>{item.title}</strong><span>{item.category || "Uncategorized"}</span></div></div>
              <div className="admin-row-actions"><span className={item.is_published ? "published-badge" : "draft-badge"}>{item.is_published ? "Published" : "Draft"}</span><form action={deleteGalleryItem}><input type="hidden" name="id" value={item.id} /><button className="icon-danger" type="submit" aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></form></div>
            </article>;
          })}</div>}
        </section>
      </div>
    </main>
  );
}
