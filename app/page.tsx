import { HomePage } from "@/components/home-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return <HomePage profile={null} latestAnnouncement={null} />;
  }

  const [profileResult, announcementResult] = await Promise.all([
    supabase
      .from("mosque_profile")
      .select("introduction,address,map_url")
      .eq("id", true)
      .maybeSingle(),
    supabase
      .from("announcements")
      .select("title,slug,excerpt,body,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <HomePage
      profile={profileResult.error ? null : profileResult.data}
      latestAnnouncement={announcementResult.error ? null : announcementResult.data}
    />
  );
}
