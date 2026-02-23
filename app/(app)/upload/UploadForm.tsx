"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createTrack } from "@/app/actions/tracks";

const ALLOWED_TYPES = ["audio/mpeg", "audio/mp3", "audio/x-m4a", "audio/mp4", "audio/wav", "audio/x-wav"];
const EXT_MAP: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/x-m4a": "m4a",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

function getDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      resolve(0);
    });
  });
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Please choose an MP3, M4A, or WAV file.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
    if (!title.trim()) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }, [title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Select a file first.");
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setUploading(false);
      return;
    }

    const ext = EXT_MAP[file.type] ?? "mp3";
    const trackId = crypto.randomUUID();
    const path = `audio/${user.id}/${trackId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    setProgress(100);
    const durationSec = await getDuration(file);
    const formData = new FormData();
    formData.set("title", title.trim() || file.name);
    formData.set("artist", artist.trim());
    formData.set("album", album.trim());
    formData.set("storage_path", path);
    formData.set("mime_type", file.type);
    formData.set("duration_sec", String(durationSec));

    const result = await createTrack(formData);
    if (result.error) {
      setError(result.error);
      setUploading(false);
      return;
    }

    setUploading(false);
    setFile(null);
    setTitle("");
    setArtist("");
    setAlbum("");
    setProgress(0);
    router.push("/library");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#b3b3b3] mb-1">File (MP3, M4A, WAV)</label>
        <input
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={onFileChange}
          disabled={uploading}
          className="block w-full text-sm text-[#b3b3b3] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-black file:font-medium"
        />
      </div>
      {file && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={uploading}
              className="w-full px-4 py-2 rounded bg-surface-600 text-white border border-surface-500 focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">Artist</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-2 rounded bg-surface-600 text-white border border-surface-500 focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b3b3b3] mb-1">Album</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              disabled={uploading}
              className="w-full px-4 py-2 rounded bg-surface-600 text-white border border-surface-500 focus:border-accent focus:outline-none"
            />
          </div>
          {uploading && (
            <div>
              <div className="h-2 bg-surface-600 rounded overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[#b3b3b3] mt-1">Uploading…</p>
            </div>
          )}
        </>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!file || uploading}
        className="px-6 py-2.5 rounded-full bg-accent hover:bg-accentHover font-medium text-black disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
