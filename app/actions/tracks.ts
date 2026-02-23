"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ALLOWED_MIME = ["audio/mpeg", "audio/mp3", "audio/x-m4a", "audio/mp4", "audio/wav", "audio/x-wav"];

export async function createTrack(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const artist = (formData.get("artist") as string) || null;
  const album = (formData.get("album") as string) || null;
  const storagePath = formData.get("storage_path") as string;
  const mimeType = formData.get("mime_type") as string;
  const durationSec = Number(formData.get("duration_sec")) || 0;

  if (!title?.trim()) return { error: "Title is required" };
  if (!storagePath?.trim()) return { error: "Storage path is required" };
  if (!ALLOWED_MIME.includes(mimeType)) return { error: "Invalid file type" };

  const { data, error } = await supabase
    .from("tracks")
    .insert({
      user_id: user.id,
      title: title.trim(),
      artist: artist?.trim() || null,
      album: album?.trim() || null,
      duration_sec: Math.round(durationSec),
      storage_path: storagePath,
      mime_type: mimeType,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/library");
  revalidatePath("/");
  return { data };
}
