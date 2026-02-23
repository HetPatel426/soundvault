"use client";

import { useState } from "react";
import Link from "next/link";
import { usePlayerStore } from "@/lib/store/playerStore";
import { addTrackToPlaylist } from "@/app/actions/playlists";
import type { Track } from "@/lib/types/database";

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LibraryContent({
  tracks,
  addToPlaylistId,
}: {
  tracks: Track[];
  addToPlaylistId?: string;
}) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  if (!tracks.length) {
    return (
      <p className="text-[#b3b3b3]">No tracks yet. Upload some music to get started.</p>
    );
  }

  return (
    <div className="space-y-2">
      {addToPlaylistId && (
        <p className="text-[#b3b3b3] text-sm">
          Click &quot;Add&quot; on a track to add it to your playlist.{" "}
          <Link href="/playlists" className="text-accent hover:underline">
            Back to Playlists
          </Link>
        </p>
      )}
      <ul className="space-y-1">
        {tracks.map((track, index) => {
          const isActive = currentTrack?.id === track.id;
          return (
            <li
              key={track.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-600 group"
            >
              <span className="w-8 text-center text-[#b3b3b3] text-sm tabular-nums">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => playTrack(track, tracks)}
                className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center hover:scale-105 transition shrink-0"
              >
                {isActive && isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`font-medium truncate ${isActive ? "text-accent" : ""}`}>
                  {track.title}
                </p>
                <p className="text-sm text-[#b3b3b3] truncate">
                  {[track.artist, track.album].filter(Boolean).join(" · ") || "Unknown"}
                </p>
              </div>
              <span className="text-sm text-[#b3b3b3] tabular-nums shrink-0">
                {formatDuration(track.duration_sec)}
              </span>
              {addToPlaylistId && (
                <AddToPlaylistButton playlistId={addToPlaylistId} trackId={track.id} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AddToPlaylistButton({
  playlistId,
  trackId,
}: {
  playlistId: string;
  trackId: string;
}) {
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  async function handleAdd() {
    setAdding(true);
    const result = await addTrackToPlaylist(playlistId, trackId);
    setAdding(false);
    if (!result.error) setDone(true);
  }

  if (done) return <span className="text-accent text-sm">Added</span>;
  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={adding}
      className="px-3 py-1 rounded bg-accent text-black text-sm font-medium hover:bg-accentHover disabled:opacity-50"
    >
      {adding ? "…" : "Add"}
    </button>
  );
}
