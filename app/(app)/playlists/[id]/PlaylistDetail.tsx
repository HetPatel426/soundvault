"use client";

import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/lib/store/playerStore";
import {
  removeTrackFromPlaylist,
  reorderPlaylistTrack,
} from "@/app/actions/playlists";
import type { Track } from "@/lib/types/database";

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlaylistDetail({
  playlistId,
  playlistName,
  tracks,
}: {
  playlistId: string;
  playlistName: string;
  tracks: Track[];
}) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const router = useRouter();

  async function handleRemove(trackId: string) {
    await removeTrackFromPlaylist(playlistId, trackId);
    router.refresh();
  }

  async function handleReorder(trackId: string, direction: "up" | "down") {
    await reorderPlaylistTrack(playlistId, trackId, direction);
    router.refresh();
  }

  if (!tracks.length) {
    return (
      <div className="space-y-2">
        <p className="text-[#b3b3b3]">No tracks in this playlist.</p>
        <a
          href={`/library?addTo=${playlistId}`}
          className="inline-block px-4 py-2 rounded-full bg-accent hover:bg-accentHover font-medium text-black"
        >
          Add tracks from Library
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <a
        href={`/library?addTo=${playlistId}`}
        className="inline-block px-4 py-2 rounded-full bg-surface-600 hover:bg-surface-500 font-medium"
      >
        Add tracks from Library
      </a>
      <ul className="space-y-1">
      {tracks.map((track, index) => {
        const isActive = currentTrack?.id === track.id;
        return (
          <li
            key={track.id}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-surface-600 group"
          >
            <span className="w-6 text-center text-[#b3b3b3] text-sm tabular-nums">{index + 1}</span>
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
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button
                type="button"
                onClick={() => handleReorder(track.id, "up")}
                disabled={index === 0}
                className="p-1.5 rounded text-[#b3b3b3] hover:text-white disabled:opacity-30"
                aria-label="Move up"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleReorder(track.id, "down")}
                disabled={index === tracks.length - 1}
                className="p-1.5 rounded text-[#b3b3b3] hover:text-white disabled:opacity-30"
                aria-label="Move down"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleRemove(track.id)}
                className="p-1.5 rounded text-[#b3b3b3] hover:text-red-400"
                aria-label="Remove"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          </li>
        );
      })}
      </ul>
    </div>
  );
}
