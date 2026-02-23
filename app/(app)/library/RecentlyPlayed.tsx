"use client";

import { usePlayerStore } from "@/lib/store/playerStore";
import type { Track } from "@/lib/types/database";

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RecentlyPlayed({ tracks }: { tracks: Track[] }) {
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  return (
    <ul className="space-y-1 mb-6">
      {tracks.slice(0, 20).map((track) => {
        const isActive = currentTrack?.id === track.id;
        return (
          <li
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-600 group"
          >
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
          </li>
        );
      })}
    </ul>
  );
}
