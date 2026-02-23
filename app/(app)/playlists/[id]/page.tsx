import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlaylistDetail } from "./PlaylistDetail";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: playlist } = await supabase
    .from("playlists")
    .select("id, name, user_id")
    .eq("id", id)
    .single();

  if (!playlist || playlist.user_id !== user.id) notFound();

  const { data: playlistTracks } = await supabase
    .from("playlist_tracks")
    .select("track_id, position")
    .eq("playlist_id", id)
    .order("position", { ascending: true });

  const trackIds = playlistTracks?.map((pt) => pt.track_id) ?? [];
  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .in("id", trackIds.length ? trackIds : ["__none__"]);

  const orderMap = new Map(playlistTracks?.map((pt) => [pt.track_id, pt.position]) ?? []);
  const sortedTracks = (tracks ?? []).sort(
    (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{playlist.name}</h1>
      <PlaylistDetail playlistId={id} playlistName={playlist.name} tracks={sortedTracks} />
    </div>
  );
}
