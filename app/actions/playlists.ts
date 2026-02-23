"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPlaylist(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  if (!name?.trim()) return { error: "Name is required" };

  const { data, error } = await supabase
    .from("playlists")
    .insert({ user_id: user.id, name: name.trim() })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/playlists");
  return { data };
}

export async function addTrackToPlaylist(playlistId: string, trackId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: max } = await supabase
    .from("playlist_tracks")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = (max?.position ?? -1) + 1;

  const { error } = await supabase.from("playlist_tracks").insert({
    playlist_id: playlistId,
    track_id: trackId,
    position,
  });

  if (error) return { error: error.message };
  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
  return {};
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId);

  if (error) return { error: error.message };
  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
  return {};
}

export async function reorderPlaylistTrack(
  playlistId: string,
  trackId: string,
  direction: "up" | "down"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: rows } = await supabase
    .from("playlist_tracks")
    .select("track_id, position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (!rows || rows.length < 2) return {};

  const idx = rows.findIndex((r) => r.track_id === trackId);
  if (idx < 0) return {};

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return {};

  const [a, b] = [rows[idx].position, rows[swapIdx].position];
  await supabase
    .from("playlist_tracks")
    .update({ position: b })
    .eq("playlist_id", playlistId)
    .eq("track_id", trackId);
  await supabase
    .from("playlist_tracks")
    .update({ position: a })
    .eq("playlist_id", playlistId)
    .eq("track_id", rows[swapIdx].track_id);

  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
  return {};
}

export async function deletePlaylist(playlistId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("playlists").delete().eq("id", playlistId).eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/playlists");
  return {};
}
