import { createClient } from "@/lib/supabase/server";
import { LibraryContent } from "./LibraryContent";
import { RecentlyPlayed } from "./RecentlyPlayed";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ addTo?: string }>;
}) {
  const { addTo } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: recentRows } = await supabase
    .from("play_history")
    .select("track_id, played_at")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(20);

  const recentTrackIds = [...new Set((recentRows ?? []).map((r) => r.track_id))];
  const { data: recentTracks } = await supabase
    .from("tracks")
    .select("*")
    .in("id", recentTrackIds.length ? recentTrackIds : ["__none__"]);

  const recentOrder = new Map((recentRows ?? []).map((r) => [r.track_id, r.played_at]));
  const sortedRecent = (recentTracks ?? []).sort(
    (a, b) => new Date(recentOrder.get(b.id) ?? 0).getTime() - new Date(recentOrder.get(a.id) ?? 0).getTime()
  );

  return (
    <div className="p-6">
      {sortedRecent.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-3">Recently played</h2>
          <RecentlyPlayed tracks={sortedRecent} />
          <h1 className="text-2xl font-bold mb-6 mt-10">Your Library</h1>
        </>
      )}
      {sortedRecent.length === 0 && <h1 className="text-2xl font-bold mb-6">Your Library</h1>}
      <LibraryContent tracks={tracks ?? []} addToPlaylistId={addTo} />
    </div>
  );
}
